import {Model, model, property} from '@loopback/repository';

@model()
export class PasswordRecovery extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;


  constructor(data?: Partial<PasswordRecovery>) {
    super(data);
  }
}

export interface PasswordRecoveryRelations {
  // describe navigational properties here
}

export type PasswordRecoveryWithRelations = PasswordRecovery & PasswordRecoveryRelations;
