import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Vehicle,
  User,
} from '../models';
import {VehicleRepository} from '../repositories';

export class VehicleUserController {
  constructor(
    @repository(VehicleRepository)
    public vehicleRepository: VehicleRepository,
  ) { }

  @get('/vehicles/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Vehicle',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Vehicle.prototype._id,
  ): Promise<User> {
    return this.vehicleRepository.user(id);
  }
}
