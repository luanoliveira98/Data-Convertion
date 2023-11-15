import { Injectable } from "@nestjs/common";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { UnitEntity } from "../../domain/entities/unit.entity";
import { UnitRepository } from "../../domain/interfaces/unit.repository.interface";

@Injectable()
export class UnitPrismaRepository implements UnitRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({
    id,
    floor,
    number,
    type,
    buildingId,
  }: UnitEntity): Promise<UnitEntity> {
    return this.prismaService.unit.create({
      data: { id, floor, number, type, buildingId },
    });
  }
}
