import {Entity, model, property} from '@loopback/repository';
import {Edge} from './edge.model';

@model()
export class Point extends Entity {
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
    type: 'array',
    itemType: 'object',
    default: [],
  })
  edges: Edge[];

  constructor(data?: Partial<Point>) {
    super(data);
  }
}

export interface PointRelations {
  // describe navigational properties here
}

export type PointWithRelations = Point & PointRelations;
