import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Trip} from './trip.model';
import {Point} from './point.model';

@model()
export class Route extends Entity {
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
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  distance: number;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @hasMany(() => Trip)
  trips: Trip[];

  @belongsTo(() => Point)
  originId: string;

  @belongsTo(() => Point)
  destinationId: string;

  @property({
    type: 'string',
  })
  pointId?: string;

  constructor(data?: Partial<Route>) {
    super(data);
  }
}

export interface RouteRelations {
  // describe navigational properties here
}

export type RouteWithRelations = Route & RouteRelations;
