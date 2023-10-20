import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
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
import {Pqrs} from '../models';
import {PqrsRepository} from '../repositories';
import {SendgridService} from '../services';

export class PqrsController {
  constructor(
    @repository(PqrsRepository)
    public pqrsRepository: PqrsRepository,
    @service(SendgridService)
    public sendgridService: SendgridService,
  ) {}

  @post('/pqrs')
  @response(200, {
    description: 'Pqrs model instance',
    content: {'application/json': {schema: getModelSchemaRef(Pqrs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pqrs, {
            title: 'NewPqrs',
            exclude: ['_id'],
          }),
        },
      },
    })
    pqrs: Omit<Pqrs, 'id'>,
  ): Promise<Pqrs> {
    await this.sendgridService.sendMail(
      'New PQRS',
      process.env.ADMIN_EMAIL!,
      process.env.EMAIL_NEW_PQRS_TEMPLATE_ID!,
      {
        name: pqrs.firstName,
        type: pqrs.type,
        description: pqrs.description,
        from: pqrs.email,
      },
    );
    return this.pqrsRepository.create(pqrs);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPQRS],
  })
  @get('/pqrs/count')
  @response(200, {
    description: 'Pqrs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Pqrs) where?: Where<Pqrs>): Promise<Count> {
    return this.pqrsRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPQRS],
  })
  @get('/pqrs')
  @response(200, {
    description: 'Array of Pqrs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pqrs, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Pqrs) filter?: Filter<Pqrs>): Promise<Pqrs[]> {
    return this.pqrsRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdatePQRS],
  })
  @patch('/pqrs')
  @response(200, {
    description: 'Pqrs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pqrs, {partial: true}),
        },
      },
    })
    pqrs: Pqrs,
    @param.where(Pqrs) where?: Where<Pqrs>,
  ): Promise<Count> {
    return this.pqrsRepository.updateAll(pqrs, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPQRS],
  })
  @get('/pqrs/{id}')
  @response(200, {
    description: 'Pqrs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pqrs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Pqrs, {exclude: 'where'}) filter?: FilterExcludingWhere<Pqrs>,
  ): Promise<Pqrs> {
    return this.pqrsRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdatePQRS],
  })
  @patch('/pqrs/{id}')
  @response(204, {
    description: 'Pqrs PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pqrs, {partial: true}),
        },
      },
    })
    pqrs: Pqrs,
  ): Promise<void> {
    await this.pqrsRepository.updateById(id, pqrs);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdatePQRS],
  })
  @put('/pqrs/{id}')
  @response(204, {
    description: 'Pqrs PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() pqrs: Pqrs,
  ): Promise<void> {
    await this.pqrsRepository.replaceById(id, pqrs);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeletePQRS],
  })
  @del('/pqrs/{id}')
  @response(204, {
    description: 'Pqrs DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pqrsRepository.deleteById(id);
  }
}
