import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Route,
  Point,
} from '../models';
import {RouteRepository} from '../repositories';

export class RoutePointController {
  constructor(
    @repository(RouteRepository)
    public routeRepository: RouteRepository,
  ) { }

  @get('/routes/{id}/point', {
    responses: {
      '200': {
        description: 'Point belonging to Route',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Point),
          },
        },
      },
    },
  })
  async getPoint(
    @param.path.string('id') id: typeof Route.prototype._id,
  ): Promise<Point> {
    return this.routeRepository.origin(id);
  }
}
