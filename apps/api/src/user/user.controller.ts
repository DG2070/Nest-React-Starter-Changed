import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequiredPermissions } from 'src/auth/decorators/permission.decorator';
import { RolePermissions } from 'src/auth/enums/role-permission.enum';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interfce';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(AuthType.None)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userService.signUp(signUpDto);
  }

  @Auth(AuthType.Bearer)
  @Post('sign-up-user')
  @RequiredPermissions(RolePermissions.createUser)
  async signUpUser(@Body() signUpUserDto: SignUpUserDto) {
    return await this.userService.signUpUser(signUpUserDto);
  }

  @Auth(AuthType.Bearer)
  @RequiredPermissions(RolePermissions.readAllUsers)
  @Get()
  async getAllUsers(
    @Query() query: UserQueryDto,
    @ActiveUser() loggedInUser: ActiveUserData,
  ) {
    return await this.userService.getAllUsers(query, loggedInUser);
  }
}
