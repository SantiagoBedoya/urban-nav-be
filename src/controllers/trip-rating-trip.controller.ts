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
  Trip,
} from '../models';
import {TripRatingRepository} from '../repositories';

export class TripRatingTripController {
  constructor(
    @repository(TripRatingRepository)
    public tripRatingRepository: TripRatingRepository,
  ) { }

  @get('/trip-ratings/{id}/trip', {
    responses: {
      '200': {
        description: 'Trip belonging to TripRating',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Trip),
          },
        },
      },
    },
  })
  async getTrip(
    @param.path.string('id') id: typeof TripRating.prototype._id,
  ): Promise<Trip> {
    return this.tripRatingRepository.trip(id);
  }
}
