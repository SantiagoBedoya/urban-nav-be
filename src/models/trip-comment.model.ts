import {Entity, model, property} from '@loopback/repository';

@model()
export class TripComment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  comment?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;


  constructor(data?: Partial<TripComment>) {
    super(data);
  }
}

export interface TripCommentRelations {
  // describe navigational properties here
}

export type TripCommentWithRelations = TripComment & TripCommentRelations;
