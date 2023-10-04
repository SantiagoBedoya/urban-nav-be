import {Entity, hasMany, model, property} from '@loopback/repository';
import {Route} from './route.model';

@model()
export class Point extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => Route)
  routes: Route[];

  constructor(data?: Partial<Point>) {
    super(data);
  }
}

export interface PointRelations {
  // describe navigational properties here
}

export type PointWithRelations = Point & PointRelations;
