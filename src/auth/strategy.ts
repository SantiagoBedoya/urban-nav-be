import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthService} from '../services';

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @service(AuthService)
    private authService: AuthService,

    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
  ) {}

  async authenticate(req: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(req);

    if (!token) {
      throw new HttpErrors.Unauthorized('The bearer token is required');
    }

    const userWithRole = await this.authService.getUserFromToken(token);

    if (!userWithRole) {
      throw new HttpErrors.Unauthorized('Invalid bearer token');
    }

    const requiredPermissions = this.metadata[0].options as number[];

    requiredPermissions.forEach(permission => {
      if (!userWithRole.permissions.includes(permission)) {
        throw new HttpErrors.Unauthorized('Unable to execute this action');
      }
    });

    const profile: UserProfile = Object.assign({...userWithRole});

    return profile;
  }
}
