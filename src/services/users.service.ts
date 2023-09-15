import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {User} from '../models';
import bcrypt from 'bcrypt';

@injectable({scope: BindingScope.TRANSIENT})
export class UsersService {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async createUser(user: User){
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);

    return this.userRepository.create({...user, password: hash});
  }
}
