import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {TripComment} from './trip-comment.model';
import {User} from './user.model';

@model()
export class Trip extends Entity {
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
  status: string;

  @property({
    type: 'date',
    required: true,
  })
  startDate: string;

  @property({
    type: 'date',
    required: true,
  })
  endDate: string;

  @hasMany(() => TripComment)
  tripComments: TripComment[];

  @belongsTo(() => User)
  driverId: string;

  @belongsTo(() => User)
  clientId: string;

  constructor(data?: Partial<Trip>) {
    super(data);
  }
}

export interface TripRelations {
  // describe navigational properties here
}

export type TripWithRelations = Trip & TripRelations;
