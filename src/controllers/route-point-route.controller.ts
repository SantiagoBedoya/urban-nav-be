import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RoutePoint,
  Route,
} from '../models';
import {RoutePointRepository} from '../repositories';

export class RoutePointRouteController {
  constructor(
    @repository(RoutePointRepository)
    public routePointRepository: RoutePointRepository,
  ) { }

  @get('/route-points/{id}/route', {
    responses: {
      '200': {
        description: 'Route belonging to RoutePoint',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Route),
          },
        },
      },
    },
  })
  async getRoute(
    @param.path.string('id') id: typeof RoutePoint.prototype._id,
  ): Promise<Route> {
    return this.routePointRepository.route(id);
  }
}
