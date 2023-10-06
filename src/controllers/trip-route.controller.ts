import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Trip,
  Route,
} from '../models';
import {TripRepository} from '../repositories';

export class TripRouteController {
  constructor(
    @repository(TripRepository)
    public tripRepository: TripRepository,
  ) { }

  @get('/trips/{id}/route', {
    responses: {
      '200': {
        description: 'Route belonging to Trip',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Route),
          },
        },
      },
    },
  })
  async getRoute(
    @param.path.string('id') id: typeof Trip.prototype._id,
  ): Promise<Route> {
    return this.tripRepository.route(id);
  }
}
