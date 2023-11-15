import { UnitEntity } from "./unit.entity";

export interface UnitParkingSpaceEntity {
  readonly unitId: number;
  readonly parkingSpaceId: number;

  readonly unit?: UnitEntity;
  readonly parkingSpace?: UnitEntity;
}
