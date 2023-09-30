import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Point, PointRelations} from '../models';

export class PointRepository extends DefaultCrudRepository<
  Point,
  typeof Point.prototype._id,
  PointRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Point, dataSource);
  }
}
