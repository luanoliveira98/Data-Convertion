import { BadRequestException } from "@nestjs/common";
import { UnitTypeRequest } from "../../http/enums/unit-type-request.enum";
import { UnitErrors } from "../../http/errors/unit.errors";
import { UnitType } from "../enums/unit-type.enum";

export const convertUnitType = (unitType: string) => {
  switch (unitType) {
    case UnitTypeRequest.APARTMENT:
      return UnitType.APARTMENT;
    case UnitTypeRequest.PARKINGSPACE:
      return UnitType.PARKINGSPACE;
    default:
      throw new BadRequestException(UnitErrors.TYPE_MUST_BE_IN_ENUM);
  }
};
