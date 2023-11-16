import { UnitParkingSpaceEntity } from "../entities/unit-parking-space.entity";

export const getParkingSpaceIds = (
  unitParkingSpaces: UnitParkingSpaceEntity[]
): number[] => {
  const ids: number[] = [];

  unitParkingSpaces.map((unitParkingSpace) => {
    ids.push(unitParkingSpace.parkingSpaceId);
  });

  return ids;
};
