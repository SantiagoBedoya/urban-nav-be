import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  Vehicle,
} from '../models';
import {UserRepository} from '../repositories';

export class UserVehicleController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/vehicle', {
    responses: {
      '200': {
        description: 'Vehicle belonging to User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Vehicle),
          },
        },
      },
    },
  })
  async getVehicle(
    @param.path.string('id') id: typeof User.prototype._id,
  ): Promise<Vehicle> {
    return this.userRepository.vehicle(id);
  }
}
