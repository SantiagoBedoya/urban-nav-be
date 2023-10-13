import {Model, model, property} from '@loopback/repository';

@model()
export class NearestDriverRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  origin: string;


  constructor(data?: Partial<NearestDriverRequest>) {
    super(data);
  }
}

export interface NearestDriverRequestRelations {
  // describe navigational properties here
}

export type NearestDriverRequestWithRelations = NearestDriverRequest & NearestDriverRequestRelations;
