import { RegisterInformationDto } from "../../http/dtos/register-information.dto";
import { RealtyEntity } from "../entities/realty.entity";

export interface RealtyRepository {
  createMany(
    registerInformationDto: RegisterInformationDto
  ): Promise<RealtyEntity[]>;
  findManyById(ids: number[]): Promise<RealtyEntity[]>;
}

export const RealtyRepository = Symbol("RealtyRepository");
