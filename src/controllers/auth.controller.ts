import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Credentials, GenerateOtp, ValidateOtp} from '../models';
import {AuthService} from '../services';

export class AuthController {
  constructor(
    @service(AuthService)
    private readonly authService: AuthService,
  ) { }

  @post('/auth/sign-in')
  @response(200, {
    description: 'Sign In',
  })
  async signIn(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials, {
            title: 'Credentials',
          }),
        },
      },
    })
    credentials: Credentials,
  ) {
    return this.authService.signIn(credentials);
  }

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

  @post('/auth/otp/send-email')
  @response(200, {
    description: 'Generate OTP - 2FA email',
  })
  async generateOTPEmail(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GenerateOtp, {
            title: 'GenerateOtp',
          }),
        },
      },
    })
    generateOTP: GenerateOtp,
  ) {
    return this.authService.otpSendEmail(generateOTP)
  }

  @post('/auth/otp/verify-email')
  @response(200, {
    description: 'Validate OTP - 2FA email',
  })
  async verifyOTPEmail(
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
    return this.authService.otpVerifyEmail(validateOTP)
  }
}
