import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { LoggerService } from "@src/modules/shared/domain/services/logger.service";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.contextName = BadRequestExceptionFilter.name;
  }

  public catch(exception: HttpException, host: ArgumentsHost) {
    this.loggerService.error(`Called method: #${this.catch.name}()`);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message = exception.message;
    const stack = exception?.stack;
    const details = exception.getResponse();

    this.loggerService.error(`Message Error: #${message}`);
    this.loggerService.error(`Stack: #${JSON.stringify(stack)}`);
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).send({
      error: {
        type: "BAD_REQUEST",
        code: status,
        message: exception.message,
        details,
      },
    });
  }
}
