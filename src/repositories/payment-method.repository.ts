import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {PaymentMethod, PaymentMethodRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class PaymentMethodRepository extends DefaultCrudRepository<
  PaymentMethod,
  typeof PaymentMethod.prototype._id,
  PaymentMethodRelations
> {

  public readonly user: BelongsToAccessor<User, typeof PaymentMethod.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(PaymentMethod, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
