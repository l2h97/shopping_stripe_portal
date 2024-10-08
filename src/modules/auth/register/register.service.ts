import { Inject, Injectable } from '@nestjs/common';
import { RegisterPayload } from './register.payload';
import { PasswordService } from '../../../services/passwordService/password.service';
import { ExistsUserException } from '../../../exceptions/badRequest/existsUser.exception';
import {
  EMAIL_VERIFY_SERVICE,
  EXPOSE_GROUP_PRIVATE,
  VERIFY_EMAIL_TOKEN_EXPIRED,
} from '../../../helpers/constant';
import { EmailService } from '../../../services/emailService/email.service';
import { EmailUIUrlParams, EmailUIUrlService } from './emailUIUrl.service';
import { ConfigurationService } from '../../../config/configuration.service';
import { REDIS_KEY } from '../../../services/redisService/redisKey';
import { UserRepository } from '../../user/user.repository';
import { Prisma } from '@prisma/client';
import { ConflictException } from '../../../exceptions/conflict/conflict.exception';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../../../dto/user.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userRepository: UserRepository,
    private passwordService: PasswordService,
    @Inject(EMAIL_VERIFY_SERVICE)
    private readonly emailVerifyService: EmailService,
    private readonly emailUIUrlService: EmailUIUrlService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async execute(payload: RegisterPayload): Promise<UserDto> {
    const { email, password, fullName } = payload;

    const user = await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new ExistsUserException();
    }

    const { passwordHashed, salt } = await this.passwordService.hashPassword(
      password,
      email,
    );

    const userCreateInput: Prisma.UserCreateInput = {
      email,
      fullName,
      salt,
      passwordHashed,
    };
    const newUser = await this.userRepository.createUser(userCreateInput);

    if (!newUser) {
      throw new ConflictException(
        'REGISTER_USER_ERROR',
        'Unable to register users at this time',
      );
    }

    const params: EmailUIUrlParams = {
      emailUIUrl: this.configurationService.verifyEmailUIUrl,
      key: REDIS_KEY.VERIFY_EMAIL,
      email,
      tokenExpired: VERIFY_EMAIL_TOKEN_EXPIRED,
    };
    const url = await this.emailUIUrlService.execute(params);
    await this.emailVerifyService.sendEmail(email, { verifyEmailUrl: url });

    return plainToClass(UserDto, newUser, { groups: [EXPOSE_GROUP_PRIVATE] });
  }
}
