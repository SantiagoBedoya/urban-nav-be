import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Point} from './point.model';

@model()
export class Edge extends Entity {
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
  weight: number;

  @belongsTo(() => Point)
  pointId: string;

  constructor(data?: Partial<Edge>) {
    super(data);
  }
}

export interface EdgeRelations {
  // describe navigational properties here
}

export type EdgeWithRelations = Edge & EdgeRelations;
