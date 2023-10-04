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
  Point,
  Route,
} from '../models';
import {PointRepository} from '../repositories';

export class PointRouteController {
  constructor(
    @repository(PointRepository) protected pointRepository: PointRepository,
  ) { }

  @get('/points/{id}/routes', {
    responses: {
      '200': {
        description: 'Array of Point has many Route',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Route)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Route>,
  ): Promise<Route[]> {
    return this.pointRepository.routes(id).find(filter);
  }

  @post('/points/{id}/routes', {
    responses: {
      '200': {
        description: 'Point model instance',
        content: {'application/json': {schema: getModelSchemaRef(Route)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Point.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {
            title: 'NewRouteInPoint',
            exclude: ['_id'],
            optional: ['pointId']
          }),
        },
      },
    }) route: Omit<Route, '_id'>,
  ): Promise<Route> {
    return this.pointRepository.routes(id).create(route);
  }

  @patch('/points/{id}/routes', {
    responses: {
      '200': {
        description: 'Point.Route PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {partial: true}),
        },
      },
    })
    route: Partial<Route>,
    @param.query.object('where', getWhereSchemaFor(Route)) where?: Where<Route>,
  ): Promise<Count> {
    return this.pointRepository.routes(id).patch(route, where);
  }

  @del('/points/{id}/routes', {
    responses: {
      '200': {
        description: 'Point.Route DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Route)) where?: Where<Route>,
  ): Promise<Count> {
    return this.pointRepository.routes(id).delete(where);
  }
}
