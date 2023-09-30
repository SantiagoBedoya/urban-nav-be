import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<Point>) {
    super(data);
  }
}

export interface PointRelations {
  // describe navigational properties here
}

export type PointWithRelations = Point & PointRelations;
