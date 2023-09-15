import {Model, model, property} from '@loopback/repository';

@model()
export class GenerateOtp extends Model {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;


  constructor(data?: Partial<GenerateOtp>) {
    super(data);
  }
}

export interface GenerateOtpRelations {
  // describe navigational properties here
}

export type GenerateOtpWithRelations = GenerateOtp & GenerateOtpRelations;
