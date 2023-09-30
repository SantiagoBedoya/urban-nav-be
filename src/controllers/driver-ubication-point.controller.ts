import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  DriverUbication,
  Point,
} from '../models';
import {DriverUbicationRepository} from '../repositories';

export class DriverUbicationPointController {
  constructor(
    @repository(DriverUbicationRepository)
    public driverUbicationRepository: DriverUbicationRepository,
  ) { }

  @get('/driver-ubications/{id}/point', {
    responses: {
      '200': {
        description: 'Point belonging to DriverUbication',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Point),
          },
        },
      },
    },
  })
  async getPoint(
    @param.path.string('id') id: typeof DriverUbication.prototype._id,
  ): Promise<Point> {
    return this.driverUbicationRepository.point(id);
  }
}
