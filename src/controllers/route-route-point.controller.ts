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
  RoutePoint,
} from '../models';
import {RouteRepository} from '../repositories';

export class RouteRoutePointController {
  constructor(
    @repository(RouteRepository) protected routeRepository: RouteRepository,
  ) { }

  @get('/routes/{id}/route-points', {
    responses: {
      '200': {
        description: 'Array of Route has many RoutePoint',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RoutePoint)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RoutePoint>,
  ): Promise<RoutePoint[]> {
    return this.routeRepository.routePoints(id).find(filter);
  }

  @post('/routes/{id}/route-points', {
    responses: {
      '200': {
        description: 'Route model instance',
        content: {'application/json': {schema: getModelSchemaRef(RoutePoint)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Route.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoutePoint, {
            title: 'NewRoutePointInRoute',
            exclude: ['_id'],
            optional: ['routeId']
          }),
        },
      },
    }) routePoint: Omit<RoutePoint, '_id'>,
  ): Promise<RoutePoint> {
    return this.routeRepository.routePoints(id).create(routePoint);
  }

  @patch('/routes/{id}/route-points', {
    responses: {
      '200': {
        description: 'Route.RoutePoint PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoutePoint, {partial: true}),
        },
      },
    })
    routePoint: Partial<RoutePoint>,
    @param.query.object('where', getWhereSchemaFor(RoutePoint)) where?: Where<RoutePoint>,
  ): Promise<Count> {
    return this.routeRepository.routePoints(id).patch(routePoint, where);
  }

  @del('/routes/{id}/route-points', {
    responses: {
      '200': {
        description: 'Route.RoutePoint DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RoutePoint)) where?: Where<RoutePoint>,
  ): Promise<Count> {
    return this.routeRepository.routePoints(id).delete(where);
  }
}
