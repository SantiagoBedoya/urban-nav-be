import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TripComment,
  Trip,
} from '../models';
import {TripCommentRepository} from '../repositories';

export class TripCommentTripController {
  constructor(
    @repository(TripCommentRepository)
    public tripCommentRepository: TripCommentRepository,
  ) { }

  @get('/trip-comments/{id}/trip', {
    responses: {
      '200': {
        description: 'Trip belonging to TripComment',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Trip),
          },
        },
      },
    },
  })
  async getTrip(
    @param.path.string('id') id: typeof TripComment.prototype._id,
  ): Promise<Trip> {
    return this.tripCommentRepository.trip(id);
  }
}
