import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Count, CountSchema, Where, repository} from '@loopback/repository';
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
import {RequestTrip, Trip} from '../models';
import {
  NotificationRepository,
  TripRepository,
  VehicleRepository,
} from '../repositories';
import {
  DriverUbicationService,
  PointService,
  SendgridService,
  WebsocketService,
} from '../services';

export class TripController {
  constructor(
    @repository(TripRepository)
    public tripRepository: TripRepository,
    @repository(VehicleRepository)
    public vehicleRepository: VehicleRepository,
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @service(PointService)
    public pointService: PointService,
    @service(DriverUbicationService)
    public driverUbicationService: DriverUbicationService,
    @service(SendgridService)
    public sendgridService: SendgridService,
    @service(WebsocketService)
    public websocketService: WebsocketService,
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
    const {points: bestRoute, cost} = await this.pointService.findBestRoute(
      data.origin,
      data.destination,
    );
    const createdTrip = await this.tripRepository.create({
      route: bestRoute.map(point => point.name).join(','),
      status: TripStatus.PENDING,
      clientId: user.userId,
      price: +process.env.PRICE_PER_KM! * cost,
    });
    const driversIds = nearestDrivers.map(driver => driver._id!);
    await this.websocketService.sendNotification(driversIds, {
      message: 'A new trip request is available to take',
      tripId: createdTrip._id!,
      clientId: createdTrip.clientId!,
      price: createdTrip.price!.toString(),
    });
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
  async find(
    @inject(SecurityBindings.USER)
    user: UserProfile,
  ): Promise<Trip[]> {
    return this.tripRepository.find({
      where: {
        or: [
          {
            clientId: user.userId,
          },
          {
            driverId: user.userId,
          },
        ],
      },
    });
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
  async findById(@param.path.string('id') id: string): Promise<Trip> {
    return this.tripRepository.findById(id);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.AcceptTrip],
  })
  @get('/trips/{id}/accept')
  @response(200, {
    description: 'Trip model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Trip, {includeRelations: true}),
      },
    },
  })
  async acceptTrip(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER) user: UserProfile,
  ) {
    return this.tripRepository.updateById(id, {
      driverId: user.userId,
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTrip],
  })
  @get('/trips/{id}/panic')
  @response(200, {
    description: 'Trip panic',
  })
  async tripPanic(@param.path.string('id') id: string) {
    const trip = await this.tripRepository.findById(id, {
      include: ['client', 'driver'],
    });
    if (!trip) {
      throw new HttpErrors.NotFound('Trip not found');
    }
    if (trip.status !== TripStatus.ACTIVE) {
      throw new HttpErrors.BadRequest('The trip must be active');
    }
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        userId: trip.driver._id,
      },
    });
    if (!vehicle) {
      throw new HttpErrors.NotFound('This driver does not have a vehicle');
    }
    let to = process.env.ADMIN_EMAIL!;
    if (trip.client.contacts && trip.client.contacts.length > 0) {
      to = trip.client.contacts[0].email;
    }
    await this.sendgridService.sendMail(
      'PANIC!',
      to,
      process.env.EMAIL_PANIC_TEMPLATE_ID!,
      {
        passenger: `${trip.client.firstName} ${trip.client.lastName}`,
        route: trip.route!,
        driver: `${trip.driver.firstName} ${trip.driver.lastName}`,
        vehicleInfo: `${vehicle.brand}: ${vehicle.model}, ${vehicle.year} - ${vehicle.licensePlate}`,
      },
    );
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
