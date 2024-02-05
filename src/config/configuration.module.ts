import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./configuration";
import { ConfigurationService } from "./configuration.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [ConfigurationService, ConfigService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
