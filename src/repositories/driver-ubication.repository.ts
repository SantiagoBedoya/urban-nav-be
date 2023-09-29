import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {DriverUbication, DriverUbicationRelations} from '../models';

export class DriverUbicationRepository extends DefaultCrudRepository<
  DriverUbication,
  typeof DriverUbication.prototype._id,
  DriverUbicationRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(DriverUbication, dataSource);
  }
}
