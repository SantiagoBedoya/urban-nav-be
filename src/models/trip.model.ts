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
  })
  status?: string;

  @property({
    type: 'date',
  })
  startDate?: string;

  @property({
    type: 'date',
  })
  endDate?: string;

  @property({
    type: 'string',
  })
  route?: string;

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
  client: User;
  driver: User;
}

export type TripWithRelations = Trip & TripRelations;
