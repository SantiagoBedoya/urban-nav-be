import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Trip, TripRelations, TripComment, Route, User} from '../models';
import {TripCommentRepository} from './trip-comment.repository';
import {RouteRepository} from './route.repository';
import {UserRepository} from './user.repository';

export class TripRepository extends DefaultCrudRepository<
  Trip,
  typeof Trip.prototype._id,
  TripRelations
> {

  public readonly tripComments: HasManyRepositoryFactory<TripComment, typeof Trip.prototype._id>;

  public readonly route: BelongsToAccessor<Route, typeof Trip.prototype._id>;

  public readonly driver: BelongsToAccessor<User, typeof Trip.prototype._id>;

  public readonly client: BelongsToAccessor<User, typeof Trip.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('TripCommentRepository') protected tripCommentRepositoryGetter: Getter<TripCommentRepository>, @repository.getter('RouteRepository') protected routeRepositoryGetter: Getter<RouteRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Trip, dataSource);
    this.client = this.createBelongsToAccessorFor('client', userRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
    this.driver = this.createBelongsToAccessorFor('driver', userRepositoryGetter,);
    this.registerInclusionResolver('driver', this.driver.inclusionResolver);
    this.route = this.createBelongsToAccessorFor('route', routeRepositoryGetter,);
    this.registerInclusionResolver('route', this.route.inclusionResolver);
    this.tripComments = this.createHasManyRepositoryFactoryFor('tripComments', tripCommentRepositoryGetter,);
    this.registerInclusionResolver('tripComments', this.tripComments.inclusionResolver);
  }
}
