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
  User,
} from '../models';
import {TripCommentRepository} from '../repositories';

export class TripCommentUserController {
  constructor(
    @repository(TripCommentRepository)
    public tripCommentRepository: TripCommentRepository,
  ) { }

  @get('/trip-comments/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to TripComment',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof TripComment.prototype._id,
  ): Promise<User> {
    return this.tripCommentRepository.publisher(id);
  }
}
