import {Model, model, property} from '@loopback/repository';

@model()
export class SignUpCredentials extends Model {
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
    required: true,
  })
  userType: string;


  constructor(data?: Partial<SignUpCredentials>) {
    super(data);
  }
}

export interface SignUpCredentialsRelations {
  // describe navigational properties here
}

export type SignUpCredentialsWithRelations = SignUpCredentials & SignUpCredentialsRelations;
