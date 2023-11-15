import { BuildingEntity } from "../entities/building.entity";

export interface BuildingRepository {
  create(building: BuildingEntity): Promise<BuildingEntity>;
}

export const BuildingRepository = Symbol("BuildingRepository");
