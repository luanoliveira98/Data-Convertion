import { Module } from "@nestjs/common";
import { LoggerService } from "./domain/services/logger.service";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}
