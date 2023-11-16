import { ApolloDriver } from "@nestjs/apollo";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { useContainer } from "class-validator";
import * as request from "supertest";
import { RealtyEntity } from "../domain/entities/realty.entity";
import { UnitType } from "../domain/enums/unit-type.enum";
import { registerInformationMapper } from "../domain/services/mappers/register-information.mapper";
import {
  RegisterInformationDto,
  RegisterInformationOutput,
} from "../http/dtos/register-information.dto";
import { UnitTypeRequest } from "../http/enums/unit-type-request.enum";
import { RegisterInformationErrors } from "../http/errors/register-info.errors";
import { UnitErrors } from "../http/errors/unit.errors";
import { RealtiesModule } from "../realties.module";

describe("RegisterInformation", () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let registerInformation: RegisterInformationDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        RealtiesModule,
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app, { fallbackOnErrors: true });
    await app.init();

    prismaService = new PrismaService();
  });

  beforeEach(async () => {
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

  afterAll(async () => {
    await app.close();
  });

  describe("registerInformation", () => {
    let query: string;

    beforeEach(async () => {
      query = `
        mutation registerInformation(
          $realties: [RealtyDto!]!,
          $buildings: [BuildingDto!]!,
          $units: [UnitDto!]!
        ) {
          registerInformation(
            data: {
              realties: $realties,
              buildings: $buildings,
              units: $units
            }
          ) {
            empreendimentos {
              id
              nome
              torres {
                id
                nome
                unidades {
                  id
                  numero
                  andar
                  tipo
                  vagasDeGaragemIds
                }
              }
            }
          }
        }
      `;
    });

    it("should not be able to register when not send arrays", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            realties: [],
            buildings: [],
            units: [],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.originalError.message).toContain(
        RegisterInformationErrors.REQUIRED_REALTIES
      );
      expect(body.errors[0].extensions.originalError.message).toContain(
        RegisterInformationErrors.REQUIRED_BUILDINGS
      );
      expect(body.errors[0].extensions.originalError.message).toContain(
        RegisterInformationErrors.REQUIRED_UNITS
      );
    });

    it("should not be able to register when send wrong realties' id type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            realties: [
              {
                id: "",
                title: "123",
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong realties' title type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            realties: [
              {
                id: 123,
                title: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send realties' id", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            realties: [
              {
                id: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send realties' title", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            realties: [
              {
                id: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong buildings' id type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            buildings: [
              {
                id: "",
                title: "123",
                realtyId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong buildings' title type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            buildings: [
              {
                id: 123,
                title: 123,
                realtyId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong buildings' realtyId type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            buildings: [
              {
                id: 123,
                title: "123",
                realtyId: "123",
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send buildings' id", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            buildings: [
              {
                title: "123",
                realtyId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send buildings' title", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            buildings: [
              {
                id: 123,
                realtyId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send buildings' realtyId", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            buildings: [
              {
                id: 123,
                title: "123",
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong units' id type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: "123",
                number: "123",
                floor: 123,
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong units' number type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                number: 123,
                floor: 123,
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong units' floor type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                number: "123",
                floor: "123",
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong units' type type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                number: "123",
                floor: 123,
                type: 123,
                buildingId: 123,
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong units' buildingId type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                number: "123",
                floor: UnitTypeRequest.APARTMENT,
                type: 123,
                buildingId: "123",
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send wrong units' parkingSpaceIds type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                number: "123",
                floor: 123,
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
                parkingSpaceIds: ["123"],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send units' id", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                number: "123",
                floor: 123,
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
                parkingSpaceIds: [123],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send units' number", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                floor: 123,
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
                parkingSpaceIds: [123],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send units' floor", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                number: "123",
                id: 123,
                type: UnitTypeRequest.APARTMENT,
                buildingId: 123,
                parkingSpaceIds: [123],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send units' type", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                number: "123",
                floor: 123,
                id: 123,
                buildingId: 123,
                parkingSpaceIds: [123],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when not send units' buildingId", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                number: "123",
                id: 123,
                type: UnitTypeRequest.APARTMENT,
                floor: 123,
                parkingSpaceIds: [123],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.code).toContain("BAD_USER_INPUT");
    });

    it("should not be able to register when send units' type invalid", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: {
            ...registerInformation,
            units: [
              {
                id: 123,
                number: "123",
                floor: 123,
                type: "invalid type",
                buildingId: 123,
                parkingSpaceIds: [123],
              },
            ],
          },
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.errors[0].extensions.originalError.message).toContain(
        UnitErrors.TYPE_MUST_BE_IN_ENUM
      );
    });

    it("should be able to register", async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          variables: registerInformation,
          query,
        });

      expect(statusCode).toBe(HttpStatus.OK);

      const response: RealtyEntity[] = [
        {
          ...registerInformation.realties[0],
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
          ...registerInformation.realties[1],
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

      const responseMapped = registerInformationMapper.map<
        RealtyEntity[],
        RegisterInformationOutput
      >(response, "RealtyEntity[]", "RegisterInformationOutput");

      expect(body.data.registerInformation).toEqual(responseMapped);
    });
  });
});
