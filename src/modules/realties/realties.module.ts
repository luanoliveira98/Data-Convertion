import { Module } from "@nestjs/common";
import { RealtyRepository } from "./domain/interfaces/realty.repository.interface";
import { RealtyPrismaRepository } from "./repositories/prisma/realty.prisma.repository";

@Module({
  providers: [
    RealtyPrismaRepository,
    {
      provide: RealtyRepository,
      useExisting: RealtyPrismaRepository,
    },
  ],
})
export class RealtiesModule {}
