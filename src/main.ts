import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigurationService } from "./config/configuration.service";
import { LoggerService } from "./services/loggerService/logger.service";
import { correlationMiddleware } from "./middlewares/correlation.middleware";
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { GlobalExceptionFilter } from "./exceptions/globalException.filter";
import { useContainer } from "class-validator";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidatorException } from "./exceptions/badRequest/validator.exception";
import { getValidatorError } from "./helpers/getValidatorErrorMessage";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = await app.resolve(LoggerService);
  app.use(correlationMiddleware(loggerService));

  app.enableCors({
    origin: "*",
    exposedHeaders: ["Authorization", "refresh_token", "correlationId"],
    methods: "GET, PUT, POST, DELETE, UPDATE, OPTIONS, PATCH",
    credentials: true,
  });

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["v1"],
    prefix: "",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const message = getValidatorError(errors);
        throw new ValidatorException(message);
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Shopping stripe apis")
    .setDescription("Shopping stripe API document")
    .setVersion("v1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const configurationService = app.get(ConfigurationService);
  const port = configurationService.port;
  await app.listen(port);
}
bootstrap();
