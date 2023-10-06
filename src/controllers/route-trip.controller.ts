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
  Route,
  Trip,
} from '../models';
import {RouteRepository} from '../repositories';

export class RouteTripController {
  constructor(
    @repository(RouteRepository) protected routeRepository: RouteRepository,
  ) { }

  @get('/routes/{id}/trips', {
    responses: {
      '200': {
        description: 'Array of Route has many Trip',
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
    return this.routeRepository.trips(id).find(filter);
  }

  @post('/routes/{id}/trips', {
    responses: {
      '200': {
        description: 'Route model instance',
        content: {'application/json': {schema: getModelSchemaRef(Trip)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Route.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trip, {
            title: 'NewTripInRoute',
            exclude: ['_id'],
            optional: ['routeId']
          }),
        },
      },
    }) trip: Omit<Trip, '_id'>,
  ): Promise<Trip> {
    return this.routeRepository.trips(id).create(trip);
  }

  @patch('/routes/{id}/trips', {
    responses: {
      '200': {
        description: 'Route.Trip PATCH success count',
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
    return this.routeRepository.trips(id).patch(trip, where);
  }

  @del('/routes/{id}/trips', {
    responses: {
      '200': {
        description: 'Route.Trip DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Trip)) where?: Where<Trip>,
  ): Promise<Count> {
    return this.routeRepository.trips(id).delete(where);
  }
}
