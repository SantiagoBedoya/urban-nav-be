import {Model, model, property} from '@loopback/repository';

@model()
export class PasswordReset extends Model {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;


  constructor(data?: Partial<PasswordReset>) {
    super(data);
  }
}

export interface PasswordResetRelations {
  // describe navigational properties here
}

export type PasswordResetWithRelations = PasswordReset & PasswordResetRelations;
