import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ConfirmUserDto } from './dto/confirm-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    return this.usersService.findAll({ ...req.query, baseUrl });
  }

  @Post('auth')
  async register(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @Post('/auth/:id')
  async confirmRegister(
    @Param('id') id: string,
    @Body() ConfirmUserDto: ConfirmUserDto,
  ) {
    console.log(id);

    return this.usersService.confirmUserRegister(id, ConfirmUserDto);
  }
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Put('profile')
  async editUserProfile(
    @Body() UpdateUserDto: UpdateUserDto,
    @Request() req
  ) {
    return await this.usersService.updateUserById(req.user.id, UpdateUserDto);
  }
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return await this.usersService.getme(req.user.id);
  }
}
