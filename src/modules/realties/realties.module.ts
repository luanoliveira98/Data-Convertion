import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { BuildingRepository } from "./domain/interfaces/building.repository.interface";
import { RealtyRepository } from "./domain/interfaces/realty.repository.interface";
import { UnitParkingSpaceRepository } from "./domain/interfaces/unit-parking-space.repository.interface";
import { UnitRepository } from "./domain/interfaces/unit.repository.interface";
import { RegisterInformationService } from "./domain/services/register-information.service";
import { RegisterInformationResolver } from "./http/resolvers/register-information.resolver";
import { BuildingPrismaRepository } from "./repositories/prisma/building.prisma.repository";
import { RealtyPrismaRepository } from "./repositories/prisma/realty.prisma.repository";
import { UnitParkingSpacePrismaRepository } from "./repositories/prisma/unit-parking-space.prisma.repository";
import { UnitPrismaRepository } from "./repositories/prisma/unit.prisma.repository";

@Module({
  imports: [SharedModule],
  providers: [
    RegisterInformationResolver,
    RegisterInformationService,
    BuildingPrismaRepository,
    RealtyPrismaRepository,
    UnitPrismaRepository,
    UnitParkingSpacePrismaRepository,
    {
      provide: RealtyRepository,
      useExisting: RealtyPrismaRepository,
    },
    {
      provide: BuildingRepository,
      useExisting: BuildingPrismaRepository,
    },
    {
      provide: UnitRepository,
      useExisting: UnitPrismaRepository,
    },
    {
      provide: UnitParkingSpaceRepository,
      useExisting: UnitParkingSpacePrismaRepository,
    },
  ],
})
export class RealtiesModule {}
