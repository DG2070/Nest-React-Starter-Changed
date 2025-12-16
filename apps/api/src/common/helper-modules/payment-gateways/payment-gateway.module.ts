import { Global, Module } from '@nestjs/common';
import { KhaltiPayService } from './khalti-pay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhaltiPayHistory } from './entities/khalti-response-history.entity';
import { EsewaService } from './esewa.service';
import { EsewaPaymentHistory } from './entities/esewa-response-history.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([KhaltiPayHistory, EsewaPaymentHistory])],
  providers: [KhaltiPayService, EsewaService],
  exports: [KhaltiPayService, EsewaService],
})
export class PaymentGateway {}
