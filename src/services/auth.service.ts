import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import {KeyValueRepository, UserRepository} from '../repositories';
import {GenerateOtp, ValidateOtp} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository,

    @repository(KeyValueRepository)
    private readonly keyValueRepository: KeyValueRepository,
  ) {}

  async otpSendEmail(generateOTP: GenerateOtp) {
    const user = await this.userRepository.findById(generateOTP.userId);

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    const otpCode = parseInt(
      (Math.random() * (10000 - 1000) + 1000).toString(),
    ).toString();

    // Send email with code

    const ttl = new Date();
    ttl.setMinutes(ttl.getMinutes() + 2);

    await this.keyValueRepository.set(otpCode, {
      value: {
        userId: user._id,
      },
      ttl: ttl.getTime(),
    });
  }

  async otpVerifyEmail(validateOTP: ValidateOtp) {
    const user = await this.userRepository.findById(validateOTP.userId);

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    const value = await this.keyValueRepository.get(validateOTP.passcode);

    if (!value) {
      throw new HttpErrors.Unauthorized('Invalid passcode');
    }

    await this.keyValueRepository.delete(validateOTP.passcode);

    const now = Date.now();

    if (now > value.ttl) {
      throw new HttpErrors.Unauthorized('The passcode is expired');
    }

    const role = await this.userRepository.role(validateOTP.userId);

    if (!role) {
      throw new HttpErrors.InternalServerError('Something went wrong');
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        roleId: role._id,
        permission: role.permissions,
      },
      process.env.JWT_SECRET!,
    );

    return {
      accessToken,
    };
  }

  async generateOTP(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: 'UrbanNav:' + user.email,
    });

    await this.userRepository.updateById(user._id, {
      secret2fa: secret.ascii,
    });

    return {
      otpAuthURL: secret.otpauth_url,
    };
  }

  async validateOTP(userId: string, passcode: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    if (!user.secret2fa) {
      throw new HttpErrors.BadRequest('2FA was not configured');
    }

    const role = await this.userRepository.role(userId);

    const isValid = speakeasy.totp.verify({
      secret: user.secret2fa!,
      encoding: 'ascii',
      token: passcode,
    });

    if (!isValid) {
      throw new HttpErrors.Unauthorized('Invalid passcode');
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        roleId: role._id,
        permission: role.permissions,
      },
      process.env.JWT_SECRET!,
    );

    return {
      accessToken,
    };
  }
}
