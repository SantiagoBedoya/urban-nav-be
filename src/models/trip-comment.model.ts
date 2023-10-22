import {Entity, belongsTo, model, property} from '@loopback/repository';
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
    required: true,
  })
  comment: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  date?: string;

  @belongsTo(() => Trip)
  tripId: string;

  @belongsTo(() => User)
  publisherId: string;

  @belongsTo(() => User)
  receiverId: string;

  constructor(data?: Partial<TripComment>) {
    super(data);
  }
}

export interface TripCommentRelations {
  // describe navigational properties here
}

export type TripCommentWithRelations = TripComment & TripCommentRelations;
