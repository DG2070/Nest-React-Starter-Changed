import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentService } from './payment.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/esewa')
  async getEsewaInitiationData(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return await this.paymentService.getEsewaInitiationData(initiatePaymentDto);
  }

  @Get('/esewa-callback')
  async verify(@Query('data') esewaTransactionResponse: string) {
    const paymentStatus = await this.paymentService.verifyEsewaPayment(
      esewaTransactionResponse,
    );

    let redirectUrl = 'http://localhost:3001/payment/esewa/complete';

    switch (paymentStatus) {
      case 'PENDING':
        redirectUrl = 'http://localhost:3001/payment/esewa/pending';
        break;
      case 'COMPLETE':
        redirectUrl = 'http://localhost:3001/payment/esewa/complete';
        break;
      case 'FULL_REFUND':
        redirectUrl = 'http://localhost:3001/payment/esewa/full-refund';
        break;
      case 'PARTIAL_REFUND':
        redirectUrl = 'http://localhost:3001/payment/esewa/partial-refund';
        break;
      case 'AMBIGUOUS':
        redirectUrl = 'http://localhost:3001/payment/esewa/ambiguous';
        break;
      case 'NOT_FOUND':
        redirectUrl = 'http://localhost:3001/payment/esewa/not-found';
        break;
      case 'CANCELED':
        redirectUrl = 'http://localhost:3001/payment/esewa/canceled';
        break;
      default:
        redirectUrl = 'http://localhost:3001/payment/esewa/complete';
        break;
    }

    return { url: redirectUrl, statusCode: 302 };
  }

  @Post('/khalti-pay')
  initiateKhaltiPay(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.paymentService.initiateKhaltiPay(initiatePaymentDto);
  }

  @Get('/khalti-callback')
  async verifyKhaltiPayment(@Query() khaltiTransactionResponse: any) {
    const result = await this.paymentService.verifyKhaltiPay(
      khaltiTransactionResponse,
    );

    let redirectUrl = 'http://localhost:3001/payment/khalti/success';

    switch (result.status) {
      case 'Pending':
        redirectUrl = 'http://localhost:3001/payment/khalti/pending';
        break;
      case 'Initiated':
        redirectUrl = 'http://localhost:3001/payment/khalti/initiated';
        break;
      case 'Refunded':
        redirectUrl = 'http://localhost:3001/payment/khalti/refunded';
        break;
      case 'Expired':
        redirectUrl = 'http://localhost:3001/payment/khalti/expired';
        break;
      case 'User canceled':
        redirectUrl = 'http://localhost:3001/payment/khalti/cancelled';
        break;
      default:
        redirectUrl = 'http://localhost:3001/payment/khalti/success';
        break;
    }

    return { url: redirectUrl, statusCode: 302 };
  }
}
