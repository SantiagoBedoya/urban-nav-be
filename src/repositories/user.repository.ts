import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Role, Trip, TripComment, User, UserRelations} from '../models';
import {RoleRepository} from './role.repository';
import {TripCommentRepository} from './trip-comment.repository';
import {TripRepository} from './trip.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
> {
  public readonly role: BelongsToAccessor<Role, typeof User.prototype._id>;

  public readonly trips: HasManyRepositoryFactory<
    Trip,
    typeof User.prototype._id
  >;

  public readonly tripComments: HasManyRepositoryFactory<
    TripComment,
    typeof User.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('TripRepository')
    protected tripRepositoryGetter: Getter<TripRepository>,
    @repository.getter('TripCommentRepository')
    protected tripCommentRepositoryGetter: Getter<TripCommentRepository>,
  ) {
    super(User, dataSource);
    this.tripComments = this.createHasManyRepositoryFactoryFor(
      'tripComments',
      tripCommentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tripComments',
      this.tripComments.inclusionResolver,
    );
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
