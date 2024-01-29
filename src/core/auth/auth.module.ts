import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { RegisterService } from "./register/register.service";
import { UserModule } from "../users/user.module";
import { PrismaModule } from "../../services/prismaService/prisma.module";
import { PasswordModule } from "../../services/passwordService/password.module";

@Module({
  imports: [PrismaModule, UserModule, PasswordModule],
  controllers: [AuthController],
  providers: [RegisterService],
  exports: [],
})
export class AuthModule {}
