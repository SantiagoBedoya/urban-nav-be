import {Entity, model, property} from '@loopback/repository';

@model()
export class Pqrs extends Entity {
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
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  date?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  constructor(data?: Partial<Pqrs>) {
    super(data);
  }
}

export interface PqrsRelations {
  // describe navigational properties here
}

export type PqrsWithRelations = Pqrs & PqrsRelations;
