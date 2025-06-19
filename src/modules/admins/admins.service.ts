import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { comparePassword, hashPassword } from 'src/common/utils/password.util';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from 'src/schemas/Admin.schema';
import { Model } from 'mongoose';
import { LoginAdminDto } from './dto/login-admin';
import { JwtService } from '@nestjs/jwt';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await hashPassword(createAdminDto.password);
    createAdminDto.password = hashedPassword;
    const user = await this.adminModel.create(createAdminDto);
    return {
      data: user,
    };
  }

  async login(LoginAdminDto: LoginAdminDto) {
    const user = await this.adminModel.findOne({ login: LoginAdminDto.login });
    if (!user) {
      throw new NotFoundException('admin not found');
    }
    const isMatch = await comparePassword(
      LoginAdminDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadGatewayException('Invalid password');
    }
    const token = await this.jwtService.signAsync({
      id: user._id,
      role: user.role,
    });
    return {
      data: {
        token,
        ...user.toJSON(),
      },
    };
  }

  async getMe(id: number | string) {
    const admin = await this.adminModel.findById(id).select('-password');

    return {
      data: admin,
    };
  }

  async updateProfile(id: number | string, UpdateAdminDto: UpdateAdminDto) {
    const admin = await this.adminModel.findByIdAndUpdate(id, UpdateAdminDto, {
      new: true,
    });
    return {
      data: admin,
    };
  }
}
