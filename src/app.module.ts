import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { MongooseModule } from '@nestjs/mongoose';
  import { UsersModule } from './modules/users/users.module';
  import { TranslationsModule } from './modules/translations/translations.module';
  import { SettingsModule } from './modules/settings/settings.module';
  import { AdminsModule } from './modules/admins/admins.module';
  import { LoggerMiddleware } from './core/middleware/logger.middleware';
  import { JWTModule } from './modules/jwt/jwt.module';
  import { BannerModule } from './modules/banner/banner.module';
  import { CategoriesModule } from './modules/categories/categories.module';
  import { ProductsModule } from './modules/products/products.module';
  import { ImagesModule } from './modules/images/images.module';
  import { IngredientsModule } from './modules/ingredients/ingredients.module';
  import { OrdersModule } from './modules/orders/orders.module';
  import { PromocodesModule } from './modules/promos/promocodes.module';
  import { PaymentModule } from './modules/payment/payment.module';
  import { BookingModule } from './modules/booking/booking.module';
  import { TelegramModule } from './modules/telegram/telegram.module';

  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('MONGO_URI', process.env.MONGO_URI || 'mongodb://mongo:27017/donervi'),
        }),
      }),
      
      JWTModule,
      UsersModule,
      TranslationsModule,
      SettingsModule,
      AdminsModule,
      BannerModule,
      CategoriesModule,
      ProductsModule,
      ImagesModule,
      IngredientsModule,
      OrdersModule,
      PromocodesModule,
      PaymentModule,
      BookingModule,
      TelegramModule,
    ],
    controllers: [],
  })
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }