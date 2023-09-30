import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {DriverUbication, DriverUbicationRelations, User, Point} from '../models';
import {UserRepository} from './user.repository';
import {PointRepository} from './point.repository';

export class DriverUbicationRepository extends DefaultCrudRepository<
  DriverUbication,
  typeof DriverUbication.prototype._id,
  DriverUbicationRelations
> {

  public readonly driver: BelongsToAccessor<User, typeof DriverUbication.prototype._id>;

  public readonly point: BelongsToAccessor<Point, typeof DriverUbication.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('PointRepository') protected pointRepositoryGetter: Getter<PointRepository>,
  ) {
    super(DriverUbication, dataSource);
    this.point = this.createBelongsToAccessorFor('point', pointRepositoryGetter,);
    this.registerInclusionResolver('point', this.point.inclusionResolver);
    this.driver = this.createBelongsToAccessorFor('driver', userRepositoryGetter,);
    this.registerInclusionResolver('driver', this.driver.inclusionResolver);
  }
}
