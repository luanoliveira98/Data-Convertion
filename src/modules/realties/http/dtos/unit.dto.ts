import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { UnitTypeRequest } from "../enums/unit-type-request.enum";
import { UnitErrors } from "../errors/unit.errors";

@InputType()
export class UnitDto {
  @Field(() => Number)
  @IsNotEmpty({ message: UnitErrors.REQUIRED_ID })
  @IsNumber({}, { message: UnitErrors.ID_MUST_BE_NUMBER })
  readonly id: number;

  @Field(() => String)
  @IsNotEmpty({ message: UnitErrors.REQUIRED_NUMBER })
  @IsString({ message: UnitErrors.NUMBER_MUST_BE_STRING })
  readonly number: string;

  @Field(() => Number)
  @IsNotEmpty({ message: UnitErrors.REQUIRED_FLOOR })
  @IsNumber({}, { message: UnitErrors.FLOOR_MUST_BE_NUMBER })
  readonly floor: number;

  @Field(() => String)
  @IsNotEmpty({ message: UnitErrors.REQUIRED_TYPE })
  @IsEnum(UnitTypeRequest, {
    message: UnitErrors.TYPE_MUST_BE_IN_ENUM,
  })
  readonly type: string;

  @Field(() => [Number], { nullable: true })
  @IsArray({ message: UnitErrors.PARKING_SPACE_IDS_MUST_BE_ARRAY })
  @IsOptional()
  readonly parkingSpaceIds?: number[];

  @Field(() => Number)
  @IsNotEmpty({ message: UnitErrors.REQUIRED_BUILDING_ID })
  @IsNumber({}, { message: UnitErrors.BUILDING_ID_MUST_BE_NUMBER })
  readonly buildingId: number;
}

@ObjectType()
export class UnitOutput {
  @Field(() => Number)
  readonly id: number;

  @Field(() => String)
  readonly numero: string;

  @Field(() => Number)
  readonly andar: number;

  @Field(() => String)
  readonly tipo: string;

  @Field(() => [Number])
  readonly vagasDeGaragemIds: number[];
}
