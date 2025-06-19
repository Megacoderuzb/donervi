import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('register')
  createAdmin(@Body() CreateAdminDto: CreateAdminDto) {
    return this.adminsService.create(CreateAdminDto);
  }

  @Post('login')
  login(@Body() LoginAdminDto: LoginAdminDto) {
    return this.adminsService.login(LoginAdminDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() req: Request & { user: { id: string } }) {
    return this.adminsService.getMe(req.user.id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put('profile')
  updateAdmin(
    @Request() req: Request & { user: { id: string } },
    @Body() UpdateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.updateProfile(req.user.id, UpdateAdminDto);
  }
}
