import { UnitParkingSpaceEntity } from "../entities/unit-parking-space.entity";

export interface UnitParkingSpaceRepository {
  create(
    unitParkingSpace: UnitParkingSpaceEntity
  ): Promise<UnitParkingSpaceEntity>;
}

export const UnitParkingSpaceRepository = Symbol("UnitParkingSpaceRepository");
