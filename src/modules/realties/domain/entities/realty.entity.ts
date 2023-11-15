import { BuildingEntity } from "./building.entity";

export interface RealtyEntity {
  id: number;
  title: string;

  buildings?: BuildingEntity[];
}
