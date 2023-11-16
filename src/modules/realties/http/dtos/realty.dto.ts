import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RealtyErrors } from "../errors/realty.errors";
import { BuildingOutput } from "./building.dto";

@InputType()
export class RealtyDto {
  @Field(() => Number)
  @IsNotEmpty({ message: RealtyErrors.REQUIRED_ID })
  @IsNumber({}, { message: RealtyErrors.ID_MUST_BE_NUMBER })
  readonly id: number;

  @Field(() => String)
  @IsNotEmpty({ message: RealtyErrors.REQUIRED_TITLE })
  @IsString({ message: RealtyErrors.TITLE_MUST_BE_STRING })
  readonly title: string;
}

@ObjectType()
export class RealtyOutput {
  @Field(() => Number)
  readonly id: number;

  @Field(() => String)
  readonly nome: string;

  @Field(() => [BuildingOutput])
  readonly torres: BuildingOutput[];
}
