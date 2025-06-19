import { Controller, Get, Body, Put, UseGuards, Inject } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { UpdateSettingDto } from "./dto/update-settings.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";

@Controller("settings")
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  @Get()
  getSettings() {
    return this.settingsService.get();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put()
  async updateSettings(@Body() UpdateSettingDto: UpdateSettingDto) {
    let updated = await this.settingsService.update(UpdateSettingDto);
    return updated;
  }
}
