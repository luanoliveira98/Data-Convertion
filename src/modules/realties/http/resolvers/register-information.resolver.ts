import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "@src/modules/shared/domain/services/logger.service";
import { RegisterInformationService } from "../../domain/services/register-information.service";
import {
  RegisterInformationDto,
  RegisterInformationOutput,
} from "../dtos/register-information.dto";

@Resolver()
export class RegisterInformationResolver {
  constructor(
    private readonly registerInformationService: RegisterInformationService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.contextName = RegisterInformationResolver.name;
  }

  @Query(() => String)
  home(): string {
    return "Home";
  }

  @Mutation(() => RegisterInformationOutput)
  registerInformation(
    @Args("data") args: RegisterInformationDto
  ): Promise<RegisterInformationOutput> {
    this.loggerService.info(
      `Called method: ${this.registerInformation.name}()`
    );
    return this.registerInformationService.create(args);
  }
}
