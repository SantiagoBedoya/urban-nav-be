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
  User,
} from '../models';
import {DriverUbicationRepository} from '../repositories';

export class DriverUbicationUserController {
  constructor(
    @repository(DriverUbicationRepository)
    public driverUbicationRepository: DriverUbicationRepository,
  ) { }

  @get('/driver-ubications/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to DriverUbication',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof DriverUbication.prototype._id,
  ): Promise<User> {
    return this.driverUbicationRepository.driver(id);
  }
}
