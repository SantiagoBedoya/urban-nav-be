import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Code2Fa, Code2FaRelations} from '../models';

export class Code2FaRepository extends DefaultCrudRepository<
  Code2Fa,
  typeof Code2Fa.prototype._id,
  Code2FaRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Code2Fa, dataSource);
  }
}
