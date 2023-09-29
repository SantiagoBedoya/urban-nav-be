import {Entity, model, property} from '@loopback/repository';

@model()
export class DriverUbication extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;


  constructor(data?: Partial<DriverUbication>) {
    super(data);
  }
}

export interface DriverUbicationRelations {
  // describe navigational properties here
}

export type DriverUbicationWithRelations = DriverUbication & DriverUbicationRelations;
