import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
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
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Permissions} from '../auth/permissions.enum';
import {TripComment} from '../models';
import {TripCommentRepository} from '../repositories';

export class TripCommentController {
  constructor(
    @repository(TripCommentRepository)
    public tripCommentRepository: TripCommentRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateTripComment],
  })
  @post('/trip-comments')
  @response(200, {
    description: 'TripComment model instance',
    content: {'application/json': {schema: getModelSchemaRef(TripComment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripComment, {
            title: 'NewTripComment',
            exclude: ['_id'],
          }),
        },
      },
    })
    tripComment: Omit<TripComment, '_id'>,
    @inject(SecurityBindings.USER)
    user: UserProfile,
  ): Promise<TripComment> {
    return this.tripCommentRepository.create({
      ...tripComment,
      publisherId: user.userId,
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTripComment],
  })
  @get('/trip-comments/count')
  @response(200, {
    description: 'TripComment model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TripComment) where?: Where<TripComment>,
  ): Promise<Count> {
    return this.tripCommentRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTripComment],
  })
  @get('/trip-comments')
  @response(200, {
    description: 'Array of TripComment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TripComment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    user: UserProfile,
  ): Promise<TripComment[]> {
    return this.tripCommentRepository.find({
      include: [
        {
          relation: 'publisher',
          scope: {
            fields: {
              _id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        {
          relation: 'receiver',
          scope: {
            fields: {
              _id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      ],
      where: {
        or: [
          {
            publisherId: user.userId,
          },
          {
            receiverId: user.userId,
          },
        ],
      },
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateTripComment],
  })
  @patch('/trip-comments')
  @response(200, {
    description: 'TripComment PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripComment, {partial: true}),
        },
      },
    })
    tripComment: TripComment,
    @param.where(TripComment) where?: Where<TripComment>,
  ): Promise<Count> {
    return this.tripCommentRepository.updateAll(tripComment, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTripComment],
  })
  @get('/trip-comments/{id}')
  @response(200, {
    description: 'TripComment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TripComment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TripComment, {exclude: 'where'})
    filter?: FilterExcludingWhere<TripComment>,
  ): Promise<TripComment> {
    return this.tripCommentRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateTripComment],
  })
  @patch('/trip-comments/{id}')
  @response(204, {
    description: 'TripComment PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripComment, {partial: true}),
        },
      },
    })
    tripComment: TripComment,
  ): Promise<void> {
    await this.tripCommentRepository.updateById(id, tripComment);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateTripComment],
  })
  @put('/trip-comments/{id}')
  @response(204, {
    description: 'TripComment PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tripComment: TripComment,
  ): Promise<void> {
    await this.tripCommentRepository.replaceById(id, tripComment);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteTripComment],
  })
  @del('/trip-comments/{id}')
  @response(204, {
    description: 'TripComment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tripCommentRepository.deleteById(id);
  }
}
