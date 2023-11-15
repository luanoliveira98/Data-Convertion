import { RealtyEntity } from "./realty.entity";
import { UnitEntity } from "./unit.entity";

export interface BuildingEntity {
  id: number;
  realtyId: number;
  name: string;

  realty?: RealtyEntity;
  units?: UnitEntity;
}
