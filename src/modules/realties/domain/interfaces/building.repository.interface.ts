import { BuildingEntity } from "../entities/building.entity";

export interface BuildingRepository {
  create(realties: BuildingEntity): Promise<BuildingEntity>;
}

export const BuildingRepository = Symbol("BuildingRepository");
