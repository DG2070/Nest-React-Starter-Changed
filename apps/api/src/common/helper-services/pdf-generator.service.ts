import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfGeneratorService {
  constructor() {
    handlebars.registerHelper('multiply', (a: number, b: number) => {
      if (!a || !b) return '0.00';
      return (a * b).toFixed(2);
    });

    handlebars.registerHelper('inc', (value: number) => {
      return parseInt(value as any, 10) + 1;
    });

    handlebars.registerHelper('inc', (value: number) => {
      return parseInt(value as any, 10) + 1;
    });
  }

  private async compileTemplate(
    templatePath: string,
    data: any,
  ): Promise<string> {
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);
    return template(data);
  }

  async generatePdf(
    templateRelativePath: string,
    data: any,
    options: {
      format?: puppeteer.PaperFormat;
      margin?: puppeteer.PDFOptions['margin'];
    } = {},
  ): Promise<Buffer> {
    const templatePath = path.join(
      process.cwd(),
      `src/${templateRelativePath}`,
    );
    const html = await this.compileTemplate(templatePath, data);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: options.format || 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}

//How do i use this?  --with the hbs file
// @Auth(AuthType.None)
// @Get(':id/quotation-pdf')
// async getPdf(
//   @Param('id') id: string,
//   @Res() res: Response,
// ) {
//   const quotation = await this.quotationService.getQuotationPdfData(+id);

//   const templatePath = 'quotation/templates/quotation-template.hbs';
//   const pdfBuffer = await this.pdfGeneratorService.generatePdf(
//     templatePath,
//     quotation,
//   );

//   res.set({
//     'Content-Type': 'application/pdf',
//     'Content-Disposition': `attachment; filename=quotation-${id}.pdf`,
//     'Content-Length': pdfBuffer.length,
//   });

//   res.end(pdfBuffer);
// }
