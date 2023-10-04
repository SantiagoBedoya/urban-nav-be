import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {TripRating, TripRatingRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TripRatingRepository extends DefaultCrudRepository<
  TripRating,
  typeof TripRating.prototype._id,
  TripRatingRelations
> {

  public readonly users: HasManyRepositoryFactory<User, typeof TripRating.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(TripRating, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
