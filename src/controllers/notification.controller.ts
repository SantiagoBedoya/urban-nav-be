import {authenticate} from '@loopback/authentication';
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
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateNotification],
  })
  @post('/notifications')
  @response(200, {
    description: 'Notification model instance',
    content: {'application/json': {schema: getModelSchemaRef(Notification)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotification',
            exclude: ['_id'],
          }),
        },
      },
    })
    notification: Omit<Notification, '_id'>,
  ): Promise<Notification> {
    return this.notificationRepository.create(notification);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListNotification],
  })
  @get('/notifications/count')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListNotification],
  })
  @get('/notifications')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    return this.notificationRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateNotification],
  })
  @patch('/notifications')
  @response(200, {
    description: 'Notification PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.updateAll(notification, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListNotification],
  })
  @get('/notifications/{id}')
  @response(200, {
    description: 'Notification model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Notification, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Notification, {exclude: 'where'})
    filter?: FilterExcludingWhere<Notification>,
  ): Promise<Notification> {
    return this.notificationRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateNotification],
  })
  @patch('/notifications/{id}')
  @response(204, {
    description: 'Notification PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.updateById(id, notification);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateNotification],
  })
  @put('/notifications/{id}')
  @response(204, {
    description: 'Notification PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.replaceById(id, notification);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteNotification],
  })
  @del('/notifications/{id}')
  @response(204, {
    description: 'Notification DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.notificationRepository.deleteById(id);
  }
}
