import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Route, RouteRelations, Trip, Point, RoutePoint} from '../models';
import {TripRepository} from './trip.repository';
import {PointRepository} from './point.repository';
import {RoutePointRepository} from './route-point.repository';

export class RouteRepository extends DefaultCrudRepository<
  Route,
  typeof Route.prototype._id,
  RouteRelations
> {

  public readonly trips: HasManyRepositoryFactory<Trip, typeof Route.prototype._id>;

  public readonly origin: BelongsToAccessor<Point, typeof Route.prototype._id>;

  public readonly destination: BelongsToAccessor<Point, typeof Route.prototype._id>;

  public readonly routePoints: HasManyRepositoryFactory<RoutePoint, typeof Route.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('TripRepository') protected tripRepositoryGetter: Getter<TripRepository>, @repository.getter('PointRepository') protected pointRepositoryGetter: Getter<PointRepository>, @repository.getter('RoutePointRepository') protected routePointRepositoryGetter: Getter<RoutePointRepository>,
  ) {
    super(Route, dataSource);
    this.routePoints = this.createHasManyRepositoryFactoryFor('routePoints', routePointRepositoryGetter,);
    this.registerInclusionResolver('routePoints', this.routePoints.inclusionResolver);
    this.destination = this.createBelongsToAccessorFor('destination', pointRepositoryGetter,);
    this.registerInclusionResolver('destination', this.destination.inclusionResolver);
    this.origin = this.createBelongsToAccessorFor('origin', pointRepositoryGetter,);
    this.registerInclusionResolver('origin', this.origin.inclusionResolver);
    this.trips = this.createHasManyRepositoryFactoryFor('trips', tripRepositoryGetter,);
    this.registerInclusionResolver('trips', this.trips.inclusionResolver);
  }
}
