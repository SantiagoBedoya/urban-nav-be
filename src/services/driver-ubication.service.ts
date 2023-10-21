import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DriverUbicationRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class DriverUbicationService {
  constructor(
    @repository(DriverUbicationRepository)
    private driverUbicationRepository: DriverUbicationRepository,
  ) {}

  async findNearestDrivers(origin: string) {
    const nearestDrivers = await this.driverUbicationRepository.find({
      where: {
        pointId: origin,
      },
      include: [{relation: 'driver'}],
    });
    const drivers = nearestDrivers.map(nd => {
      const driverInfo = {
        _id: nd.driver._id,
        firstName: nd.driver.firstName,
        lastName: nd.driver.lastName,
        email: nd.driver.email,
      };
      return driverInfo;
    });
    return drivers;
  }
}
