import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRandomInt } from 'src/common/helper-functions/random-integers.helper';
import { ConfigService } from '@nestjs/config';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { MinioFile } from './entities/minio-images.entity';

@Injectable()
export class MinioService {
  constructor(
    @Inject('MINIO_CLIENT') private readonly minioClient: any,
    private readonly configService: ConfigService,
    @InjectRepository(MinioFile)
    private readonly minioFileRepository: Repository<MinioFile>,
  ) {}

  async uploadObject(file: Express.Multer.File) {
    const bucket = this.configService.get<string>('STORAGE_BUCKET_NAME');
    const endpoint = this.configService.get<string>('STORAGE_ENDPOINT');

    const exists = await this.minioClient.bucketExists(bucket);

    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');
    }

    const randomInt = String(getRandomInt(100, 9999));
    const safeName = file.originalname.replace(/\s+/g, '_');
    const objectName = `${Date.now()}` + '-' + randomInt + `-` + `${safeName}`;
    const uploaded = await this.minioClient.putObject(
      bucket,
      objectName,
      file.buffer,
      process.env.STORAGE_BUCKET_NAME!,
      {
        'Content-Type': file.mimetype,
      },
    );
    if (uploaded) {
      const minioFileInstance = this.minioFileRepository.create({
        bucketName: bucket,
        fileName: objectName,
      });

      const [savedFile, error] = await safeError(
        this.minioFileRepository.save(minioFileInstance),
      );
      if (error)
        throw new InternalServerErrorException(
          `Unable to save Image. Try Again.`,
        );

      return {
        success: true,
        message: `Image upload success.`,
        imageURL: `https://${endpoint}:443/${bucket}/${objectName}`,
      };
    } else {
      throw new InternalServerErrorException('Unable to save Image.');
    }
  }

  async getObject(imageId: number) {
    const minioImage = await this.minioFileRepository.findOne({
      where: { id: imageId },
    });
    if (!minioImage)
      throw new BadRequestException(`No image with id: ${imageId} found.`);

    return this.minioClient.getObject(
      minioImage.bucketName,
      minioImage.fileName,
    );
  }

  async getPresignedUrl(imageId: number) {
    const expiresInSeconds = 24 * 60 * 60;
    const minioImage = await this.minioFileRepository.findOne({
      where: { id: imageId },
    });
    if (!minioImage)
      throw new BadRequestException(`No image with id: ${imageId} found.`);

    try {
      const url = await this.minioClient.presignedUrl(
        'GET',
        minioImage.bucketName,
        minioImage.fileName,
        expiresInSeconds,
      );
      return {
        success: true,
        message: `URL generation success.`,
        url: url,
      };
    } catch (err) {
      throw new HttpException(
        'Error generating presigned URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeObject(bucket: string, objectName: string): Promise<void> {
    await this.minioClient.removeObject(bucket, objectName);
  }
}

//for public bucket to return url

// async uploadObject(file: Express.Multer.File) {
//   const bucket = this.configService.get<string>('STORAGE_BUCKET_NAME');
//   const objectName = `${Date.now()}_${file.originalname}`;

//   await this.minioClient.putObject(bucket, objectName, file.buffer, {
//     'Content-Type': file.mimetype,
//   });

//   const url = `https://minio-ak8w0kwog4coo4kswg888s08.157.173.219.179.sslip.io/${bucket}/${objectName}`;

//   return { url };
// }
