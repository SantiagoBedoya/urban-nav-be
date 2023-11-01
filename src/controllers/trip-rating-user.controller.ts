import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TripRating,
  User,
} from '../models';
import {TripRatingRepository} from '../repositories';

export class TripRatingUserController {
  constructor(
    @repository(TripRatingRepository)
    public tripRatingRepository: TripRatingRepository,
  ) { }

  @get('/trip-ratings/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to TripRating',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof TripRating.prototype._id,
  ): Promise<User> {
    return this.tripRatingRepository.publisher(id);
  }
}
