import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class MinioFile extends CommonEntity {
  @Column({ name: 'bucket_name' })
  bucketName: string;

  @Column({ name: 'file_name', unique: true })
  fileName: string;
}
