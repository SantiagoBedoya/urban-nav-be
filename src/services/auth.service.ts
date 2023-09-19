import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import {Credentials} from '../models';
import {UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {

  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
  ) { }

  async signIn(credentials: Credentials) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!existUser) {
      throw new HttpErrors.NotFound('User not found');
    }
    const passwordMatched = await bcrypt.compare(credentials.password, existUser.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Password is not correct');
    }
    return {
      userId: existUser._id
    }
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
