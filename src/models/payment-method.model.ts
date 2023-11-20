import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class PaymentMethod extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  cardNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  cardCVV: string;

  @property({
    type: 'string',
    required: true,
  })
  expiryDate: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<PaymentMethod>) {
    super(data);
  }
}

export interface PaymentMethodRelations {
  // describe navigational properties here
}

export type PaymentMethodWithRelations = PaymentMethod & PaymentMethodRelations;
