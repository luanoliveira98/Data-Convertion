import { Module } from "@nestjs/common";
import { LoggerService } from "./domain/services/logger.service";
import { PrismaService } from "./domain/services/prisma.service";

@Module({
  providers: [LoggerService, PrismaService],
  exports: [LoggerService, PrismaService],
})
export class SharedModule {}
