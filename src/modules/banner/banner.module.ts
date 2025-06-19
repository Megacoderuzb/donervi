import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Banner, BannerSchema } from "src/schemas/Banner.schema";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
