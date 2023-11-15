import { Module } from "@nestjs/common";
import { BuildingRepository } from "./domain/interfaces/building.repository.interface";
import { RealtyRepository } from "./domain/interfaces/realty.repository.interface";
import { BuildingPrismaRepository } from "./repositories/prisma/building.prisma.repository";
import { RealtyPrismaRepository } from "./repositories/prisma/realty.prisma.repository";

@Module({
  providers: [
    BuildingPrismaRepository,
    RealtyPrismaRepository,
    {
      provide: RealtyRepository,
      useExisting: RealtyPrismaRepository,
    },
    {
      provide: BuildingRepository,
      useExisting: BuildingPrismaRepository,
    },
  ],
})
export class RealtiesModule {}
