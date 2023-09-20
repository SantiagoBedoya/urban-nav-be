import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {GenerateOtp, ValidateOtp} from '../models';
import {AuthService} from '../services';

export class AuthController {
  constructor(
    @service(AuthService)
    private readonly authService: AuthService,
  ) {}

  @post('/auth/otp/generate')
  @response(200, {
    description: 'Generate OTP - 2FA',
  })
  async generateOTP(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GenerateOtp, {
            title: 'GenerateOTP',
          }),
        },
      },
    })
    generateOTP: GenerateOtp,
  ) {
    return this.authService.generateOTP(generateOTP.userId);
  }

  @post('/auth/otp/validate')
  @response(200, {
    description: 'Validate OTP - 2FA',
  })
  async validateOTP(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ValidateOtp, {
            title: 'ValidateOtp',
          }),
        },
      },
    })
    validateOTP: ValidateOtp,
  ) {
    return this.authService.validateOTP(
      validateOTP.userId,
      validateOTP.passcode,
    );
  }
}