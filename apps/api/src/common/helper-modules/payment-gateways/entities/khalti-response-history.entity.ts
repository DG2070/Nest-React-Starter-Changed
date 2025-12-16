import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class KhaltiPayHistory extends CommonEntity {
  @Column()
  pidx: string;

  @Column()
  total_amount: number;

  @Column({
    nullable: true,
  })
  status: string;

  @Column({
    nullable: true,
  })
  transaction_id: string;

  @Column()
  fee: number;

  @Column()
  refunded: boolean;
}
