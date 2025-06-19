import { Injectable } from "@nestjs/common";

@Injectable()
export class ImagesService {
  handleUpload(
    files: Express.Multer.File[] | Express.Multer.File
  ): string | string[] {
    if (Array.isArray(files)) {
      return files.map((file) => `/${file.filename}`);
    }
    return `${process.env.SITE_URL}/${files.filename}`;
  }
}
