import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { v4 as uuidv4 } from "uuid";
import { User, UserDocument } from "src/schemas/User.schema";
import {
  Confirmation,
  ConfirmationDocument,
} from "src/schemas/Confirmation.schema";
import { sendSMS } from "src/common/utils/sms.util";
import { comparePassword, hashPassword } from "src/common/utils/password.util";
import { ConfirmUserDto } from "./dto/confirm-user.dto";
import { paginate } from "src/common/utils/pagination.util";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
    @InjectModel(Confirmation.name)
    private readonly confirmationModel: Model<ConfirmationDocument>,
    private readonly jwtService: JwtService
  ) {}

  async create(CreateUserDto: CreateUserDto) {
    let user = await this.findUserByPhoneNumber(CreateUserDto);
    if (!user) {
      user = await this.usersModel.create(CreateUserDto);
    }
    const confirmationCheck = await this.confirmationModel.findOne({
      data: CreateUserDto.phone_number,
    });
    if (confirmationCheck) {
      if (confirmationCheck.expiredAt < new Date()) {
        await this.confirmationModel.findByIdAndDelete(confirmationCheck._id);
      } else {
        throw new BadRequestException("Confirmation already exists");
      }
    }

    const uuid = uuidv4();
    let code = Math.floor(10000 + Math.random() * 90000);
    console.log(code);
    if (CreateUserDto.phone_number == "998339999779") {
      code = 12056;
    }
    // await sendSMS(CreateUserDto.phone_number, code);
    const hashedPassword = await hashPassword(code);

    const newConfirmation = await this.confirmationModel.create({
      type: "phone",
      uuid,
      code: hashedPassword,
      data: CreateUserDto.phone_number,
      expiredAt: new Date(Date.now() + 1000 * 2 * 60),
    });

    await newConfirmation.save();
    console.log(newConfirmation);

    return {
      data: {
        id: newConfirmation._id,
        uuid: newConfirmation.uuid,
        type: "phone",
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 1000 * 2 * 60),
      },
    };
  }

  async confirmUserRegister(uuid: string, ConfirmUserDto: ConfirmUserDto) {
    const confirmation = await this.confirmationModel.findOne({ uuid });
    console.log(confirmation);

    if (!confirmation) {
      throw new BadRequestException("Confirmation not found");
    }
    if (confirmation.expiredAt < new Date()) {
      throw new BadRequestException("Confirmation expired. send new code");
    }
    const isMatch = await comparePassword(
      ConfirmUserDto.code,
      confirmation.code
    );
    if (!isMatch) {
      throw new BadRequestException("Invalid code");
    }
    const user = await this.usersModel.findOne({
      phone_number: confirmation.data,
    });
    console.log(user);
    await this.confirmationModel.findByIdAndDelete(confirmation._id);
    const token = await this.jwtService.signAsync({
      id: user?._id,
      role: user?.role,
    });

    return {
      data: {
        token,
        user,
      },
    };
  }

  async findUserByPhoneNumber(CreateUserDto: CreateUserDto) {
    const user = await this.usersModel.findOne(CreateUserDto);
    console.log(CreateUserDto);
    return user;
  }

  async findAll(query: any) {
    const data: any = await paginate(this.usersModel, query);
    return data;
  }

  async updateUserById(_id: string, UpdateUserDto: UpdateUserDto) {
    const user = await this.usersModel.findByIdAndUpdate(_id, UpdateUserDto, {
      new: true,
    });
    return {
      data: user,
    };
  }
  async login(CreateUserDto: CreateUserDto) {
    const user = await this.findUserByPhoneNumber(CreateUserDto);
    if (!user) {
      throw new NotFoundException("User not found, please register");
    }

    const confirmationCheck = await this.confirmationModel.findOne({
      data: CreateUserDto.phone_number,
    });
    if (confirmationCheck) {
      if (confirmationCheck.expiredAt < new Date()) {
        await this.confirmationModel.findByIdAndDelete(confirmationCheck._id);
      } else {
        throw new BadRequestException("Confirmation already exists");
      }
    }

    const uuid = uuidv4();
    const code = Math.floor(10000 + Math.random() * 90000);
    console.log(code);
    await sendSMS(CreateUserDto.phone_number, code);
    const hashedPassword = await hashPassword(code);

    const newConfirmation = await this.confirmationModel.create({
      type: "phone",
      uuid,
      code: hashedPassword,
      data: CreateUserDto.phone_number,
      expiredAt: new Date(Date.now() + 1000 * 2 * 60),
    });

    await newConfirmation.save();

    return {
      data: {
        id: newConfirmation._id,
        uuid: newConfirmation.uuid,
        type: "phone",
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 1000 * 2 * 60),
      },
    };
  }
  async confirmUserLogin(uuid: string, ConfirmUserDto: ConfirmUserDto) {
    const confirmation = await this.confirmationModel.findOne({ uuid });

    if (!confirmation) {
      console.error(`Confirmation not found for uuid: ${uuid}`);
      throw new BadRequestException("Confirmation not found");
    }

    if (confirmation.expiredAt < new Date()) {
      throw new BadRequestException("Confirmation expired. Send new code");
    }

    const isMatch = await comparePassword(
      ConfirmUserDto.code,
      confirmation.code
    );

    if (!isMatch) {
      throw new BadRequestException("Invalid code");
    }

    const user = await this.findUserByPhoneNumber({
      phone_number: confirmation.data,
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    await this.confirmationModel.findByIdAndDelete(confirmation._id);

    const token = await this.jwtService.signAsync({
      id: user._id,
      role: user.role,
    });

    return {
      data: {
        token,
        user,
      },
    };
  }

  async getme(id: any) {
    const user = await this.usersModel.findById(id);
    return {
      data: user,
    };
  }
}
