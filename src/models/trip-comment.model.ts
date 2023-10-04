import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Trip} from './trip.model';
import {User} from './user.model';

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

  @belongsTo(() => Trip)
  tripId: string;

  @belongsTo(() => User)
  publisherId: string;

  @belongsTo(() => User)
  receiverId: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<TripComment>) {
    super(data);
  }
}

export interface TripCommentRelations {
  // describe navigational properties here
}

export type TripCommentWithRelations = TripComment & TripCommentRelations;
