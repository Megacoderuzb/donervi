import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { Translation, TranslationSchema } from 'src/schemas/Translation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Translation.name, schema: TranslationSchema },
    ]),
  ],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
