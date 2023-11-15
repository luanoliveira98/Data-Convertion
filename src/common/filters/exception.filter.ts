import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { LoggerService } from "@src/modules/shared/domain/services/logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.contextName = AllExceptionsFilter.name;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    this.loggerService.error(`Called method: #${this.catch.name}()`);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const stack = exception instanceof HttpException ? exception.stack : [];

    const message =
      exception instanceof HttpException
        ? exception.message
        : "UNKNOWN_EXCEPTION";

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.loggerService.error(`Message Error: #${message}`);
    this.loggerService.error(`Stack: #${JSON.stringify(stack)}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
