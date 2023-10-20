import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Edge, EdgeRelations, Point} from '../models';
import {PointRepository} from './point.repository';

export class EdgeRepository extends DefaultCrudRepository<
  Edge,
  typeof Edge.prototype._id,
  EdgeRelations
> {
  public readonly point: BelongsToAccessor<Point, typeof Edge.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('PointRepository')
    protected pointRepositoryGetter: Getter<PointRepository>,
  ) {
    super(Edge, dataSource);
    this.point = this.createBelongsToAccessorFor(
      'point',
      pointRepositoryGetter,
    );
    this.registerInclusionResolver('point', this.point.inclusionResolver);
  }
}
