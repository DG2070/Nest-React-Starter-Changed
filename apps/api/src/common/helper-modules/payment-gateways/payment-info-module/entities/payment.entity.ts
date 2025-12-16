import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { PaymentGateway } from '../enums/payment-gateway.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity()
export class Payment extends CommonEntity {
  @Column({ name: 'transaction_uuid' })
  transactionUuid: string;

  @Column({})
  amount: number;

  @Column({ type: 'enum', enum: PaymentGateway })
  gateway: PaymentGateway;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  //amount should be adjusted based on the incomming data about tax, service charge and other related charges.
  //add user information or user relation to the entity.
  //add information required about the product user is paying for.
}
