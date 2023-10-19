import {service} from '@loopback/core';
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
import {CreateRouteRequest, PointsForDijkstra, Route} from '../models';
import {RouteRepository} from '../repositories';
import {RouteService} from '../services';

export class RouteController {
  constructor(
    @repository(RouteRepository)
    public routeRepository: RouteRepository,
    @service(RouteService)
    public routeService: RouteService,
  ) {}

  @post('/routes')
  @response(200, {
    description: 'Route model instance',
    content: {'application/json': {schema: getModelSchemaRef(Route)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CreateRouteRequest, {
            title: 'CreateRouteRequest',
          }),
        },
      },
    })
    route: CreateRouteRequest,
  ) {
    return this.routeService.create(route);
  }

  @get('/routes/count')
  @response(200, {
    description: 'Route model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Route) where?: Where<Route>): Promise<Count> {
    return this.routeRepository.count(where);
  }

  @get('/routes')
  @response(200, {
    description: 'Array of Route model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Route, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Route[]> {
    return this.routeRepository.find({
      include: ['routePoints'],
    });
  }

  @patch('/routes')
  @response(200, {
    description: 'Route PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {partial: true}),
        },
      },
    })
    route: Route,
    @param.where(Route) where?: Where<Route>,
  ): Promise<Count> {
    return this.routeRepository.updateAll(route, where);
  }

  @get('/routes/{id}')
  @response(200, {
    description: 'Route model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Route, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Route, {exclude: 'where'})
    filter?: FilterExcludingWhere<Route>,
  ): Promise<Route> {
    return this.routeRepository.findById(id, filter);
  }

  @patch('/routes/{id}')
  @response(204, {
    description: 'Route PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {partial: true}),
        },
      },
    })
    route: Route,
  ): Promise<void> {
    await this.routeRepository.updateById(id, route);
  }

  @put('/routes/{id}')
  @response(204, {
    description: 'Route PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() route: Route,
  ): Promise<void> {
    await this.routeRepository.replaceById(id, route);
  }

  @del('/routes/{id}')
  @response(204, {
    description: 'Route DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.routeRepository.deleteById(id);
  }

  @post('/best-route')
  @response(200, {
    description: 'Route model instance',
    content: {'application/json': {schema: getModelSchemaRef(Route)}},
  })
  async getBestRoute(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PointsForDijkstra, {
            title: 'PointsForDijkstra',
          }),
        },
      },
    })
    points: PointsForDijkstra,
  ) {
    return this.routeService.getBestRoute(points);
  }
}
