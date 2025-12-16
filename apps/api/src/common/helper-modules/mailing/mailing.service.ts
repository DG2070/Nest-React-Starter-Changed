import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    incommingHtml: string,
    context: Record<string, any>,
    attachments?: {
      filename: string;
      path?: string;
      content?: Buffer;
      contentType?: string;
    }[],
  ) {
    let finalizedHTML = incommingHtml;
    Object.keys(context).forEach((key) => {
      const placeholder = new RegExp(`{{{\\s*${key}\\s*}}}`, 'g');
      finalizedHTML = finalizedHTML.replace(placeholder, context[key]);
    });

    await this.mailerService.sendMail({
      to,
      subject,
      html: finalizedHTML,
      attachments: attachments ?? [],
    });
  }
}

//calling function example
// for (let i = 0; i < 50; i++) {
//   await this.emailService.sendMail(
//     `pratikchalise808@gmail.com`,
//     `it a test from Dinesh`,
//     helloTemplate,
//     { name: `Dinesh` },
//   );
// }

//sending the file through the mail

//     const [_, error] = await safeError(
//       this.emailService.sendMail(
//         quotation.email,
//         'Re : Cleaning Quotation Request',
//         sendQuotation,
//         {
//           customerName: quotation.customerName,
//           id: quotation.id,
//           validUntil: quotation.formattedValidUntil,
//           totalDiscount: quotation.totalDiscount,
//           payableAmount: quotation.totalAmount,
//         },
//         [
//           {
//             filename: `EliteSpark-Cleaning-#${quotation.id}`,
//             content: pdfBuffer,
//             contentType: 'application/pdf',
//           },
//         ],
//       ),
//     );
//     if (error)
//       throw new InternalServerErrorException(
//         `Error sending email to the customer. Try again.`,
//       );
//     return res.status(200).json({
//       success: true,
//       message: `Email successfully sent to the customer.`,
//     });
