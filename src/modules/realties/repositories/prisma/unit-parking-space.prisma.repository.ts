import { Injectable } from "@nestjs/common";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { UnitParkingSpaceEntity } from "../../domain/entities/unit-parking-space.entity";
import { UnitParkingSpaceRepository } from "../../domain/interfaces/unit-parking-space.repository.interface";

@Injectable()
export class UnitParkingSpacePrismaRepository
  implements UnitParkingSpaceRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  create({
    unitId,
    parkingSpaceId,
  }: UnitParkingSpaceEntity): Promise<UnitParkingSpaceEntity> {
    return this.prismaService.unitParkingSpace.create({
      data: { unitId, parkingSpaceId },
    });
  }
}
