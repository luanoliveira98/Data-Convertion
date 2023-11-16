import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { RealtyOutput } from "@src/modules/realties/http/dtos/realty.dto";
import { RegisterInformationOutput } from "@src/modules/realties/http/dtos/register-information.dto";
import { RealtyEntity } from "../../entities/realty.entity";
import { realtyMapper } from "./realty.mapper";

export const registerInformationMapper = createMapper({
  strategyInitializer: pojos(),
});

createMap<RealtyEntity[], RegisterInformationOutput>(
  registerInformationMapper,
  "RealtyEntity[]",
  "RegisterInformationOutput",
  forMember(
    (destination) => destination.empreendimentos,
    mapFrom((source) =>
      realtyMapper.mapArray<RealtyEntity, RealtyOutput>(
        source,
        "RealtyEntity",
        "RealtyOutput"
      )
    )
  )
);
