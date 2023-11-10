import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {PaymentMethod} from '../models';
import {PaymentMethodRepository} from '../repositories';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {Permissions} from '../auth/permissions.enum';

export class PaymentMethodController {
  constructor(
    @repository(PaymentMethodRepository)
    public paymentMethodRepository: PaymentMethodRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [Permissions.CreatePaymentMethod],
  })
  @post('/payment-methods')
  @response(200, {
    description: 'PaymentMethod model instance',
    content: {'application/json': {schema: getModelSchemaRef(PaymentMethod)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentMethod, {
            title: 'NewPaymentMethod',
            exclude: ['_id'],
          }),
        },
      },
    })
    paymentMethod: Omit<PaymentMethod, '_id'>,
  ): Promise<PaymentMethod> {
    return this.paymentMethodRepository.create(paymentMethod);
  }

  @get('/payment-methods/count')
  @response(200, {
    description: 'PaymentMethod model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PaymentMethod) where?: Where<PaymentMethod>,
  ): Promise<Count> {
    return this.paymentMethodRepository.count(where);
  }

  @get('/payment-methods')
  @response(200, {
    description: 'Array of PaymentMethod model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PaymentMethod, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PaymentMethod) filter?: Filter<PaymentMethod>,
  ): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find(filter);
  }

  @patch('/payment-methods')
  @response(200, {
    description: 'PaymentMethod PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentMethod, {partial: true}),
        },
      },
    })
    paymentMethod: PaymentMethod,
    @param.where(PaymentMethod) where?: Where<PaymentMethod>,
  ): Promise<Count> {
    return this.paymentMethodRepository.updateAll(paymentMethod, where);
  }

  @get('/payment-methods/{id}')
  @response(200, {
    description: 'PaymentMethod model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PaymentMethod, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PaymentMethod, {exclude: 'where'})
    filter?: FilterExcludingWhere<PaymentMethod>,
  ): Promise<PaymentMethod> {
    return this.paymentMethodRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [Permissions.ListPaymentMethod],
  })
  @get('/payment-methods/me')
  @response(200, {
    description: 'PaymentMethod model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PaymentMethod, {includeRelations: true}),
      },
    },
  })
  async findPaymentMethodMe(
    @inject(SecurityBindings.USER)
    user: UserProfile,
  ) {
    return this.paymentMethodRepository.find({
      where: {
        userId: user.userId,
      },
      include: [
        {
          relation: 'user',
          scope: {
            fields: {
              _id: true,
              name: true,
              type: true,
              cardNumber: true,
              cardCVV: true,
              expiryDate: true,
            },
          },
        },
      ],
    });
  }

  @patch('/payment-methods/{id}')
  @response(204, {
    description: 'PaymentMethod PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentMethod, {partial: true}),
        },
      },
    })
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    await this.paymentMethodRepository.updateById(id, paymentMethod);
  }

  @put('/payment-methods/{id}')
  @response(204, {
    description: 'PaymentMethod PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() paymentMethod: PaymentMethod,
  ): Promise<void> {
    await this.paymentMethodRepository.replaceById(id, paymentMethod);
  }

  @del('/payment-methods/{id}')
  @response(204, {
    description: 'PaymentMethod DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentMethodRepository.deleteById(id);
  }
}
