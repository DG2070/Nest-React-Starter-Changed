import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { KhaltiPayInitiateInterface } from 'src/common/interfaces/payment-initiate.interface';
import { DataSource } from 'typeorm';
import { KhaltiPayHistory } from './entities/khalti-response-history.entity';
import {
  KhaltiHistorySavingError,
  KhaltiTransactionVerificationError,
} from 'src/common/errors/khalti-payment-gateway.errors';

@Injectable()
export class KhaltiPayService {
  constructor(private readonly dataSource: DataSource) {}
  async initiate(khaltiPayInitData: KhaltiPayInitiateInterface) {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.KHALTI_INITIATION_URL}`,
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          return_url: process.env.KHALTI_CALLBACK_URI,
          website_url: process.env.WEBSITE_URL,
          ...khaltiPayInitData,
        },
      });
      return response.data;
    } catch (error) {
      const errorIn = Object.keys(error.response.data)[0];
      if (errorIn == 'return_url' || 'website_url') {
        throw new BadGatewayException(`${errorIn} is either invalid or blank.`);
      } else if (errorIn == 'amount') {
        throw new BadRequestException(
          `Amount is either invalid or less than Rs. 10.`,
        );
      } else if (errorIn == 'purchase_order_id' || 'purchase_order_name') {
        throw new BadRequestException(`${errorIn} can not be blank.`);
      }
      throw new InternalServerErrorException();
    }
  }

  async verifyKhaltiPayment(khaltiTransactionResponse: any) {
    try {
      let { pidx, transaction_id, total_amount, status, refunded } =
        khaltiTransactionResponse;
      transaction_id = transaction_id === '' ? null : transaction_id;

      const response = await axios({
        method: 'post',
        url: `${process.env.KHALTI_VERIFICATION_URL}`,
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        data: { pidx },
      });

      const verifiedData = response.data;
      await this.saveKhaltiResponseHistory(verifiedData);

      const {
        pidx: v_pidx,
        total_amount: v_total_amount,
        status: v_status,
        transaction_id: v_transaction_id,
        refunded: v_refunded,
      } = verifiedData;

      if (
        pidx !== v_pidx ||
        transaction_id !== v_transaction_id ||
        +total_amount !== v_total_amount
      )
        throw new ConflictException();

      return verifiedData;
    } catch (error) {
      if (
        [
          'User canceled',
          'Pending',
          'Initiated',
          'Refunded',
          'Expired',
        ].includes(error.response.data.status)
      ) {
        const verifiedData = error.response.data;
        this.saveKhaltiResponseHistory(verifiedData);
        return verifiedData;
      }

      throw new KhaltiTransactionVerificationError();
    }
  }

  async saveKhaltiResponseHistory(verifiedData: any) {
    try {
      const khaltiPayHistoryRepository =
        this.dataSource.getRepository(KhaltiPayHistory);

      const khaltiPayHistoryInstance =
        khaltiPayHistoryRepository.create(verifiedData);

      const newKhaltiPayHistory = await khaltiPayHistoryRepository.save(
        khaltiPayHistoryInstance,
      );
    } catch (error) {
      throw new KhaltiHistorySavingError();
    }
    return;
  }
}
