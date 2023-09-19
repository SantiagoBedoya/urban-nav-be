import {Model, model, property} from '@loopback/repository';

@model()
export class KeyValue extends Model {
  @property({
    type: 'object',
    required: true,
  })
  value: object;

  @property({
    type: 'number',
    required: true,
  })
  ttl: number;


  constructor(data?: Partial<KeyValue>) {
    super(data);
  }
}

export interface KeyValueRelations {
  // describe navigational properties here
}

export type KeyValueWithRelations = KeyValue & KeyValueRelations;
