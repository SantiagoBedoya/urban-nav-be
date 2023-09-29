import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class DriverUbication extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @belongsTo(() => User)
  driverId: string;

  constructor(data?: Partial<DriverUbication>) {
    super(data);
  }
}

export interface DriverUbicationRelations {
  // describe navigational properties here
}

export type DriverUbicationWithRelations = DriverUbication & DriverUbicationRelations;
