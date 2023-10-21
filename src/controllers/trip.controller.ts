import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
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
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Permissions} from '../auth/permissions.enum';
import {TripStatus} from '../enums/trip-status.enum';
import {Notification, RequestTrip, Trip} from '../models';
import {NotificationRepository, TripRepository} from '../repositories';
import {DriverUbicationService, PointService} from '../services';

export class TripController {
  constructor(
    @repository(TripRepository)
    public tripRepository: TripRepository,
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @service(PointService)
    public pointService: PointService,
    @service(DriverUbicationService)
    public driverUbicationService: DriverUbicationService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateTrip],
  })
  @post('/trips')
  @response(200, {
    description: 'Trip model instance',
    content: {'application/json': {schema: getModelSchemaRef(Trip)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trip, {
            title: 'NewTrip',
            exclude: ['_id'],
          }),
        },
      },
    })
    trip: Omit<Trip, '_id'>,
  ): Promise<Trip> {
    return this.tripRepository.create(trip);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTrip],
  })
  @get('/trips/count')
  @response(200, {
    description: 'Trip model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Trip) where?: Where<Trip>): Promise<Count> {
    return this.tripRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateTrip],
  })
  @post('trips/request')
  @response(200, {
    description: 'Request trip',
  })
  async requestTrip(
    @inject(SecurityBindings.USER)
    user: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestTrip, {
            title: 'RequestTrip',
          }),
        },
      },
    })
    data: RequestTrip,
  ) {
    const nearestDrivers = await this.driverUbicationService.findNearestDrivers(
      data.origin,
    );
    if (nearestDrivers.length === 0) {
      throw new HttpErrors.BadRequest(
        'There are no drivers near your point of origin.',
      );
    }
    const bestRoute = await this.pointService.findBestRoute(
      data.origin,
      data.destination,
    );
    const createdTrip = await this.tripRepository.create({
      route: bestRoute.map(point => point.name).join(','),
      status: TripStatus.PENDING,
      clientId: user.userId,
    });
    const promises: Promise<Notification>[] = [];
    nearestDrivers.forEach(driver => {
      promises.push(
        this.notificationRepository.create({
          title: 'New Trip Request',
          description: 'A new trip request is available to take',
          link: process.env.FRONTEND_URL + '/trips/' + createdTrip._id,
          userId: driver._id,
        }),
      );
    });
    await Promise.all(promises);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTrip],
  })
  @get('/trips')
  @response(200, {
    description: 'Array of Trip model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Trip, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Trip) filter?: Filter<Trip>): Promise<Trip[]> {
    return this.tripRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateTrip],
  })
  @patch('/trips')
  @response(200, {
    description: 'Trip PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trip, {partial: true}),
        },
      },
    })
    trip: Trip,
    @param.where(Trip) where?: Where<Trip>,
  ): Promise<Count> {
    return this.tripRepository.updateAll(trip, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTrip],
  })
  @get('/trips/{id}')
  @response(200, {
    description: 'Trip model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Trip, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Trip, {exclude: 'where'}) filter?: FilterExcludingWhere<Trip>,
  ): Promise<Trip> {
    return this.tripRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateTrip],
  })
  @patch('/trips/{id}')
  @response(204, {
    description: 'Trip PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trip, {partial: true}),
        },
      },
    })
    trip: Trip,
  ): Promise<void> {
    await this.tripRepository.updateById(id, trip);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateTrip],
  })
  @put('/trips/{id}')
  @response(204, {
    description: 'Trip PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() trip: Trip,
  ): Promise<void> {
    await this.tripRepository.replaceById(id, trip);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteTrip],
  })
  @del('/trips/{id}')
  @response(204, {
    description: 'Trip DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tripRepository.deleteById(id);
  }
}
