import {Model, model, property} from '@loopback/repository';
import {RoutePoint} from './route-point.model';

@model()
export class CreateRouteRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

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

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  intermediaryPoints: RoutePoint[];

  constructor(data?: Partial<CreateRouteRequest>) {
    super(data);
  }
}

export interface CreateRouteRequestRelations {
  // describe navigational properties here
}

export type CreateRouteRequestWithRelations = CreateRouteRequest &
  CreateRouteRequestRelations;
