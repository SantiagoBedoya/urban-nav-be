import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Role, Trip, TripComment, User, UserRelations, Vehicle} from '../models';
import {RoleRepository} from './role.repository';
import {VehicleRepository} from './vehicle.repository';

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

  public readonly vehicle: BelongsToAccessor<Vehicle, typeof User.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('VehicleRepository') protected vehicleRepositoryGetter: Getter<VehicleRepository>,
  ) {
    super(User, dataSource);
    this.vehicle = this.createBelongsToAccessorFor('vehicle', vehicleRepositoryGetter,);
    this.registerInclusionResolver('vehicle', this.vehicle.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
