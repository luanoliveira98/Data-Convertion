import { Inject, Injectable } from "@nestjs/common";
import { LoggerService } from "@src/modules/shared/domain/services/logger.service";
import {
  RegisterInformationDto,
  RegisterInformationOutput,
} from "../../http/dtos/register-information.dto";
import { RealtyEntity } from "../entities/realty.entity";
import { RealtyRepository } from "../interfaces/realty.repository.interface";
import { registerInformationMapper } from "./mappers/register-information.mapper";

@Injectable()
export class RegisterInformationService {
  constructor(
    private readonly loggerService: LoggerService,
    @Inject(RealtyRepository)
    private readonly realtyRepository: RealtyRepository
  ) {
    this.loggerService.contextName = RegisterInformationService.name;
  }

  async create(
    registerInformation: RegisterInformationDto
  ): Promise<RegisterInformationOutput> {
    this.loggerService.info(`Called method: ${this.create.name}()`);

    const realtiesCreated =
      await this.realtyRepository.createMany(registerInformation);

    return registerInformationMapper.map<
      RealtyEntity[],
      RegisterInformationOutput
    >(realtiesCreated, "RealtyEntity[]", "RegisterInformationOutput");
  }
}
