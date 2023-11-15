import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RealtyEntity } from "@src/modules/realties/domain/entities/realty.entity";
import { UnitParkingSpaceEntity } from "@src/modules/realties/domain/entities/unit-parking-space.entity";
import { UnitType } from "@src/modules/realties/domain/enums/unit-type.enum";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { UnitParkingSpacePrismaRepository } from "../unit-parking-space.prisma.repository";

describe("UnitParkingSpacePrismaRepository", () => {
  let prismaService: PrismaService;
  let unitParkingSpacePrismaRepository: UnitParkingSpacePrismaRepository;

  beforeEach(() => {
    prismaService = new PrismaService();
    unitParkingSpacePrismaRepository = new UnitParkingSpacePrismaRepository(
      prismaService
    );
  });

  afterEach(async () => {
    await prismaService.unitParkingSpace.deleteMany();
    await prismaService.unit.deleteMany();
    await prismaService.building.deleteMany();
    await prismaService.realty.deleteMany();
  });

  describe("create", () => {
    let realty: RealtyEntity;
    let unitParkingSpace: UnitParkingSpaceEntity;

    beforeEach(async () => {
      realty = await prismaService.realty.create({
        data: {
          title: "Test Realty",
          buildings: {
            create: {
              title: "Test Building",
              units: {
                create: [
                  {
                    floor: 1,
                    number: "3",
                    type: UnitType.APARTMENT,
                  },
                  {
                    floor: 0,
                    number: "1",
                    type: UnitType.PARKINGSPACE,
                  },
                  {
                    floor: 2,
                    number: "4",
                    type: UnitType.APARTMENT,
                  },
                ],
              },
            },
          },
        },
        include: {
          buildings: {
            include: {
              units: true,
            },
          },
        },
      });

      const [building] = realty.buildings;
      const [apartment, parkingSpace] = building.units;

      unitParkingSpace = await prismaService.unitParkingSpace.create({
        data: {
          unitId: apartment.id,
          parkingSpaceId: parkingSpace.id,
        },
      });
    });

    it("should not be able to create when id already exists", async () => {
      await expect(
        unitParkingSpacePrismaRepository.create(unitParkingSpace)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(1);
    });

    it("should not be able to create when unit does not exist", async () => {
      const [building] = realty.buildings;
      unitParkingSpace.unitId = building.units[2].id + 1;

      await expect(
        unitParkingSpacePrismaRepository.create(unitParkingSpace)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(1);
    });

    it("should be able to create when id not exists", async () => {
      const [building] = realty.buildings;
      unitParkingSpace.unitId = building.units[2].id;

      const createdUnitParkingSpace =
        await unitParkingSpacePrismaRepository.create(unitParkingSpace);

      await expect(createdUnitParkingSpace).toEqual(unitParkingSpace);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(2);
      expect(unitParkingSpaces).toContainEqual(unitParkingSpace);
    });
  });
});
