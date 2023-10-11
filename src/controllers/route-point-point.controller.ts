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
  Point,
} from '../models';
import {RoutePointRepository} from '../repositories';

export class RoutePointPointController {
  constructor(
    @repository(RoutePointRepository)
    public routePointRepository: RoutePointRepository,
  ) { }

  @get('/route-points/{id}/point', {
    responses: {
      '200': {
        description: 'Point belonging to RoutePoint',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Point),
          },
        },
      },
    },
  })
  async getPoint(
    @param.path.string('id') id: typeof RoutePoint.prototype._id,
  ): Promise<Point> {
    return this.routePointRepository.point(id);
  }
}
