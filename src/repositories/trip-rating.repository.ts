import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {TripRating, TripRatingRelations, User, Trip} from '../models';
import {UserRepository} from './user.repository';
import {TripRepository} from './trip.repository';

export class TripRatingRepository extends DefaultCrudRepository<
  TripRating,
  typeof TripRating.prototype._id,
  TripRatingRelations
> {

  public readonly publisher: BelongsToAccessor<User, typeof TripRating.prototype._id>;

  public readonly receiver: BelongsToAccessor<User, typeof TripRating.prototype._id>;

  public readonly trip: BelongsToAccessor<Trip, typeof TripRating.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TripRepository') protected tripRepositoryGetter: Getter<TripRepository>,
  ) {
    super(TripRating, dataSource);
    this.trip = this.createBelongsToAccessorFor('trip', tripRepositoryGetter,);
    this.registerInclusionResolver('trip', this.trip.inclusionResolver);
    this.receiver = this.createBelongsToAccessorFor('receiver', userRepositoryGetter,);
    this.registerInclusionResolver('receiver', this.receiver.inclusionResolver);
    this.publisher = this.createBelongsToAccessorFor('publisher', userRepositoryGetter,);
    this.registerInclusionResolver('publisher', this.publisher.inclusionResolver);
  }
}
