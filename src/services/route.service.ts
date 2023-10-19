import Graph from 'node-dijkstra';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CreateRouteRequest, PointsForDijkstra, RoutePoint} from '../models';
import {RoutePointRepository, RouteRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class RouteService {
  constructor(
    @repository(RouteRepository)
    public routeRepository: RouteRepository,
    @repository(RoutePointRepository)
    private routePointRepository: RoutePointRepository,
  ) {}

  async create(route: CreateRouteRequest) {
    let totalDistance = 0;
    route.intermediaryPoints.forEach(interPoint => {
      const distance = interPoint.distance + (interPoint.distanceToDest ?? 0);
      totalDistance += distance;
    });
    const totalPrice = +process.env.PRICE_PER_KM! * totalDistance;
    const newRoute = await this.routeRepository.create({
      originId: route.origin,
      destinationId: route.destination,
      name: route.name,
      distance: totalDistance,
      price: totalPrice,
    });
    console.log({
      totalDistance,
      totalPrice,
      pricePerKM: process.env.PRICE_PER_KM,
    });
    const promises: Promise<RoutePoint>[] = [];
    route.intermediaryPoints.forEach(interPoint => {
      promises.push(
        this.routePointRepository.create({
          ...interPoint,
          routeId: newRoute._id,
        }),
      );
    });
    await Promise.all(promises);
    return newRoute;
  }

  async getBestRoute(points: PointsForDijkstra) {
    const routes = await this.routeRepository.find({
      include: ['routePoints'],
    });

    const graph = new Graph();

    const fullRoute: {[key: string]: string[]} = {};

    routes.forEach(route => {
      const firstPoint = route.routePoints.at(0)!;
      graph.addNode(route.originId.toString(), {
        [firstPoint.pointId]: firstPoint.distance,
      });
      route.routePoints.forEach((point, i, arr) => {
        if (!arr.at(i + 1)) {
          graph.addNode(point.pointId.toString(), {
            [route.destinationId]: point.distanceToDest,
          });
        } else {
          graph.addNode(point.pointId.toString(), {
            [arr[i + 1].pointId]: arr[i + 1].distance,
          });
        }
      });

      fullRoute[route._id!] = [
        route.originId.toString(),
        ...route.routePoints.map(p => p.pointId.toString()),
        route.destinationId.toString(),
      ];
    });

    const pointsResult = graph.path(
      points.origin.toString(),
      points.destination.toString(),
    );

    const bestRoutePoints: string[] = [];

    if (Array.isArray(pointsResult)) {
      pointsResult.forEach(el => bestRoutePoints.push(el));
    }

    let bestRouteId: string = '';

    for (const [routeId, arr] of Object.entries(fullRoute)) {
      const match = arr.every(
        (point, index) => point === bestRoutePoints[index],
      );
      if (match) {
        bestRouteId = routeId;
        break;
      }
    }

    if (bestRouteId) {
      const foundedRoute = routes.find(route => route._id === bestRouteId);

      return foundedRoute;
    }

    throw new HttpErrors.NotFound('Route not found');;
  }
}
