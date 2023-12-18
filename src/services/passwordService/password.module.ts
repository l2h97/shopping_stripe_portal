import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { ConfigurationModule } from "src/config/configuration.module";

@Module({
  imports: [ConfigurationModule],
  controllers: [],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
