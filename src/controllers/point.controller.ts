import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Permissions} from '../auth/permissions.enum';
import {Point} from '../models';
import {PointRepository} from '../repositories';

export class PointController {
  constructor(
    @repository(PointRepository)
    public pointRepository: PointRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreatePoint],
  })
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

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPoint],
  })
  @get('/points/count')
  @response(200, {
    description: 'Point model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Point) where?: Where<Point>): Promise<Count> {
    return this.pointRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPoint],
  })
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
  async find(): Promise<Point[]> {
    return this.pointRepository.find({
      fields: {edges: false},
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdatePoint],
  })
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

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPoint],
  })
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
    @param.filter(Point, {exclude: 'where'})
    filter?: FilterExcludingWhere<Point>,
  ): Promise<Point> {
    return this.pointRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdatePoint],
  })
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

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdatePoint],
  })
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

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeletePoint],
  })
  @del('/points/{id}')
  @response(204, {
    description: 'Point DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pointRepository.deleteById(id);
  }
}
