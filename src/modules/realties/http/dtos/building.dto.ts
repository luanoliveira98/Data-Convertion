import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BuildingErrors } from "../errors/building.errors";
import { UnitOutput } from "./unit.dto";

@InputType()
export class BuildingDto {
  @Field(() => Number)
  @IsNotEmpty({ message: BuildingErrors.REQUIRED_ID })
  @IsNumber({}, { message: BuildingErrors.ID_MUST_BE_NUMBER })
  readonly id: number;

  @Field(() => String)
  @IsNotEmpty({ message: BuildingErrors.REQUIRED_TITLE })
  @IsString({ message: BuildingErrors.TITLE_MUST_BE_STRING })
  readonly title: string;

  @Field(() => Number)
  @IsNotEmpty({ message: BuildingErrors.REQUIRED_REALTY_ID })
  @IsNumber({}, { message: BuildingErrors.REALTY_ID_MUST_BE_NUMBER })
  readonly realtyId: number;
}

@ObjectType()
export class BuildingOutput {
  @Field(() => Number)
  readonly id: number;

  @Field(() => String)
  readonly nome: string;

  @Field(() => [UnitOutput])
  readonly unidades: UnitOutput[];
}
