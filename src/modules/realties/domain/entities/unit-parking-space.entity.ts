import { UnitEntity } from "./unit.entity";

export interface UnitParkingSpaceEntity {
  unitId: number;
  parkingSpaceId: number;

  unit?: UnitEntity;
  parkingSpace?: UnitEntity;
}
