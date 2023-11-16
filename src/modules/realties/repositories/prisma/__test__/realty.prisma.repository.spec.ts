import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RealtyEntity } from "@src/modules/realties/domain/entities/realty.entity";
import { UnitType } from "@src/modules/realties/domain/enums/unit-type.enum";
import { convertUnitType } from "@src/modules/realties/domain/helpers/convert-unit-type";
import { RegisterInformationDto } from "@src/modules/realties/http/dtos/register-information.dto";
import { UnitTypeRequest } from "@src/modules/realties/http/enums/unit-type-request.enum";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { BuildingPrismaRepository } from "../building.prisma.repository";
import { RealtyPrismaRepository } from "../realty.prisma.repository";
import { UnitParkingSpacePrismaRepository } from "./../unit-parking-space.prisma.repository";
import { UnitPrismaRepository } from "./../unit.prisma.repository";

describe("RealtyPrismaRepository", () => {
  let prismaService: PrismaService;
  let unitPrismaRepository: UnitPrismaRepository;
  let realtyPrismaRepository: RealtyPrismaRepository;
  let buildingPrismaRepository: BuildingPrismaRepository;
  let unitParkingSpacePrismaRepository: UnitParkingSpacePrismaRepository;

  let registerInformation: RegisterInformationDto;

  beforeAll(() => {
    prismaService = new PrismaService();
    realtyPrismaRepository = new RealtyPrismaRepository(
      prismaService,
      buildingPrismaRepository,
      unitPrismaRepository,
      unitParkingSpacePrismaRepository
    );
  });

  beforeEach(() => {
    registerInformation = {
      realties: [
        {
          id: 1,
          title: "Burj Khalifa",
        },
        {
          id: 2,
          title: "Empire State Building",
        },
      ],
      buildings: [
        {
          id: 1,
          realtyId: 1,
          title: "Torre 1",
        },
        {
          id: 2,
          realtyId: 2,
          title: "Torre Norte",
        },
        {
          id: 3,
          realtyId: 2,
          title: "Torre Sul",
        },
        {
          id: 4,
          realtyId: 2,
          title: "Torre de Vagas",
        },
      ],
      units: [
        {
          id: 1,
          buildingId: 1,
          number: "15",
          floor: 100,
          type: UnitTypeRequest.APARTMENT,
          parkingSpaceIds: [2, 3],
        },
        {
          id: 2,
          buildingId: 1,
          number: "1",
          type: UnitTypeRequest.PARKINGSPACE,
          floor: -1,
        },
        {
          id: 3,
          buildingId: 1,
          number: "2",
          type: UnitTypeRequest.PARKINGSPACE,
          floor: -1,
        },
        {
          id: 4,
          buildingId: 1,
          number: "13",
          type: UnitTypeRequest.APARTMENT,
          floor: 53,
        },
        {
          id: 5,
          buildingId: 2,
          number: "135",
          floor: 13,
          type: UnitTypeRequest.APARTMENT,
          parkingSpaceIds: [7],
        },
        {
          id: 6,
          buildingId: 4,
          number: "A",
          floor: 1,
          type: UnitTypeRequest.PARKINGSPACE,
        },
        {
          id: 7,
          buildingId: 4,
          number: "B",
          floor: 1,
          type: UnitTypeRequest.PARKINGSPACE,
        },
      ],
    };
  });

  afterEach(async () => {
    await prismaService.unitParkingSpace.deleteMany();
    await prismaService.unit.deleteMany();
    await prismaService.building.deleteMany();
    await prismaService.realty.deleteMany();
  });

  describe("create", () => {
    it("should not be able to create when realty's id already exists", async () => {
      const [realty] = registerInformation.realties;
      await prismaService.realty.create({
        data: realty,
      });

      await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(1);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(0);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(0);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(0);
    });

    it("should not be able to create when building's id already exists", async () => {
      const [realty] = registerInformation.realties;
      const [building] = registerInformation.buildings;
      await prismaService.realty.create({
        data: {
          ...realty,
          buildings: {
            create: {
              id: building.id,
              title: building.title,
            },
          },
        },
      });

      await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(1);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(1);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(0);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(0);
    });

    it("should not be able to create when building's realty id does not exist", async () => {
      const { realties: initialRealties, buildings: initialBuildings } =
        registerInformation;
      const [building] = initialBuildings;
      registerInformation = {
        ...registerInformation,
        buildings: [
          {
            ...building,
            realtyId: initialRealties.length + 10,
          },
        ],
      };

      await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(0);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(0);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(0);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(0);
    });

    it("should not be able to create when unit's id already exists", async () => {
      const [realty] = registerInformation.realties;
      const [building] = registerInformation.buildings;
      const [unit] = registerInformation.units;
      await prismaService.realty.create({
        data: {
          ...realty,
          buildings: {
            create: {
              id: building.id,
              title: building.title,
              units: {
                create: {
                  id: unit.id,
                  floor: unit.floor,
                  number: unit.number,
                  type: convertUnitType(unit.type),
                },
              },
            },
          },
        },
      });

      await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(1);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(1);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(1);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(0);
    });

    it("should not be able to create when unit's building id does not exist", async () => {
      const { buildings: initialBuildings, units: initialUnities } =
        registerInformation;
      const [unit] = initialUnities;
      registerInformation = {
        ...registerInformation,
        units: [
          {
            ...unit,
            buildingId: initialBuildings.length + 10,
          },
        ],
      };

      await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(0);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(0);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(0);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(0);
    });

    it("should not be able to create when unitParkingSpace's id already exists", async () => {
      const [realty] = registerInformation.realties;
      const [building] = registerInformation.buildings;
      const [apartment, parkingSpace] = registerInformation.units;
      await prismaService.realty.create({
        data: {
          ...realty,
          buildings: {
            create: {
              id: building.id,
              title: building.title,
              units: {
                create: [
                  {
                    id: apartment.id,
                    floor: apartment.floor,
                    number: apartment.number,
                    type: UnitType.APARTMENT,
                  },
                  {
                    id: parkingSpace.id,
                    floor: parkingSpace.floor,
                    number: parkingSpace.number,
                    type: UnitType.PARKINGSPACE,
                  },
                ],
              },
            },
          },
        },
      });
      await prismaService.unitParkingSpace.create({
        data: {
          unitId: apartment.id,
          parkingSpaceId: parkingSpace.id,
        },
      });

      await await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(1);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(1);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(2);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(1);
    });

    it("should not be able to create when unitParkingSpace's parkingSpace id does not exist", async () => {
      const { units: initialUnities } = registerInformation;
      const [unit] = initialUnities;
      registerInformation = {
        ...registerInformation,
        units: [
          {
            ...unit,
            parkingSpaceIds: [initialUnities.length + 10],
          },
        ],
      };

      await expect(
        realtyPrismaRepository.createMany(registerInformation)
      ).rejects.toThrow(PrismaClientKnownRequestError);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(0);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(0);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(0);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(0);
    });

    it("should  be able to create", async () => {
      const {
        realties: initialRealties,
        buildings: initialBuildings,
        units: initialUnits,
      } = registerInformation;

      const convertedUnits = initialUnits.map(
        ({ id, floor, number, buildingId, type }) => {
          return {
            id,
            floor,
            number,
            buildingId,
            type: convertUnitType(type),
          };
        }
      );

      const [firstRealty, secondRealty] = initialRealties;
      const response: RealtyEntity[] = [
        {
          ...firstRealty,
          buildings: [
            {
              id: 1,
              realtyId: 1,
              title: "Torre 1",
              units: [
                {
                  id: 1,
                  floor: 100,
                  number: "15",
                  buildingId: 1,
                  type: UnitType.APARTMENT,
                  unitParkingSpaces: [
                    {
                      unitId: 1,
                      parkingSpaceId: 2,
                    },
                    {
                      unitId: 1,
                      parkingSpaceId: 3,
                    },
                  ],
                },
                {
                  id: 2,
                  floor: -1,
                  number: "1",
                  buildingId: 1,
                  type: UnitType.PARKINGSPACE,
                  unitParkingSpaces: [],
                },
                {
                  id: 3,
                  floor: -1,
                  number: "2",
                  buildingId: 1,
                  type: UnitType.PARKINGSPACE,
                  unitParkingSpaces: [],
                },
                {
                  id: 4,
                  floor: 53,
                  number: "13",
                  buildingId: 1,
                  type: UnitType.APARTMENT,
                  unitParkingSpaces: [],
                },
              ],
            },
          ],
        },
        {
          ...secondRealty,
          buildings: [
            {
              id: 2,
              realtyId: 2,
              title: "Torre Norte",
              units: [
                {
                  id: 5,
                  floor: 13,
                  number: "135",
                  buildingId: 2,
                  type: UnitType.APARTMENT,
                  unitParkingSpaces: [
                    {
                      unitId: 5,
                      parkingSpaceId: 7,
                    },
                  ],
                },
              ],
            },
            {
              id: 3,
              realtyId: 2,
              title: "Torre Sul",
              units: [],
            },
            {
              id: 4,
              realtyId: 2,
              title: "Torre de Vagas",
              units: [
                {
                  id: 6,
                  floor: 1,
                  number: "A",
                  buildingId: 4,
                  type: UnitType.PARKINGSPACE,
                  unitParkingSpaces: [],
                },
                {
                  id: 7,
                  floor: 1,
                  number: "B",
                  buildingId: 4,
                  type: UnitType.PARKINGSPACE,
                  unitParkingSpaces: [],
                },
              ],
            },
          ],
        },
      ];

      const createdRealties =
        await realtyPrismaRepository.createMany(registerInformation);

      expect(createdRealties).toHaveLength(2);
      expect(createdRealties).toEqual(response);

      const realties = await prismaService.realty.findMany();
      expect(realties).toHaveLength(initialRealties.length);
      expect(realties).toEqual(initialRealties);

      const buildings = await prismaService.building.findMany();
      expect(buildings).toHaveLength(initialBuildings.length);
      expect(buildings).toEqual(initialBuildings);

      const units = await prismaService.unit.findMany();
      expect(units).toHaveLength(initialUnits.length);
      expect(units).toEqual(convertedUnits);

      const unitParkingSpaces = await prismaService.unitParkingSpace.findMany();
      expect(unitParkingSpaces).toHaveLength(3);
    });
  });

  describe("findManyById", () => {
    let realty: RealtyEntity;

    beforeEach(async () => {
      realty = await prismaService.realty.create({
        data: {
          title: "Test Realty",
        },
        include: { buildings: true },
      });
    });

    it("should not be able to find when send inexistent ids", async () => {
      const ids = [realty.id + 5, realty.id + 10];

      const realties = await realtyPrismaRepository.findManyById(ids);

      expect(realties).toHaveLength(0);
    });

    it("should not be able to find when send no ids", async () => {
      const ids = [];

      const realties = await realtyPrismaRepository.findManyById(ids);

      expect(realties).toHaveLength(0);
    });

    it("should be able to find two realties when send multiples ids", async () => {
      const newRealty = await prismaService.realty.create({
        data: {
          title: "New Realty Test",
        },
        include: { buildings: true },
      });

      const ids = [realty.id, newRealty.id, realty.id + 10, newRealty.id + 10];

      const realties = await realtyPrismaRepository.findManyById(ids);

      expect(realties).toHaveLength(2);
      expect(realties).toContainEqual(realty);
      expect(realties).toContainEqual(newRealty);
    });

    it("should be able to find a realty when send multiples ids", async () => {
      const ids = [realty.id, realty.id + 10, realty.id + 20];

      const realties = await realtyPrismaRepository.findManyById(ids);

      expect(realties).toHaveLength(1);
      expect(realties).toContainEqual(realty);
    });

    it("should be able to find a realty when send an id", async () => {
      const ids = [realty.id];

      const realties = await realtyPrismaRepository.findManyById(ids);

      expect(realties).toHaveLength(1);
      expect(realties).toContainEqual(realty);
    });
  });
});
