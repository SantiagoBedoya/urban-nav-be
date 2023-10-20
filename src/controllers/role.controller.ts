import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
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
import {Permissions} from '../auth/permissions.enum';
import {Role} from '../models';
import {RoleRepository} from '../repositories';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateRole],
  })
  @post('/roles')
  @response(200, {
    description: 'Role model instance',
    content: {'application/json': {schema: getModelSchemaRef(Role)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRole',
            exclude: ['_id'],
          }),
        },
      },
    })
    role: Omit<Role, '_id'>,
  ): Promise<Role> {
    return this.roleRepository.create(role);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListRole],
  })
  @get('/roles/count')
  @response(200, {
    description: 'Role model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Role) where?: Where<Role>): Promise<Count> {
    return this.roleRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListRole],
  })
  @get('/roles')
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Role) filter?: Filter<Role>): Promise<Role[]> {
    return this.roleRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateRole],
  })
  @patch('/roles')
  @response(200, {
    description: 'Role PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.updateAll(role, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListRole],
  })
  @get('/roles/{id}')
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Role, {exclude: 'where'}) filter?: FilterExcludingWhere<Role>,
  ): Promise<Role> {
    return this.roleRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateRole],
  })
  @patch('/roles/{id}')
  @response(204, {
    description: 'Role PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    await this.roleRepository.updateById(id, role);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateRole],
  })
  @put('/roles/{id}')
  @response(204, {
    description: 'Role PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() role: Role,
  ): Promise<void> {
    await this.roleRepository.replaceById(id, role);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteRole],
  })
  @del('/roles/{id}')
  @response(204, {
    description: 'Role DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.roleRepository.deleteById(id);
  }
}
