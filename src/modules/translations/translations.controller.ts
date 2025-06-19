import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TranslationsService } from './translations.service';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  getAll() {
    return this.translationsService.findAll();
  }

  @Get(':lang')
  findByLang(@Param('lang') lang: string) {
    return this.translationsService.findByLang(lang);
  }

  @Get('search/:message')
  search(@Param('message') message: string) {
    return this.translationsService.search(message);
  }

  @Post(':lang')
  create(@Param('lang') lang: string, @Body() body: any) {
    const message: any = Object.keys(body)[0];
    const text: any = Object.values(body)[0];
    return this.translationsService.create(lang, message, text);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() createTranslationDto: { lang: string; translation: string },
  ) {
    return this.translationsService.update(
      id,
      createTranslationDto.lang,
      createTranslationDto.translation,
    );
  }
}
