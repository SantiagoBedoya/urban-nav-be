import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RedisDataSource} from '../datasources';
import {KeyValue} from '../models';

export class KeyValueRepository extends DefaultKeyValueRepository<
  KeyValue
> {
  constructor(
    @inject('datasources.redis') dataSource: RedisDataSource,
  ) {
    super(KeyValue, dataSource);
  }
}
