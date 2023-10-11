import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Point} from './point.model';
import {Route} from './route.model';

@model()
export class RoutePoint extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'number',
    required: true,
  })
  order: number;

  @property({
    type: 'number',
    required: true,
  })
  distance: number;

  @belongsTo(() => Route)
  routeId: string;

  @belongsTo(() => Point)
  pointId: string;

  constructor(data?: Partial<RoutePoint>) {
    super(data);
  }
}

export interface RoutePointRelations {
  // describe navigational properties here
}

export type RoutePointWithRelations = RoutePoint & RoutePointRelations;
