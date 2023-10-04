import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  TripComment,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTripCommentController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'Array of User has many TripComment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TripComment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TripComment>,
  ): Promise<TripComment[]> {
    return this.userRepository.tripComments(id).find(filter);
  }

  @post('/users/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(TripComment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripComment, {
            title: 'NewTripCommentInUser',
            exclude: ['_id'],
            optional: ['userId']
          }),
        },
      },
    }) tripComment: Omit<TripComment, '_id'>,
  ): Promise<TripComment> {
    return this.userRepository.tripComments(id).create(tripComment);
  }

  @patch('/users/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'User.TripComment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripComment, {partial: true}),
        },
      },
    })
    tripComment: Partial<TripComment>,
    @param.query.object('where', getWhereSchemaFor(TripComment)) where?: Where<TripComment>,
  ): Promise<Count> {
    return this.userRepository.tripComments(id).patch(tripComment, where);
  }

  @del('/users/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'User.TripComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TripComment)) where?: Where<TripComment>,
  ): Promise<Count> {
    return this.userRepository.tripComments(id).delete(where);
  }
}
