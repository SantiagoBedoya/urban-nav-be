import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Point} from './point.model';
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

  @belongsTo(() => Point)
  pointId: string;

  constructor(data?: Partial<DriverUbication>) {
    super(data);
  }
}

export interface DriverUbicationRelations {
  driver: User;
  // describe navigational properties here
}

export type DriverUbicationWithRelations = DriverUbication &
  DriverUbicationRelations;
