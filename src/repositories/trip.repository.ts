import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Trip, TripRelations} from '../models';

export class TripRepository extends DefaultCrudRepository<
  Trip,
  typeof Trip.prototype._id,
  TripRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Trip, dataSource);
  }
}
