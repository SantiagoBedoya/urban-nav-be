import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  Response,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Permissions} from '../auth/permissions.enum';
import {Contacts, User} from '../models';
import {UserRepository} from '../repositories';
import {CloudinaryService, UsersService} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(UsersService)
    public userService: UsersService,
    @service(CloudinaryService)
    public cloudinaryService: CloudinaryService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateUser],
  })
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User> {
    return this.userService.createUser(user);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListUser],
  })
  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListProfile],
  })
  @get('/users/me')
  @response(200, {
    description: 'Logged user',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async getMyInformation(@inject(SecurityBindings.USER) user: UserProfile) {
    return this.userRepository.findById(user.userId, {
      fields: {
        password: false,
        secret2fa: false,
      },
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListProfile],
  })
  @patch('/users/me')
  @response(204, {
    description: 'File to upload',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async updatePhoto(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const cldResponse = await this.cloudinaryService.uploadFile(request, res);
    if (!cldResponse.done) {
      console.log(cldResponse.err);
      throw new HttpErrors.InternalServerError('Something went wrong');
    }
    await this.userRepository.updateById(user.userId, {
      photoURL: cldResponse.url,
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListUser],
  })
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateUser],
  })
  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListUser],
  })
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListProfile],
  })
  @get('/users/{id}/contacts')
  @response(200, {
    description: 'User contacts model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Contacts),
      },
    },
  })
  async findByIdContacts(@param.path.string('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    return user.contacts;
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateUser],
  })
  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListUser],
  })
  @patch('/users/{id}/contacts')
  @response(204, {
    description: 'User contacts PATCH success',
  })
  async updateByIdContacts(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contacts),
        },
      },
    })
    contacts: Contacts,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    user.contacts = contacts.items;
    await this.userRepository.updateById(id, user);
  }


@post('/users/{id}/contacts')
@response(201, {
  description: 'Contact created successfully',
})
async createContact(
  @param.path.string('id') id: string,
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Contacts),
      },
    },
  })
  newContact: Contacts,
): Promise<Contacts> {
  const user = await this.userRepository.findById(id);
  if (!user) {
    throw new HttpErrors.NotFound('User not found');
  }
  user.contacts?.push(newContact);
  await this.userRepository.update(user);
  return newContact;
}
  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateUser],
  })

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteUser],
  })
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
