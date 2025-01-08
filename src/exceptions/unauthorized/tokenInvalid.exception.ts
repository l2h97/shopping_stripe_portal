import { BaseHttpException } from '@exceptions/baseHttp.exception';
import { HttpStatus } from '@nestjs/common';

export class TokenInvalidException extends BaseHttpException {
  constructor() {
    super('INVALID_TOKEN', 'Token is invalid', HttpStatus.UNAUTHORIZED);
  }
}
