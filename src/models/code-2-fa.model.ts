import {Entity, model, property} from '@loopback/repository';

@model()
export class Code2Fa extends Entity {
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
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;


  constructor(data?: Partial<Code2Fa>) {
    super(data);
  }
}

export interface Code2FaRelations {
  // describe navigational properties here
}

export type Code2FaWithRelations = Code2Fa & Code2FaRelations;
