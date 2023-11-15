import { UnitEntity } from "../entities/unit.entity";

export interface UnitRepository {
  create(unit: UnitEntity): Promise<UnitEntity>;
}

export const UnitRepository = Symbol("UnitRepository");
