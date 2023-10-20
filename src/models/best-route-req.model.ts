import {Model, model, property} from '@loopback/repository';

@model()
export class BestRouteReq extends Model {
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


  constructor(data?: Partial<BestRouteReq>) {
    super(data);
  }
}

export interface BestRouteReqRelations {
  // describe navigational properties here
}

export type BestRouteReqWithRelations = BestRouteReq & BestRouteReqRelations;
