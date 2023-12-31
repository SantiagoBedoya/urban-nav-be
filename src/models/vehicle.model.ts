import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Vehicle extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @property({
    type: 'string',
    required: true,
  })
  model: string;

  @property({
    type: 'number',
    required: true,
  })
  year: number;

  @property({
    type: 'string',
    required: true,
  })
  licensePlate: string;

  @property({
    type: 'string',
  })
  soatURL?: string;

  @property({
    type: 'string',
  })
  propertyCardURL?: string;

  @property({
    type: 'string',
  })
  mechanicCertificateURL?: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Vehicle>) {
    super(data);
  }
}

export interface VehicleRelations {
  // describe navigational properties here
}

export type VehicleWithRelations = Vehicle & VehicleRelations;
