import { UnitType } from "./../enums/unit-type.enum";
import { BuildingEntity } from "./building.entity";
import { UnitParkingSpaceEntity } from "./unit-parking-space.entity";
export interface UnitEntity {
  readonly id: number;
  readonly buildingId: number;
  readonly floor: string;
  readonly number: number;
  readonly type: UnitType;

  readonly building?: BuildingEntity;
  readonly unitParkingSpaces?: UnitParkingSpaceEntity[];
  readonly parkingSpaceUnits?: UnitParkingSpaceEntity[];
}
