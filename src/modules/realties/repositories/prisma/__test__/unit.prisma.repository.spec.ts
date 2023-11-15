import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RealtyEntity } from "@src/modules/realties/domain/entities/realty.entity";
import { UnitType } from "@src/modules/realties/domain/enums/unit-type.enum";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { UnitPrismaRepository } from "../unit.prisma.repository";

describe("UnitPrismaRepository", () => {
  let prismaService: PrismaService;
  let unitPrismaRepository: UnitPrismaRepository;

  beforeEach(() => {
    prismaService = new PrismaService();
    unitPrismaRepository = new UnitPrismaRepository(prismaService);
  });

  afterEach(async () => {
    await prismaService.unit.deleteMany();
    await prismaService.building.deleteMany();
    await prismaService.realty.deleteMany();
  });

  describe("create", () => {
    let realty: RealtyEntity;

    beforeEach(async () => {
      realty = await prismaService.realty.create({
        data: {
          title: "Test Realty",
          buildings: {
            create: {
              title: "Test Building",
              units: {
                create: {
                  floor: 1,
                  number: "3",
                  type: UnitType.APARTMENT,
                },
              },
            },
          },
        },
        include: { buildings: { include: { units: true } } },
      });
    });

    it("should not be able to create when id already exists", async () => {
      const [building] = realty.buildings;
      const [unit] = building.units;

      await expect(unitPrismaRepository.create(unit)).rejects.toThrow(
        PrismaClientKnownRequestError
      );

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(1);
    });

    it("should not be able to create when building does not exist", async () => {
      const [building] = realty.buildings;
      const [unit] = building.units;
      unit.buildingId++;

      await expect(unitPrismaRepository.create(unit)).rejects.toThrow(
        PrismaClientKnownRequestError
      );

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(1);
    });

    it("should be able to create when id not exists", async () => {
      const [building] = realty.buildings;
      const [unit] = building.units;
      unit.id++;

      const createdUnit = await unitPrismaRepository.create(unit);

      await expect(createdUnit).toEqual(unit);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(2);
      expect(units).toContainEqual(unit);
    });
  });
});
