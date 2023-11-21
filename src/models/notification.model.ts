import {Entity, model, property, belongsTo} from '@loopback/repository';
import {NotificationStatus} from '../enums/notification-status.enum';
import {User} from './user.model';

@model()
export class Notification extends Entity {
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
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string'
  })
  link?: string;

  @property({
    type: 'string',
    default: NotificationStatus.NEW,
  })
  status?: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  date?: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  // describe navigational properties here
}

export type NotificationWithRelations = Notification & NotificationRelations;
