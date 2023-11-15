import { UnitType } from "./../enums/unit-type.enum";
import { BuildingEntity } from "./building.entity";
import { UnitParkingSpaceEntity } from "./unit-parking-space.entity";
export interface UnitEntity {
  id: number;
  buildingId: number;
  floor: number;
  number: string;
  type: UnitType;

  building?: BuildingEntity;
  unitParkingSpaces?: UnitParkingSpaceEntity[];
  parkingSpaceUnits?: UnitParkingSpaceEntity[];
}
