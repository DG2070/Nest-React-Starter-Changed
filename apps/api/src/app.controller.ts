import { Controller, Get } from '@nestjs/common';
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth(AuthType.None)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
