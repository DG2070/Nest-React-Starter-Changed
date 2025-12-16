import { HttpException, HttpStatus } from '@nestjs/common';

export class EsewaServiceUnavailableException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class EsewaSignatureMismatchException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONTENT_DIFFERENT);
  }
}

export class EsewaPaymentHistorySavingException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class EsewaPaymentVerificationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UpdatingPaymentAfterVerificationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidTokenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidOTPException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
