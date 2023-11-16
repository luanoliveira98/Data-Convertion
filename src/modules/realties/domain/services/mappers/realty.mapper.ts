import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { BuildingOutput } from "@src/modules/realties/http/dtos/building.dto";
import { RealtyOutput } from "@src/modules/realties/http/dtos/realty.dto";
import { BuildingEntity } from "../../entities/building.entity";
import { RealtyEntity } from "../../entities/realty.entity";
import { buildingMapper } from "./building.mapper";

export const realtyMapper = createMapper({
  strategyInitializer: pojos(),
});

createMap<RealtyEntity, RealtyOutput>(
  realtyMapper,
  "RealtyEntity",
  "RealtyOutput",
  forMember(
    (destination) => destination.id,
    mapFrom((source) => source.id)
  ),
  forMember(
    (destination) => destination.nome,
    mapFrom((source) => source.title)
  ),
  forMember(
    (destination) => destination.torres,
    mapFrom((source) =>
      buildingMapper.mapArray<BuildingEntity, BuildingOutput>(
        source.buildings,
        "BuildingEntity",
        "BuildingOutput"
      )
    )
  )
);
