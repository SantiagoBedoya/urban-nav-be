import {Model, model, property} from '@loopback/repository';

@model()
export class ValidateOtp extends Model {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  passcode: string;


  constructor(data?: Partial<ValidateOtp>) {
    super(data);
  }
}

export interface ValidateOtpRelations {
  // describe navigational properties here
}

export type ValidateOtpWithRelations = ValidateOtp & ValidateOtpRelations;
