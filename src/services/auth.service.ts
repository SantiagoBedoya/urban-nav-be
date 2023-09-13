import {BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor() {} // TODO: inject user repository

  generateOTP(userId: string) {
    // TODO: find user by id

    const secret = speakeasy.generateSecret({
      name: 'UrbanNav:', // TODO: concatenate user email
    });

    // TODO: update user with secret

    return {
      otpAuthURL: secret.otpauth_url,
    };
  }

  validateOTP(userId: string, passcode: string) {
    // TODO: find user by id

    const isValid = speakeasy.totp.verify({
      secret: '', // TODO: set user secret
      encoding: 'ascii',
      token: passcode,
    });

    if (!isValid) {
      throw new HttpErrors.Unauthorized('Invalid passcode');
    }

    const accessToken = jwt.sign(
      {
        userId: '', // TODO: add user ID
      },
      process.env.JWT_SECRET!,
    );

    return {
      accessToken,
    };
  }
}
