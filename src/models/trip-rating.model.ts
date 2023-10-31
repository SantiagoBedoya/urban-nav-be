import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Trip} from './trip.model';

@model()
export class TripRating extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'date',
    default: new Date(),
  })
  date?: string;

  @belongsTo(() => User)
  publisherId: string;

  @belongsTo(() => User)
  receiverId: string;

  @belongsTo(() => Trip)
  tripId: string;

  constructor(data?: Partial<TripRating>) {
    super(data);
  }
}

export interface TripRatingRelations {
  // describe navigational properties here
}

export type TripRatingWithRelations = TripRating & TripRatingRelations;
