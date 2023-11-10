import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PaymentMethod,
  User,
} from '../models';
import {PaymentMethodRepository} from '../repositories';

export class PaymentMethodUserController {
  constructor(
    @repository(PaymentMethodRepository)
    public paymentMethodRepository: PaymentMethodRepository,
  ) { }

  @get('/payment-methods/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to PaymentMethod',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof PaymentMethod.prototype._id,
  ): Promise<User> {
    return this.paymentMethodRepository.user(id);
  }
}
