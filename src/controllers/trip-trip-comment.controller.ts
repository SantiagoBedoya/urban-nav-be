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
  Trip,
  TripComment,
} from '../models';
import {TripRepository} from '../repositories';

export class TripTripCommentController {
  constructor(
    @repository(TripRepository) protected tripRepository: TripRepository,
  ) { }

  @get('/trips/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'Array of Trip has many TripComment',
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
    return this.tripRepository.tripComments(id).find(filter);
  }

  @post('/trips/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'Trip model instance',
        content: {'application/json': {schema: getModelSchemaRef(TripComment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Trip.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripComment, {
            title: 'NewTripCommentInTrip',
            exclude: ['_id'],
            optional: ['tripId']
          }),
        },
      },
    }) tripComment: Omit<TripComment, '_id'>,
  ): Promise<TripComment> {
    return this.tripRepository.tripComments(id).create(tripComment);
  }

  @patch('/trips/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'Trip.TripComment PATCH success count',
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
    return this.tripRepository.tripComments(id).patch(tripComment, where);
  }

  @del('/trips/{id}/trip-comments', {
    responses: {
      '200': {
        description: 'Trip.TripComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TripComment)) where?: Where<TripComment>,
  ): Promise<Count> {
    return this.tripRepository.tripComments(id).delete(where);
  }
}
