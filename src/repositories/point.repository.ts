import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Point, PointRelations, Route} from '../models';
import {RouteRepository} from './route.repository';

export class PointRepository extends DefaultCrudRepository<
  Point,
  typeof Point.prototype._id,
  PointRelations
> {

  public readonly routes: HasManyRepositoryFactory<Route, typeof Point.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RouteRepository') protected routeRepositoryGetter: Getter<RouteRepository>,
  ) {
    super(Point, dataSource);
    this.routes = this.createHasManyRepositoryFactoryFor('routes', routeRepositoryGetter,);
    this.registerInclusionResolver('routes', this.routes.inclusionResolver);
  }
}
