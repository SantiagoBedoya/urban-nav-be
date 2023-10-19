import {Model, model, property} from '@loopback/repository';

@model()
export class PointsForDijkstra extends Model {
  @property({
    type: 'string',
    required: true,
  })
  origin: string;

  @property({
    type: 'string',
    required: true,
  })
  destination: string;

  constructor(data?: Partial<PointsForDijkstra>) {
    super(data);
  }
}

export interface PointsForDijkstraRelations {
  // describe navigational properties here
}

export type PointsForDijkstraWithRelations = PointsForDijkstra & PointsForDijkstraRelations;
