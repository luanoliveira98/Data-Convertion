import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RealtyEntity } from "@src/modules/realties/domain/entities/realty.entity";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { BuildingPrismaRepository } from "../building.prisma.repository";

describe("BuildingPrismaRepository", () => {
  let prismaService: PrismaService;
  let bildingPrismaRepository: BuildingPrismaRepository;

  beforeEach(() => {
    prismaService = new PrismaService();
    bildingPrismaRepository = new BuildingPrismaRepository(prismaService);
  });

  afterEach(async () => {
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
            },
          },
        },
        include: { buildings: true },
      });
    });

    it("should not be able to create when id already exists", async () => {
      const [building] = realty.buildings;

      await expect(bildingPrismaRepository.create(building)).rejects.toThrow(
        PrismaClientKnownRequestError
      );

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(1);
    });

    it("should not be able to create when realty does not exist", async () => {
      const [building] = realty.buildings;
      building.realtyId = realty.id + 1;

      await expect(bildingPrismaRepository.create(building)).rejects.toThrow(
        PrismaClientKnownRequestError
      );

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(1);
    });

    it("should be able to create when id not exists", async () => {
      const [building] = realty.buildings;
      building.id++;

      const createdBuilding = await bildingPrismaRepository.create(building);

      await expect(createdBuilding).toEqual(building);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(2);
      expect(buildings).toContainEqual(building);
    });
  });
});
