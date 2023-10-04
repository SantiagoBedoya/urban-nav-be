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
  Trip,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTripController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/trips', {
    responses: {
      '200': {
        description: 'Array of User has many Trip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Trip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Trip>,
  ): Promise<Trip[]> {
    return this.userRepository.trips(id).find(filter);
  }

  @post('/users/{id}/trips', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Trip)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trip, {
            title: 'NewTripInUser',
            exclude: ['_id'],
            optional: ['userId']
          }),
        },
      },
    }) trip: Omit<Trip, '_id'>,
  ): Promise<Trip> {
    return this.userRepository.trips(id).create(trip);
  }

  @patch('/users/{id}/trips', {
    responses: {
      '200': {
        description: 'User.Trip PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trip, {partial: true}),
        },
      },
    })
    trip: Partial<Trip>,
    @param.query.object('where', getWhereSchemaFor(Trip)) where?: Where<Trip>,
  ): Promise<Count> {
    return this.userRepository.trips(id).patch(trip, where);
  }

  @del('/users/{id}/trips', {
    responses: {
      '200': {
        description: 'User.Trip DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Trip)) where?: Where<Trip>,
  ): Promise<Count> {
    return this.userRepository.trips(id).delete(where);
  }
}
