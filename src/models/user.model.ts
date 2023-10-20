import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Role} from './role.model';
import {TripComment} from './trip-comment.model';

@model()
export class User extends Entity {
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
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  photoURL?: string;

  @property({
    type: 'string',
  })
  secret2fa?: string;

  @property({
    type: 'array',
    itemType: 'object',
    default: [],
  })
  contacts?: object[];

  @belongsTo(() => Role)
  roleId: string;

  @hasMany(() => TripComment)
  tripComments: TripComment[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  role: Role;
}

export type UserWithRelations = User & UserRelations;
