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
import {Vehicle} from '../models';
import {VehicleRepository} from '../repositories';

export class VehicleController {
  constructor(
    @repository(VehicleRepository)
    public vehicleRepository: VehicleRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreateVehicle],
  })
  @post('/vehicles')
  @response(200, {
    description: 'Vehicle model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vehicle)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {
            title: 'NewVehicle',
            exclude: ['_id'],
          }),
        },
      },
    })
    vehicle: Omit<Vehicle, '_id'>,
  ): Promise<Vehicle> {
    return this.vehicleRepository.create(vehicle);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListVehicle],
  })
  @get('/vehicles/count')
  @response(200, {
    description: 'Vehicle model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Vehicle) where?: Where<Vehicle>): Promise<Count> {
    return this.vehicleRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListVehicle],
  })
  @get('/vehicles')
  @response(200, {
    description: 'Array of Vehicle model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vehicle, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Vehicle) filter?: Filter<Vehicle>,
  ): Promise<Vehicle[]> {
    return this.vehicleRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateVehicle],
  })
  @patch('/vehicles')
  @response(200, {
    description: 'Vehicle PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {partial: true}),
        },
      },
    })
    vehicle: Vehicle,
    @param.where(Vehicle) where?: Where<Vehicle>,
  ): Promise<Count> {
    return this.vehicleRepository.updateAll(vehicle, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListVehicle],
  })
  @get('/vehicles/{id}')
  @response(200, {
    description: 'Vehicle model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vehicle, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Vehicle, {exclude: 'where'})
    filter?: FilterExcludingWhere<Vehicle>,
  ): Promise<Vehicle> {
    return this.vehicleRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateVehicle],
  })
  @patch('/vehicles/{id}')
  @response(204, {
    description: 'Vehicle PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {partial: true}),
        },
      },
    })
    vehicle: Vehicle,
  ): Promise<void> {
    await this.vehicleRepository.updateById(id, vehicle);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.UpdateVehicle],
  })
  @put('/vehicles/{id}')
  @response(204, {
    description: 'Vehicle PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() vehicle: Vehicle,
  ): Promise<void> {
    await this.vehicleRepository.replaceById(id, vehicle);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.DeleteVehicle],
  })
  @del('/vehicles/{id}')
  @response(204, {
    description: 'Vehicle DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.vehicleRepository.deleteById(id);
  }
}
