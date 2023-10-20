import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Trip, TripComment, TripRelations, User} from '../models';
import {TripCommentRepository} from './trip-comment.repository';
import {UserRepository} from './user.repository';

export class TripRepository extends DefaultCrudRepository<
  Trip,
  typeof Trip.prototype._id,
  TripRelations
> {
  public readonly tripComments: HasManyRepositoryFactory<
    TripComment,
    typeof Trip.prototype._id
  >;

  public readonly driver: BelongsToAccessor<User, typeof Trip.prototype._id>;

  public readonly client: BelongsToAccessor<User, typeof Trip.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('TripCommentRepository')
    protected tripCommentRepositoryGetter: Getter<TripCommentRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Trip, dataSource);
    this.client = this.createBelongsToAccessorFor(
      'client',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('client', this.client.inclusionResolver);
    this.driver = this.createBelongsToAccessorFor(
      'driver',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('driver', this.driver.inclusionResolver);
    this.tripComments = this.createHasManyRepositoryFactoryFor(
      'tripComments',
      tripCommentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tripComments',
      this.tripComments.inclusionResolver,
    );
  }
}
