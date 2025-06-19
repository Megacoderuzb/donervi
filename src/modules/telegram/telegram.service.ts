import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Telegraf, Markup } from "telegraf";
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from "src/schemas/Booking.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private adminChatId: any;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>
  ) {
    const BOT_TOKEN = this.configService.get<string>("BOT_TOKEN") || "7852529077:AAFcM-orsuRHdq3q9EcoNlWqwGpQeudSjko";
    this.adminChatId = this.configService.get<string>("ADMIN_CHAT_ID") || "5587555979";

    if (!BOT_TOKEN) {
      throw new Error("Telegram Bot token is not defined");
    }

    this.bot = new Telegraf(BOT_TOKEN);
  }

  onModuleInit() {
    this.setupActions();
    this.bot.launch();
  }

  async notifyAdmin(booking: Booking) {
    const message = `
🆕 New Booking Request
👤 ${booking.user.name} ${booking.user.surname}
📞 ${booking.user.phone}
📅 Date: ${new Date(booking.date).toLocaleString()}
👥 Visitors: ${booking.visitors_quantity}
💬 Comment: ${booking.comment || "None"}
🟠 Status: ${booking.status}
`;

    await this.bot.telegram.sendMessage(
      this.adminChatId,
      message,
      Markup.inlineKeyboard([
        Markup.button.callback("✅ Accept", `booking|${booking._id}|2`),
        Markup.button.callback("❌ Reject", `booking|${booking._id}|-1`),
      ])
    );
  }

  private setupActions() {
    this.bot.action(/accept_(.+)/, async (ctx) => {
      const id = ctx.match[1];

      const updated = await this.bookingModel.findByIdAndUpdate(
        id,
        { status: BookingStatus.ACCEPTED },
        { new: true }
      );

      if (!updated) {
        await ctx.reply(`❌ Booking request not found.`);
        throw new NotFoundException("Booking request not found");
      }

      await ctx.reply(`✅ Booking request accepted.`);
    });

    this.bot.action(/reject_(.+)/, async (ctx) => {
      const id = ctx.match[1];

      const updated = await this.bookingModel.findByIdAndUpdate(
        id,
        { status: BookingStatus.REJECTED },
        { new: true }
      );

      if (!updated) {
        await ctx.reply(`❌ Booking request not found.`);
        throw new NotFoundException("Booking request not found");
      }

      await ctx.reply(`❌ Booking request rejected.`);
    });
  }
}
