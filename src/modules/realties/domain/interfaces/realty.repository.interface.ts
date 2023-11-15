import { RealtyEntity } from "../entities/realty.entity";

export interface RealtyRepository {
  create(realty: RealtyEntity): Promise<RealtyEntity>;
}

export const RealtyRepository = Symbol("RealtyRepository");
