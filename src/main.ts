import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AppModule } from "./ioC/app.module";
import { RealtiesModule } from "./modules/realties/realties.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    req.headers["apollo-require-preflight"] = "true";
    next();
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  useContainer(app.select(RealtiesModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
