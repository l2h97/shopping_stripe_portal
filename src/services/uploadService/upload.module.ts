import { Module } from "@nestjs/common";
import { ConfigurationModule } from "../../config/configuration.module";
import { LoggerModule } from "../loggerService/logger.module";
import { UploadService } from "./upload.service";

@Module({
  imports: [ConfigurationModule, LoggerModule],
  controllers: [],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
