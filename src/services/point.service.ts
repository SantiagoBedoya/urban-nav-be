import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import Graph from 'node-dijkstra';
import {PointRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class PointService {
  constructor(
    @repository(PointRepository)
    private pointRepository: PointRepository,
  ) {}

  async findBestRoute(origin: string, destination: string) {
    const points = await this.pointRepository.find();
    const route = new Graph();
    points.forEach(point => {
      const neighbors: {
        [key: string]: number;
      } = {};
      point.edges.forEach(edge => {
        neighbors[edge.pointId] = edge.weight;
      });
      route.addNode(point._id!, neighbors);
    });
    const {path, cost} = route.path(origin, destination, {cost: true}) as {
      path: string[];
      cost: number;
    };
    const bestRoutePoints = await this.pointRepository.find({
      where: {
        _id: {inq: path as string[]},
      },
      fields: {
        edges: false,
      },
    });
    return {points: bestRoutePoints, cost};
  }
}
