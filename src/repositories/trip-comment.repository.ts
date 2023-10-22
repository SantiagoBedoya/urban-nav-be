import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Trip, TripComment, TripCommentRelations, User} from '../models';
import {TripRepository} from './trip.repository';
import {UserRepository} from './user.repository';

export class TripCommentRepository extends DefaultCrudRepository<
  TripComment,
  typeof TripComment.prototype._id,
  TripCommentRelations
> {
  public readonly trip: BelongsToAccessor<
    Trip,
    typeof TripComment.prototype._id
  >;

  public readonly publisher: BelongsToAccessor<
    User,
    typeof TripComment.prototype._id
  >;

  public readonly receiver: BelongsToAccessor<
    User,
    typeof TripComment.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('TripRepository')
    protected tripRepositoryGetter: Getter<TripRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(TripComment, dataSource);
    this.receiver = this.createBelongsToAccessorFor(
      'receiver',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('receiver', this.receiver.inclusionResolver);
    this.publisher = this.createBelongsToAccessorFor(
      'publisher',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'publisher',
      this.publisher.inclusionResolver,
    );
    this.trip = this.createBelongsToAccessorFor('trip', tripRepositoryGetter);
    this.registerInclusionResolver('trip', this.trip.inclusionResolver);
  }
}
