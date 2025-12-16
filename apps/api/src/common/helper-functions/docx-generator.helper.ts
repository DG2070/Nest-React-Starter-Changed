import { Injectable } from '@nestjs/common';
import { Document, Packer } from 'docx';
import { Response } from 'express';
@Injectable()
export class DocxGeneratorService {
  constructor() {}

  async generateDocx(
    res: Response,
    Document_Content: Document,
    fileName: string,
  ) {
    const doc = Document_Content;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const buffer = await Packer.toBuffer(doc);

    res.send(buffer);
  }
}

//usage

//controller
// @Get(":id/minute-as-docx")
// async getMinuteAsDocx(@Res() res: Response, @Param("id") id: string) {
//   const minuteData = await this.meetingService.getMinuteAsDocx(+id); // this will give a required object for the docx generation

//   return await this.docxGeneratorService.generateDocx(
//     res,
//     await generateMinuteDocument(minuteData),
//     "meeting-minute.docx" //give docx file a name
//   );
// }
