import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Edge,
  Point,
} from '../models';
import {EdgeRepository} from '../repositories';

export class EdgePointController {
  constructor(
    @repository(EdgeRepository)
    public edgeRepository: EdgeRepository,
  ) { }

  @get('/edges/{id}/point', {
    responses: {
      '200': {
        description: 'Point belonging to Edge',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Point),
          },
        },
      },
    },
  })
  async getPoint(
    @param.path.string('id') id: typeof Edge.prototype._id,
  ): Promise<Point> {
    return this.edgeRepository.point(id);
  }
}
