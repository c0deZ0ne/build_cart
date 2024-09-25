import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { RfqUploadTypeBody } from './type/rfq-upload-material';
import { Response } from 'express';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('materialSchedule'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV or Excel file to upload',
    type: UploadFileDto,
  })
  async uploadFile(@UploadedFile() file: any, @Body() body: RfqUploadTypeBody) {
    return await this.materialService.uploadFile(file, body);
  }


  @Get('download-rfq-excel-sample')
  downloadExcel(@Res() res: Response): void {
    const filePath = this.materialService.getExcelFilePath();
    const fileStream = this.materialService.getExcelFileStream(filePath);
    res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    fileStream.pipe(res);
  }
}
