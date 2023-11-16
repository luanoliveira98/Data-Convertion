import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray } from "class-validator";
import { RegisterInformationErrors } from "../errors/register-info.errors";
import { BuildingDto } from "./building.dto";
import { RealtyDto, RealtyOutput } from "./realty.dto";
import { UnitDto } from "./unit.dto";

@InputType()
export class RegisterInformationDto {
  @Field(() => [RealtyDto])
  @IsArray({ message: RegisterInformationErrors.REALTIES_MUST_BE_ARRAY })
  @ArrayNotEmpty({ message: RegisterInformationErrors.REQUIRED_REALTIES })
  readonly realties: RealtyDto[];

  @Field(() => [BuildingDto])
  @IsArray({ message: RegisterInformationErrors.BUILDINGS_MUST_BE_ARRAY })
  @ArrayNotEmpty({ message: RegisterInformationErrors.REQUIRED_BUILDINGS })
  readonly buildings: BuildingDto[];

  @Field(() => [UnitDto])
  @IsArray({ message: RegisterInformationErrors.UNITS_MUST_BE_ARRAY })
  @ArrayNotEmpty({ message: RegisterInformationErrors.REQUIRED_UNITS })
  readonly units: UnitDto[];
}

@ObjectType()
export class RegisterInformationOutput {
  @Field(() => [RealtyOutput])
  readonly empreendimentos: RealtyOutput[];
}
