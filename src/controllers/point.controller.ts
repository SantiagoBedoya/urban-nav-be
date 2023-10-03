import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Point} from '../models';
import {PointRepository} from '../repositories';

export class PointController {
  constructor(
    @repository(PointRepository)
    public pointRepository : PointRepository,
  ) {}

  @post('/points')
  @response(200, {
    description: 'Point model instance',
    content: {'application/json': {schema: getModelSchemaRef(Point)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Point, {
            title: 'NewPoint',
            exclude: ['_id'],
          }),
        },
      },
    })
    point: Omit<Point, '_id'>,
  ): Promise<Point> {
    return this.pointRepository.create(point);
  }

  @get('/points/count')
  @response(200, {
    description: 'Point model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Point) where?: Where<Point>,
  ): Promise<Count> {
    return this.pointRepository.count(where);
  }

  @get('/points')
  @response(200, {
    description: 'Array of Point model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Point, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Point) filter?: Filter<Point>,
  ): Promise<Point[]> {
    return this.pointRepository.find(filter);
  }

  @patch('/points')
  @response(200, {
    description: 'Point PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Point, {partial: true}),
        },
      },
    })
    point: Point,
    @param.where(Point) where?: Where<Point>,
  ): Promise<Count> {
    return this.pointRepository.updateAll(point, where);
  }

  @get('/points/{id}')
  @response(200, {
    description: 'Point model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Point, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Point, {exclude: 'where'}) filter?: FilterExcludingWhere<Point>
  ): Promise<Point> {
    return this.pointRepository.findById(id, filter);
  }

  @patch('/points/{id}')
  @response(204, {
    description: 'Point PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Point, {partial: true}),
        },
      },
    })
    point: Point,
  ): Promise<void> {
    await this.pointRepository.updateById(id, point);
  }

  @put('/points/{id}')
  @response(204, {
    description: 'Point PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() point: Point,
  ): Promise<void> {
    await this.pointRepository.replaceById(id, point);
  }

  @del('/points/{id}')
  @response(204, {
    description: 'Point DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pointRepository.deleteById(id);
  }
}
