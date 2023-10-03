import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {TripComment, TripCommentRelations} from '../models';

export class TripCommentRepository extends DefaultCrudRepository<
  TripComment,
  typeof TripComment.prototype._id,
  TripCommentRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(TripComment, dataSource);
  }
}
