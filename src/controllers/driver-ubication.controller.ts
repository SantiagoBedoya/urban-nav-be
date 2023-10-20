import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Permissions} from '../auth/permissions.enum';
import {
  DriverPoints,
  DriverUbication,
  NearestDriverRequest,
  User,
} from '../models';
import {DriverUbicationRepository} from '../repositories';

export class DriverUbicationController {
  constructor(
    @repository(DriverUbicationRepository)
    public driverUbicationRepository: DriverUbicationRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.SetDriverPoints],
  })
  @post('/driver-ubications')
  @response(200, {
    description: 'DriverUbication model instance',
    content: {'application/json': {schema: getModelSchemaRef(DriverUbication)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DriverPoints, {
            title: 'DriverPoints',
          }),
        },
      },
    })
    driverPoints: DriverPoints,
    @inject(SecurityBindings.USER) user: UserProfile,
  ) {
    const promises: Promise<DriverUbication>[] = [];
    driverPoints.points.forEach(point => {
      promises.push(
        this.driverUbicationRepository.create({
          driverId: user.userId,
          pointId: point,
        }),
      );
    });
    return Promise.all(promises);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListDriverUbication],
  })
  @post('/driver-ubications/nearest-driver')
  @response(200, {
    description: 'Drivers',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async nearestDriver(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NearestDriverRequest, {
            title: 'NearestDriverRequest',
          }),
        },
      },
    })
    nearestDriver: NearestDriverRequest,
  ) {
    const nearestDrivers = await this.driverUbicationRepository.find({
      where: {
        pointId: nearestDriver.origin,
      },
      include: [{relation: 'driver'}],
    });
    const drivers = nearestDrivers.map(nd => {
      const driverInfo = {
        _id: nd.driver._id,
        firstName: nd.driver.firstName,
        lastName: nd.driver.lastName,
        email: nd.driver.email,
      };
      return driverInfo;
    });
    return drivers;
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListDriverUbication],
  })
  @get('/driver-ubications/count')
  @response(200, {
    description: 'DriverUbication model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DriverUbication) where?: Where<DriverUbication>,
  ): Promise<Count> {
    return this.driverUbicationRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListDriverUbication],
  })
  @get('/driver-ubications')
  @response(200, {
    description: 'Array of DriverUbication model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DriverUbication, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DriverUbication) filter?: Filter<DriverUbication>,
  ): Promise<DriverUbication[]> {
    return this.driverUbicationRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateDriverUbication],
  })
  @patch('/driver-ubications')
  @response(200, {
    description: 'DriverUbication PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DriverUbication, {partial: true}),
        },
      },
    })
    driverUbication: DriverUbication,
    @param.where(DriverUbication) where?: Where<DriverUbication>,
  ): Promise<Count> {
    return this.driverUbicationRepository.updateAll(driverUbication, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListDriverUbication],
  })
  @get('/driver-ubications/{id}')
  @response(200, {
    description: 'DriverUbication model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DriverUbication, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DriverUbication, {exclude: 'where'})
    filter?: FilterExcludingWhere<DriverUbication>,
  ): Promise<DriverUbication> {
    return this.driverUbicationRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateDriverUbication],
  })
  @patch('/driver-ubications/{id}')
  @response(204, {
    description: 'DriverUbication PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DriverUbication, {partial: true}),
        },
      },
    })
    driverUbication: DriverUbication,
  ): Promise<void> {
    await this.driverUbicationRepository.updateById(id, driverUbication);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateDriverUbication],
  })
  @put('/driver-ubications/{id}')
  @response(204, {
    description: 'DriverUbication PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() driverUbication: DriverUbication,
  ): Promise<void> {
    await this.driverUbicationRepository.replaceById(id, driverUbication);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteDriverUbication],
  })
  @del('/driver-ubications/{id}')
  @response(204, {
    description: 'DriverUbication DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.driverUbicationRepository.deleteById(id);
  }
}
