import { Injectable } from "@nestjs/common";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { BuildingEntity } from "../../domain/entities/building.entity";
import { BuildingRepository } from "../../domain/interfaces/building.repository.interface";

@Injectable()
export class BuildingPrismaRepository implements BuildingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ id, title, realtyId }: BuildingEntity): Promise<BuildingEntity> {
    return this.prismaService.building.create({
      data: { id, title, realtyId },
    });
  }
}
