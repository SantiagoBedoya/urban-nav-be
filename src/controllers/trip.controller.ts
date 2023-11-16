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
  UserRepository,
  VehicleRepository,
} from '../repositories';
import {
  DriverUbicationService,
  PointService,
  SendgridService,
  TwilioService,
  WebsocketService,
} from '../services';

export class TripController {
  constructor(
    @repository(TripRepository)
    public tripRepository: TripRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
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
    @service(TwilioService)
    private readonly twilioService: TwilioService,
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
    const {points, cost} = await this.pointService.findBestRoute(
      data.origin,
      data.destination,
    );
    return {
      points,
      distance: cost,
      price: +process.env.PRICE_PER_KM! * cost,
    };
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
      include: [
        {
          relation: 'client',
          scope: {
            fields: {
              _id: true,
              firstName: true,
              lastName: true,
              email: true,
              photoURL: true,
            },
          },
        },
        {
          relation: 'driver',
          scope: {
            fields: {
              _id: true,
              firstName: true,
              lastName: true,
              email: true,
              photoURL: true,
            },
          },
        },
      ],
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
    return this.tripRepository.findById(id, {
      include: [
        {
          relation: 'client',
          scope: {
            fields: {
              _id: true,
              firstName: true,
              lastName: true,
              email: true,
              photoURL: true,
            },
          },
        },
        {
          relation: 'driver',
          scope: {
            fields: {
              _id: true,
              firstName: true,
              lastName: true,
              email: true,
              photoURL: true,
            },
          },
        },
      ],
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DriverAcceptTrip],
  })
  @get('/trips/{id}/driver-accept')
  @response(200, {
    description: 'Trip model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Trip, {includeRelations: true}),
      },
    },
  })
  async driverAcceptTrip(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER) user: UserProfile,
  ) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      throw new HttpErrors.NotFound('Trip not found');
    }
    const driver = await this.userRepository.findById(user.userId);
    await this.tripRepository.updateById(id, {
      driverId: user.userId,
      status: TripStatus.ASSIGNED,
    });
    await this.websocketService.sendNotification(
      [trip.clientId],
      {
        message: `We found your driver!`,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        photoURL: driver.photoURL ?? '',
        tripId: id,
      },
      'driverFounded',
    );
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListTrip],
  })
  @post('/trips/client-accept')
  @response(200, {
    description: 'Trip model instance',
  })
  async clientAcceptTrip(
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
    const route = bestRoute.map(point => point.name).join(',');
    const createdTrip = await this.tripRepository.create({
      route,
      status: TripStatus.PENDING,
      clientId: user.userId,
      price: +process.env.PRICE_PER_KM! * cost,
    });
    const driversIds = nearestDrivers.map(driver => driver._id!);
    await this.websocketService.sendNotification(
      driversIds,
      {
        message: 'A new trip request is available to take',
        route,
        price: createdTrip.price!.toString(),
        tripId: createdTrip._id!,
        clientId: createdTrip.clientId!,
      },
      'newTrip',
    );
    return createdTrip;
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
    let toSms = '';
    if (trip.client.contacts && trip.client.contacts.length > 0) {
      to = trip.client.contacts[0].email;
      toSms = trip.client.contacts[0].phone;
    }
    const messageBody = `Emergency! Need immediate help."
    passenger: ${trip.client.firstName} ${trip.client.lastName}
    Route: ${trip.route}
    Driver: ${trip.driver.firstName} ${trip.driver.lastName}
    Vehicle: ${vehicle.brand} ${vehicle.model}, ${vehicle.year} - ${vehicle.licensePlate}
    `;

    await this.twilioService.sendSms(messageBody, toSms);
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
    options: [Permissions.ListTrip],
  })
  @get('/trips/{id}/cancel')
  @response(204, {
    description: 'Cancel Trip',
  })
  async cancelTrip(@param.path.string('id') id: string) {
    await this.tripRepository.deleteById(id);
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
    const currentTrip = await this.tripRepository.findById(id);

    if (!currentTrip) {
      throw new HttpErrors.NotFound('Trip not found');
    }

    const receiversIds = [currentTrip.clientId];

    let message = '';

    if (trip.status === TripStatus.CANCELLED) {
      message =
        'The trip was cancelled by the passenger, sorry for the inconvenience.';
      receiversIds[0] = currentTrip.driverId;
    } else if (trip.status === TripStatus.ACTIVE) {
      message =
        'The trip started now, remember you can activate panic at any time.';
    } else {
      message = 'The trip finished, thank you for choosing us.';
    }

    await this.websocketService.sendNotification(
      receiversIds,
      {
        message,
        newStatus: trip.status!,
      },
      `${trip.status?.toLowerCase()}Trip`,
    );
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
