import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { UnitOutput } from "@src/modules/realties/http/dtos/unit.dto";
import { UnitEntity } from "../../entities/unit.entity";
import { getParkingSpaceIds } from "../../helpers/get-array-ids";

export const unitMapper = createMapper({
  strategyInitializer: pojos(),
});

createMap<UnitEntity, UnitOutput>(
  unitMapper,
  "UnitEntity",
  "UnitOutput",
  forMember(
    (destination) => destination.id,
    mapFrom((source) => source.id)
  ),
  forMember(
    (destination) => destination.numero,
    mapFrom((source) => source.number)
  ),
  forMember(
    (destination) => destination.andar,
    mapFrom((source) => source.floor)
  ),
  forMember(
    (destination) => destination.tipo,
    mapFrom((source) => source.type)
  ),
  forMember(
    (destination) => destination.vagasDeGaragemIds,
    mapFrom((source) => getParkingSpaceIds(source.unitParkingSpaces))
  )
);
