import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { BuildingOutput } from "@src/modules/realties/http/dtos/building.dto";
import { UnitOutput } from "@src/modules/realties/http/dtos/unit.dto";
import { BuildingEntity } from "../../entities/building.entity";
import { UnitEntity } from "../../entities/unit.entity";
import { unitMapper } from "./unit.mapper";

export const buildingMapper = createMapper({
  strategyInitializer: pojos(),
});

createMap<BuildingEntity, BuildingOutput>(
  buildingMapper,
  "BuildingEntity",
  "BuildingOutput",
  forMember(
    (destination) => destination.id,
    mapFrom((source) => source.id)
  ),
  forMember(
    (destination) => destination.nome,
    mapFrom((source) => source.title)
  ),
  forMember(
    (destination) => destination.unidades,
    mapFrom((source) =>
      unitMapper.mapArray<UnitEntity, UnitOutput>(
        source.units,
        "UnitEntity",
        "UnitOutput"
      )
    )
  )
);
