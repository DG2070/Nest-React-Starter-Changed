import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { FileUploadExceptionFilter } from '../cloudinary/filter/attachment-upload-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { Response } from 'express';

@Controller('image')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}
  @Auth(AuthType.None)
  @Post()
  @UseFilters(FileUploadExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.minioService.uploadObject(file);
  }

  @Auth(AuthType.None)
  @Get(':id')
  async getImage(@Res() res: Response, @Param('id') imageId: string) {
    const stream = await this.minioService.getObject(+imageId);

    res.setHeader('Content-Type', 'image/jpeg');

    stream.pipe(res);
  }

  @Auth(AuthType.None)
  @Get(':id/url')
  async getImageUrl(@Param('id') imageId: string) {
    return await this.minioService.getPresignedUrl(+imageId);
  }
}
