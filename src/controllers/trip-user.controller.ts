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
  User,
} from '../models';
import {TripRepository} from '../repositories';

export class TripUserController {
  constructor(
    @repository(TripRepository)
    public tripRepository: TripRepository,
  ) { }

  @get('/trips/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Trip',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Trip.prototype._id,
  ): Promise<User> {
    return this.tripRepository.driver(id);
  }
}
