import { Injectable, InternalServerErrorException } from '@nestjs/common';
const CryptoJS = require('crypto-js');
import axios from 'axios';
import { EsewaPaymentInitiateInterface } from 'src/common/interfaces/payment-initiate.interface';
import { DataSource } from 'typeorm';
import { EsewaPaymentHistory } from './entities/esewa-response-history.entity';
import {
  EsewaPaymentHistorySavingException,
  EsewaPaymentVerificationException,
  EsewaServiceUnavailableException,
  EsewaSignatureMismatchException,
} from 'src/common/errors/esewa-payment-gateway.errors';

@Injectable()
export class EsewaService {
  constructor(private readonly dataSource: DataSource) {}
  async getEsewaInitiationSignature(
    esewaInitData: EsewaPaymentInitiateInterface,
  ) {
    const { total_amount, transaction_uuid, product_code } = esewaInitData;
    const signatureInput = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = await this.generateEsewaSignature(signatureInput);
    return signature;
  }

  async generateEsewaSignature(signatureInput: string) {
    try {
      const esewaSecretKey = process.env.ESEWA_SECRET_KEY;
      const hash = CryptoJS.HmacSHA256(signatureInput, esewaSecretKey);
      const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
      return hashInBase64;
    } catch (error) {
      throw new InternalServerErrorException(
        'Could not initiate esewa payment: error while generating esewa signature.',
      );
    }
  }

  async verifyEsewaPayment(esewaTransactionResponse: string) {
    try {
      const decodedResponse = atob(esewaTransactionResponse);
      const decodedData = await JSON.parse(decodedResponse);

      const message = decodedData.signed_field_names
        .split(',')
        .map((signedName: string) => {
          let value = decodedData[signedName];
          if (signedName === 'total_amount' && typeof value === 'string') {
            value = value.replace(/,/g, '');
          }
          return `${signedName}=${value}`;
        })
        .join(',');
      const signature = await this.generateEsewaSignature(message);

      if (signature !== decodedData.signature)
        throw new EsewaSignatureMismatchException(`Signatures did not match.`);

      const [decodedTotalAmount, decodedProductCode, decodedTransactionUUID] = [
        typeof decodedData.total_amount === 'string'
          ? decodedData.total_amount.replace(/,/g, '')
          : decodedData.total_amount,
        decodedData.product_code,
        decodedData.transaction_uuid,
      ];

      const verifiedResponse = await axios({
        method: 'GET',
        url: `${process.env.ESEWA_VERIFICATION_URL}?product_code=${decodedProductCode}&total_amount=${decodedTotalAmount}&transaction_uuid=${decodedTransactionUUID}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const verifiedData = verifiedResponse.data;
      if (Object.keys(verifiedData).includes('code'))
        throw new EsewaServiceUnavailableException(
          `Esewa service is currently unavailable. Try again later!`,
        );

      await this.saveEsewaResponseHistory(verifiedData);

      return verifiedResponse.data;
    } catch (error) {
      if (
        error instanceof EsewaSignatureMismatchException ||
        error instanceof EsewaServiceUnavailableException ||
        error instanceof EsewaPaymentHistorySavingException
      )
        throw error;
      throw new EsewaPaymentVerificationException(
        `Error while verifying esewa payment.`,
      );
    }
  }

  async saveEsewaResponseHistory(verifiedData: any) {
    try {
      const esewaPaymentHistoryReposistory =
        this.dataSource.getRepository(EsewaPaymentHistory);

      const esewaPaymentHistoryInstance =
        esewaPaymentHistoryReposistory.create(verifiedData);

      const newEsewaPaymentHistory = await esewaPaymentHistoryReposistory.save(
        esewaPaymentHistoryInstance,
      );
    } catch (error) {
      console.log(error);
      throw new EsewaPaymentHistorySavingException(
        `Error while saving esewa payment data.`,
      );
    }
    return;
  }
}
