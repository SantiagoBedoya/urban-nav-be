import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TripRating} from '../models';
import {TripRatingRepository} from '../repositories';

export class TripRatingController {
  constructor(
    @repository(TripRatingRepository)
    public tripRatingRepository : TripRatingRepository,
  ) {}

  @post('/trip-ratings')
  @response(200, {
    description: 'TripRating model instance',
    content: {'application/json': {schema: getModelSchemaRef(TripRating)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripRating, {
            title: 'NewTripRating',
            exclude: ['_id'],
          }),
        },
      },
    })
    tripRating: Omit<TripRating, '_id'>,
  ): Promise<TripRating> {
    return this.tripRatingRepository.create(tripRating);
  }

  @get('/trip-ratings/count')
  @response(200, {
    description: 'TripRating model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TripRating) where?: Where<TripRating>,
  ): Promise<Count> {
    return this.tripRatingRepository.count(where);
  }

  @get('/trip-ratings')
  @response(200, {
    description: 'Array of TripRating model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TripRating, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TripRating) filter?: Filter<TripRating>,
  ): Promise<TripRating[]> {
    return this.tripRatingRepository.find(filter);
  }

  @patch('/trip-ratings')
  @response(200, {
    description: 'TripRating PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripRating, {partial: true}),
        },
      },
    })
    tripRating: TripRating,
    @param.where(TripRating) where?: Where<TripRating>,
  ): Promise<Count> {
    return this.tripRatingRepository.updateAll(tripRating, where);
  }

  @get('/trip-ratings/{id}')
  @response(200, {
    description: 'TripRating model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TripRating, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TripRating, {exclude: 'where'}) filter?: FilterExcludingWhere<TripRating>
  ): Promise<TripRating> {
    return this.tripRatingRepository.findById(id, filter);
  }

  @patch('/trip-ratings/{id}')
  @response(204, {
    description: 'TripRating PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TripRating, {partial: true}),
        },
      },
    })
    tripRating: TripRating,
  ): Promise<void> {
    await this.tripRatingRepository.updateById(id, tripRating);
  }

  @put('/trip-ratings/{id}')
  @response(204, {
    description: 'TripRating PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tripRating: TripRating,
  ): Promise<void> {
    await this.tripRatingRepository.replaceById(id, tripRating);
  }

  @del('/trip-ratings/{id}')
  @response(204, {
    description: 'TripRating DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tripRatingRepository.deleteById(id);
  }
}
