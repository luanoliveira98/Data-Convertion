import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { RealtyEntity } from "../../domain/entities/realty.entity";
import { UnitParkingSpaceEntity } from "../../domain/entities/unit-parking-space.entity";
import { convertUnitType } from "../../domain/helpers/convert-unit-type";
import { BuildingRepository } from "../../domain/interfaces/building.repository.interface";
import { RealtyRepository } from "../../domain/interfaces/realty.repository.interface";
import { UnitParkingSpaceRepository } from "../../domain/interfaces/unit-parking-space.repository.interface";
import { UnitRepository } from "../../domain/interfaces/unit.repository.interface";
import { BuildingDto } from "../../http/dtos/building.dto";
import { RealtyDto } from "../../http/dtos/realty.dto";
import { RegisterInformationDto } from "../../http/dtos/register-information.dto";
import { UnitDto } from "../../http/dtos/unit.dto";

@Injectable()
export class RealtyPrismaRepository implements RealtyRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(BuildingRepository)
    private readonly buildingRepository: BuildingRepository,
    @Inject(UnitRepository)
    private readonly unitRepository: UnitRepository,
    @Inject(UnitParkingSpaceRepository)
    private readonly unitParkingSpaceRepository: UnitParkingSpaceRepository
  ) {}

  async createMany({
    realties,
    buildings,
    units,
  }: RegisterInformationDto): Promise<RealtyEntity[]> {
    const realtiesIds = await this.prismaService.$transaction(
      async (transaction) => {
        const realtiesIds = await this.createRealties(realties, transaction);

        await this.createBuildings(buildings, transaction);

        await this.createUnits(units, transaction);

        return realtiesIds;
      }
    );

    const realtiesCreated = await this.findManyById(realtiesIds);
    return realtiesCreated;
  }

  private async createRealties(
    realties: RealtyDto[],
    transaction: Prisma.TransactionClient
  ): Promise<number[]> {
    const realtiesIds: number[] = [];

    for (const { id, title } of realties) {
      realtiesIds.push(id);
      await transaction.realty.create({
        data: { id, title },
      });
    }
    return realtiesIds;
  }

  private async createBuildings(
    buildings: BuildingDto[],
    transaction: Prisma.TransactionClient
  ) {
    for (const building of buildings) {
      await transaction.building.create({
        data: building,
      });
    }
  }

  private async createUnits(
    units: UnitDto[],
    transaction: Prisma.TransactionClient
  ) {
    const unitParkingSpaces: UnitParkingSpaceEntity[] = [];

    for (const {
      id,
      floor,
      number,
      type,
      buildingId,
      parkingSpaceIds,
    } of units) {
      if (parkingSpaceIds) {
        parkingSpaceIds.map((parkingSpaceId) => {
          unitParkingSpaces.push({
            unitId: id,
            parkingSpaceId,
          });
        });
      }
      await transaction.unit.create({
        data: {
          id,
          floor,
          number,
          type: convertUnitType(type),
          buildingId,
        },
      });
    }

    await this.createUnitParkingSpaces(unitParkingSpaces, transaction);
  }

  private async createUnitParkingSpaces(
    unitParkingSpaces: UnitParkingSpaceEntity[],
    transaction: Prisma.TransactionClient
  ) {
    for (const { unitId, parkingSpaceId } of unitParkingSpaces) {
      await transaction.unitParkingSpace.create({
        data: { unitId, parkingSpaceId },
      });
    }
  }

  findManyById(ids: number[]): Promise<RealtyEntity[]> {
    return this.prismaService.realty.findMany({
      where: { id: { in: ids } },
      include: {
        buildings: {
          include: {
            units: {
              include: { unitParkingSpaces: true },
            },
          },
        },
      },
    });
  }
}
