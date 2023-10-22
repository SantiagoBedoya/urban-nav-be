import {Model, model, property} from '@loopback/repository';

@model()
export class RequestTrip extends Model {
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

  constructor(data?: Partial<RequestTrip>) {
    super(data);
  }
}

export interface RequestTripRelations {
  // describe navigational properties here
}

export type RequestTripWithRelations = RequestTrip & RequestTripRelations;
