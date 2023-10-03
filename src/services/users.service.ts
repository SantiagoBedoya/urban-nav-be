import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {User} from '../models';
import bcrypt from 'bcrypt';
//servicio para crear usario
@injectable({scope: BindingScope.TRANSIENT})
export class UsersService {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async createUser(user: User){
    //encripta la contraseña
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    //se crea el usuario
    //...user, crea una copia de user y luego modifica password en la copia clonada
    //para mantener la integridad de los datos
    return this.userRepository.create({...user, password: hash});
  }
}
