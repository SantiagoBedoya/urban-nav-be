import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import {
  Credentials,
  GenerateOtp,
  PasswordRecovery,
  PasswordReset,
  SignUpCredentials,
  ValidateOtp,
} from '../models';
import {Code2FaRepository, UserRepository} from '../repositories';
import {SendgridService} from './sendgrid.service';
@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @repository(Code2FaRepository)
    private readonly code2faRepository: Code2FaRepository,
    @service(SendgridService)
    private readonly sendgridService: SendgridService,
  ) { }

  async passwordReset(passwordReset: PasswordReset) {
    const payload = jwt.verify(
      passwordReset.token,
      process.env.JWT_SECRET!,
    ) as Record<string, string>;
    const existUser = await this.userRepository.findById(payload.userId);
    if (!existUser) {
      throw new HttpErrors.BadRequest('Invalid token');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordReset.newPassword, salt);
    await this.userRepository.updateById(existUser._id, {
      password: hash,
    });
  }

  async passwordRecovery(passwordRecovery: PasswordRecovery) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: passwordRecovery.email,
      },
    });
    if (!existUser) {
      throw new HttpErrors.NotFound('This email is not registered');
    }
    const token = jwt.sign({userId: existUser._id}, process.env.JWT_SECRET!);
    const url = `${process.env.FRONTEND_URL}/password-reset?token=${token}`;
    await this.sendgridService.sendMail(
      'Password Recovery',
      existUser.email,
      process.env.PASSWORD_RECOVERY_TEMPLATE_ID!,
      {
        url,
      },
    );
  }

  async signIn(credentials: Credentials) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!existUser) {
      throw new HttpErrors.NotFound('User not found');
    }
    const passwordMatched = await bcrypt.compare(
      credentials.password,
      existUser.password,
    );
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Password is not correct');
    }
    return {
      userId: existUser._id,
      has2fa: existUser.secret2fa ? true : false,
    };
  }

  async signUp(signUpCredentials: SignUpCredentials) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: signUpCredentials.email,
      },
    });
    if (existUser) {
      throw new HttpErrors.Conflict('Email already registered');
    }

    let roleId = process.env.CLIENT_ROLE_ID;

    if (signUpCredentials.userType === 'DRIVER') {
      roleId = process.env.DRIVER_ROLE_ID;
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signUpCredentials.password, salt);

    const newUser = {
      firstName: signUpCredentials.firstName,
      lastName: signUpCredentials.lastName,
      email: signUpCredentials.email,
      password: hash,
      roleId,
    };

    const splitted = signUpCredentials.email.split('@')

    const letters = splitted[0].slice(0, 3)

    const domain = splitted[1]

    const hiddenEmail = `${letters}**@${domain}`

    const res = await this.userRepository.create(newUser);

    return {
      id: res._id,
      hiddenEmail,
    }
  }

  async getUserFromToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as Record<
        string,
        string
      >;
      const role = await this.userRepository.role(payload.userId);

      if (!role) {
        return null;
      }

      return {
        userId: payload.userId,
        permissions: role.permissions,
      };
    } catch (err) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }

  async otpSendEmail(generateOTP: GenerateOtp) {
    const user = await this.userRepository.findById(generateOTP.userId);

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    const otpCode = parseInt(
      (Math.random() * (1000000 - 100000) + 100000).toString(),
    ).toString();

    console.log(otpCode)

    const data = {
      name: user.firstName,
      optCode: otpCode,
    };

    const templateId = process.env.EMAIL_2FA_TEMPLATE_ID ?? '';

    await this.sendgridService.sendMail(
      'OTP Auth Code',
      user.email,
      templateId,
      data,
    );

    const ttl = new Date();
    ttl.setMinutes(ttl.getMinutes() + 2);

    await this.code2faRepository.create({
      userId: user._id,
      token: otpCode,
    });
  }

  async otpVerifyEmail(validateOTP: ValidateOtp) {
    const user = await this.userRepository.findById(validateOTP.userId);

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    const code2fa = await this.code2faRepository.findOne({
      where: {
        userId: user._id,
        token: validateOTP.passcode,
      },
    });

    if (!code2fa) {
      throw new HttpErrors.Unauthorized('Invalid passcode');
    }

    await this.code2faRepository.deleteById(code2fa._id);

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
