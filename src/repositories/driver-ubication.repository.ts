import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {DriverUbication, DriverUbicationRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class DriverUbicationRepository extends DefaultCrudRepository<
  DriverUbication,
  typeof DriverUbication.prototype._id,
  DriverUbicationRelations
> {

  public readonly driver: BelongsToAccessor<User, typeof DriverUbication.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(DriverUbication, dataSource);
    this.driver = this.createBelongsToAccessorFor('driver', userRepositoryGetter,);
    this.registerInclusionResolver('driver', this.driver.inclusionResolver);
  }
}
