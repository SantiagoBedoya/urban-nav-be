import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Point, Route, RoutePoint, RoutePointRelations} from '../models';
import {PointRepository} from './point.repository';
import {RouteRepository} from './route.repository';

export class RoutePointRepository extends DefaultCrudRepository<
  RoutePoint,
  typeof RoutePoint.prototype._id,
  RoutePointRelations
> {
  public readonly route: BelongsToAccessor<
    Route,
    typeof RoutePoint.prototype._id
  >;

  public readonly point: BelongsToAccessor<
    Point,
    typeof RoutePoint.prototype._id
  >;

  public readonly routes: HasManyRepositoryFactory<
    Route,
    typeof RoutePoint.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('RouteRepository')
    protected routeRepositoryGetter: Getter<RouteRepository>,
    @repository.getter('PointRepository')
    protected pointRepositoryGetter: Getter<PointRepository>,
  ) {
    super(RoutePoint, dataSource);
    this.point = this.createBelongsToAccessorFor(
      'point',
      pointRepositoryGetter,
    );
    this.registerInclusionResolver('point', this.point.inclusionResolver);
    this.route = this.createBelongsToAccessorFor(
      'route',
      routeRepositoryGetter,
    );
    this.registerInclusionResolver('route', this.route.inclusionResolver);
  }
}
