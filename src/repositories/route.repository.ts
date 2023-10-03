import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Route, RouteRelations} from '../models';

export class RouteRepository extends DefaultCrudRepository<
  Route,
  typeof Route.prototype._id,
  RouteRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Route, dataSource);
  }
}
