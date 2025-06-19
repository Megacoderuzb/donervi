import {
  Controller,
  Post,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ImagesService } from "./images.service";

function storage() {
  return diskStorage({
    destination: `./uploads`,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
}

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image", { storage: storage() }))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.handleUpload(file);
  }
}
