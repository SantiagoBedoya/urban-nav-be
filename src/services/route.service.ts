import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CreateRouteRequest, RoutePoint} from '../models';
import {RoutePointRepository, RouteRepository} from '../repositories';

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
      totalDistance += interPoint.distance;
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
}
