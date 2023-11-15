import { RealtyEntity } from "../entities/realty.entity";

export interface RealtyRepository {
  create(realties: RealtyEntity): Promise<RealtyEntity>;
}

export const RealtyRepository = Symbol("RealtyRepository");
