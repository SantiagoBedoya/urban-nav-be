import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User, UserRelations, Role, Trip, TripComment} from '../models';
import {RoleRepository} from './role.repository';
import {TripRepository} from './trip.repository';
import {TripCommentRepository} from './trip-comment.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
> {

  public readonly role: BelongsToAccessor<Role, typeof User.prototype._id>;

  public readonly trips: HasManyRepositoryFactory<Trip, typeof User.prototype._id>;

  public readonly tripComments: HasManyRepositoryFactory<TripComment, typeof User.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('TripRepository') protected tripRepositoryGetter: Getter<TripRepository>, @repository.getter('TripCommentRepository') protected tripCommentRepositoryGetter: Getter<TripCommentRepository>,
  ) {
    super(User, dataSource);
    this.tripComments = this.createHasManyRepositoryFactoryFor('tripComments', tripCommentRepositoryGetter,);
    this.registerInclusionResolver('tripComments', this.tripComments.inclusionResolver);
    this.trips = this.createHasManyRepositoryFactoryFor('trips', tripRepositoryGetter,);
    this.registerInclusionResolver('trips', this.trips.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
