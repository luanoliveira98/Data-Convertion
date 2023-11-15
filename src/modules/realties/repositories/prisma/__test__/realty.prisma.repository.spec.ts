import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RealtyEntity } from "@src/modules/realties/domain/entities/realty.entity";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { RealtyPrismaRepository } from "../realty.prisma.repository";

describe("RealtyPrismaRepository", () => {
  let prismaService: PrismaService;
  let realtyPrismaRepository: RealtyPrismaRepository;

  beforeEach(() => {
    prismaService = new PrismaService();
    realtyPrismaRepository = new RealtyPrismaRepository(prismaService);
  });

  afterEach(async () => {
    await prismaService.realty.deleteMany();
  });

  describe("create", () => {
    let realty: RealtyEntity;

    beforeEach(async () => {
      realty = {
        id: 7,
        title: "Test Realty",
      };

      const { id, title } = realty;
      await prismaService.realty.create({
        data: {
          id,
          title,
        },
      });
    });

    it("should not be able to create when id already exists", async () => {
      await expect(realtyPrismaRepository.create(realty)).rejects.toThrow(
        PrismaClientKnownRequestError
      );

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(1);
    });

    it("should be able to create when id not exists", async () => {
      realty = {
        ...realty,
        id: 8,
      };
      const createdRealty = await realtyPrismaRepository.create(realty);

      await expect(createdRealty).toEqual(realty);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(2);
      expect(realties).toContainEqual(realty);
    });
  });
});
