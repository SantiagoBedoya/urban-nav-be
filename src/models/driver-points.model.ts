import {Model, model, property} from '@loopback/repository';

@model()
export class DriverPoints extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  points: string[];


  constructor(data?: Partial<DriverPoints>) {
    super(data);
  }
}

export interface DriverPointsRelations {
  // describe navigational properties here
}

export type DriverPointsWithRelations = DriverPoints & DriverPointsRelations;
