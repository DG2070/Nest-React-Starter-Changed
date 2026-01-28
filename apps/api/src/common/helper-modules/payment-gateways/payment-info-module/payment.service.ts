import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { Payment } from './entities/payment.entity';
import { DataSource, EntityManager } from 'typeorm';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { PaymentGateway } from './enums/payment-gateway.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { generatePaymentUUID } from './helper-functions/generate-payment-uuid';
import { EsewaService } from 'src/common/helper-modules/payment-gateways/esewa.service';
import { EsewaPaymentInitiateInterface } from 'src/common/interfaces/payment-initiate.interface';
import { ConfigService } from '@nestjs/config';
import { KhaltiPayService } from 'src/common/helper-modules/payment-gateways/khalti-pay.service';
import {
  KhaltiHistorySavingError,
  KhaltiTransactionVerificationError,
} from 'src/common/errors/khalti-payment-gateway.errors';
import {
  EsewaPaymentHistorySavingException,
  EsewaPaymentVerificationException,
  EsewaServiceUnavailableException,
  EsewaSignatureMismatchException,
  UpdatingPaymentAfterVerificationException,
} from 'src/common/errors/esewa-payment-gateway.errors';

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly esewaService: EsewaService,
    private readonly configService: ConfigService,
    private readonly khaltiPayService: KhaltiPayService,
  ) {}
  async getEsewaInitiationData(initiatePaymentDto: InitiatePaymentDto) {
    const { amount } = initiatePaymentDto;
    let newPayment: Payment | undefined;
    const [result, error] = await safeError(
      runInTransaction(this.dataSource, async (manager: EntityManager) => {
        const transactionUuid = generatePaymentUUID();
        const paymentInstance = Object.assign(new Payment(), {
          transactionUuid,
          ...initiatePaymentDto,
          gateway: PaymentGateway.ESEWA,
          status: PaymentStatus.PENDING,
        });

        const payment = manager.create(Payment, paymentInstance);
        newPayment = await manager.save(Payment, payment);

        const totalAmount = amount; //this total amount should be calculated differently when tax amount, service charge, and other charges are available

        const signatureData: EsewaPaymentInitiateInterface = {
          total_amount: totalAmount,
          transaction_uuid: transactionUuid,
          product_code: process.env.ESEWA_SERVICE_PRODUCT_CODE!, //this should be available from the frontend, should be adjusted accordingly
        };
        const esewaInitiationSignature =
          await this.esewaService.getEsewaInitiationSignature(signatureData);

        const esewaFormData = {
          amount: amount,
          tax_amount: 0,
          product_service_charge: 0,
          product_delivery_charge: 0,
          product_code: process.env.ESEWA_SERVICE_PRODUCT_CODE!,
          total_amount: totalAmount,
          transaction_uuid: transactionUuid,
          success_url: this.configService.get('ESEWA_SUCCESS_URL'),
          failure_url: this.configService.get('ESEWA_FAILURE_URL'),
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature: esewaInitiationSignature,
        };

        newPayment.status = PaymentStatus.INITIATED;
        const updatedNewPayment = await manager.save(Payment, newPayment);
        return esewaFormData;
      }),
    );

    if (error) {
      throw error;
    }

    return result;
  }

  async verifyEsewaPayment(esewaTransactionResponse: string) {
    try {
      const verifiedData = await this.esewaService.verifyEsewaPayment(
        esewaTransactionResponse,
      );

      const paymentRepository = this.dataSource.getRepository(Payment);
      const existingPayment = await paymentRepository.findOne({
        where: { transactionUuid: verifiedData.transaction_uuid },
      });

      if (!existingPayment)
        throw new NotFoundException(
          `Payment not found - has not been initiated.`,
        );

      let updateStatus: PaymentStatus = PaymentStatus.COMPLETED;

      switch (verifiedData.status) {
        case 'COMPLETE':
          updateStatus = PaymentStatus.COMPLETED;
          break;
        case 'PENDING':
          updateStatus = PaymentStatus.PENDING;
          break;
        case 'FULL_REFUND':
          updateStatus = PaymentStatus.FULL_REFUND;
          break;
        case 'PARTIAL_REFUND':
          updateStatus = PaymentStatus.PARTIAL_REFUND;
          break;
        case 'AMBIGUOUS':
          updateStatus = PaymentStatus.AMBIGUOUS;
          break;
        case 'NOT_FOUND':
          updateStatus = PaymentStatus.NOT_FOUND;
          break;
        case 'CANCELED':
          updateStatus = PaymentStatus.CANCELED;
          break;
        default:
          updateStatus = PaymentStatus.COMPLETED;
      }

      existingPayment.status = updateStatus;

      const updatedPayment = await paymentRepository.save(existingPayment);
      return verifiedData.status;
    } catch (error) {
      if (
        error instanceof EsewaSignatureMismatchException ||
        error instanceof EsewaServiceUnavailableException ||
        error instanceof EsewaPaymentHistorySavingException ||
        error instanceof EsewaPaymentVerificationException
      )
        throw error;
      throw new UpdatingPaymentAfterVerificationException(
        `Error while updating payment after esewa verification.`,
      );
    }
  }

  async initiateKhaltiPay(initiatePaymentDto: InitiatePaymentDto) {
    let newPayment: Payment | undefined;
    const paymentRepository = this.dataSource.getRepository(Payment);
    const [result, error] = await safeError(
      runInTransaction(this.dataSource, async (manager: EntityManager) => {
        const transactionUuid = generatePaymentUUID();

        //product code should be received from frontend
        const purchase_order_name = 'something special';

        const paymentInstance = Object.assign(new Payment(), {
          transactionUuid,
          ...initiatePaymentDto,
          productCode: 'something special',
          gateway: PaymentGateway.KHALTI,
          status: PaymentStatus.PENDING,
        });

        const payment = manager.create(Payment, paymentInstance);
        newPayment = await manager.save(Payment, payment);

        const khaltiPayInitData = {
          amount: initiatePaymentDto.amount * 100,
          purchase_order_id: transactionUuid,
          purchase_order_name: 'something special',
        };
        return { newPayment, khaltiPayInitData };
      }),
    );
    if (error) {
      throw error;
    }

    const [response, _error] = await safeError(
      this.khaltiPayService.initiate(result.khaltiPayInitData),
    );

    if (_error) {
      if (_error instanceof BadGatewayException)
        throw new BadGatewayException(_error.message);
      else if (_error instanceof BadRequestException)
        throw new BadRequestException(_error.message);
      else
        throw new InternalServerErrorException(
          `Error while initiating khalti payment.`,
        );
    }

    if (!result.newPayment) {
      throw new InternalServerErrorException('Payment initialization failed.');
    }

    result.newPayment.status = PaymentStatus.INITIATED;
    await paymentRepository.save(result.newPayment);
    return response;
  }

  async verifyKhaltiPay(khaltiTransactionResponse: any) {
    try {
      const verifiedData = await this.khaltiPayService.verifyKhaltiPayment(
        khaltiTransactionResponse,
      );
      let status: PaymentStatus;
      if (verifiedData.status == 'User canceled')
        status = PaymentStatus.CANCELED;
      else status = PaymentStatus.COMPLETED;

      const paymentRepository = this.dataSource.getRepository(Payment);

      const existingPayment = await paymentRepository.findOne({
        where: {
          transactionUuid: khaltiTransactionResponse.purchase_order_id,
        },
      });

      if (!existingPayment) throw new NotFoundException();

      existingPayment.status = status;
      await paymentRepository.save(existingPayment);

      return verifiedData.status;
    } catch (error) {
      if (error instanceof ConflictException)
        throw new ConflictException(
          `Incomming informations and verification information from khalti mismatch.`,
        );
      else if (error instanceof KhaltiHistorySavingError)
        throw new InternalServerErrorException(
          `Error while saving khalti payment history.`,
        );
      else if (error instanceof KhaltiTransactionVerificationError)
        throw new InternalServerErrorException(
          `Error while verifying khalti transaction.`,
        );
      else if (error instanceof NotFoundException)
        throw new NotFoundException(
          `Payment not found - has not been initiated.`,
        );
      else
        throw new InternalServerErrorException(
          `Error while saving khalti payment.`,
        );
    }
  }
}
