import { Controller, Get, Param, Res } from '@nestjs/common';
import { OpenApiService } from './open-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../blog/blog.service';
import { Response } from 'express';
import * as createCsvWriter from 'csv-writer';
import * as ExcelJS from 'exceljs';
@Controller('open-api')
@ApiTags('open-api')
export class OpenApiController {
  constructor(
    private readonly openApiService: OpenApiService,
    private readonly blogService: BlogService,
  ) {}

  @ApiOperation({
    summary: 'Retrieves CutStruct statistics/open api',
  })
  @Get('statistics')
  async fetchStat() {
    return await this.openApiService.getStats();
  }

  @ApiOperation({
    summary: 'Retrieves all Blogs',
  })
  @Get('blog/all')
  async getAllBlogs() {
    return await this.blogService.getAllBlogs();
  }

  @ApiOperation({
    summary: 'get single Blog by Id',
  })
  @Get('blog/:id')
  async getSingleBlog(@Param('id') blogId: string) {
    return await this.blogService.getSingleBlog(blogId);
  }
  @Get('sample/material/download-csv')
  async downloadCsv(@Res() res: Response) {
    const data = [
      {
        sn: 1,
        materialName: 'Material 1',
        description: 'Description 1',
        category: 'Category 1',
        budget: 100,
      },
      {
        sn: 2,
        materialName: 'Material 2',
        description: 'Description 2',
        category: 'Category 2',
        budget: 150,
      },
      // Add more data as needed
    ];

    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: 'materials.csv',
      header: [
        { id: 'sn', title: 's/n' },
        { id: 'materialName', title: 'Material Name' },
        { id: 'description', title: 'Description' },
        { id: 'category', title: 'Category' },
        { id: 'budget', title: 'Budget' },
      ],
    });

    csvWriter
      .writeRecords(data)
      .then(() => {
        res.download('materials.csv', 'materials.csv');
      })
      .catch((err) => {
        res.status(500).send('Internal Server Error');
      });
  }

  @Get('sample/material/download-excel')
  async downloadExcel(@Res() res: Response) {
    const data = this.openApiService.getMaterialData();

    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Materials');

    // Add data to the worksheet
    worksheet.columns = [
      { header: 's/n', key: 'sn' },
      { header: 'Material Name', key: 'materialName' },
      { header: 'Description', key: 'description' },
      { header: 'Category', key: 'category' },
      { header: 'Budget', key: 'budget' },
    ];

    worksheet.addRows(data);

    // Set up the response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=materials.xlsx');

    // Pipe the workbook directly to the response
    await workbook.xlsx.write(res);
    res.end();
  }
}
