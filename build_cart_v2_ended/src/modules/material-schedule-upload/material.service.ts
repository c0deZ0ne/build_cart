import { BadRequestException, Injectable } from '@nestjs/common';
import { RfqUploadType, RfqUploadTypeBody } from './type/rfq-upload-material';
import { InjectModel } from '@nestjs/sequelize';
import { MaterialSchedule } from './models/material-schedule.model';
import { UserUploadMaterial } from './models/material.model';
import { randomUUID } from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import * as csvParse from 'csv-parse';
import * as exceljs from 'exceljs';
import { User } from '../user/models/user.model';
import { WhereOptions, Op } from 'sequelize';
import { Project, ProjectStatus } from '../project/models/project.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(MaterialSchedule)
    private readonly materialScheduleModel: typeof MaterialSchedule,
    @InjectModel(UserUploadMaterial)
    private readonly userUploadMaterial: typeof UserUploadMaterial,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    private readonly sequelize: Sequelize,
  ) {}
  getMaterialData() {
    return [
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
    ];

    
  }

  async processUploadedData({
    data,
    body,
  }: {
    data: RfqUploadType[];
    body: RfqUploadTypeBody;
  }): Promise<UserUploadMaterial[]> {
    const { title, csvUrl, ownerId, ProjectId } = body;
    const dbTransaction = await this.sequelize.transaction();
    try {
      const projectData = await this.projectModel.findByPkOrThrow(
        body.ProjectId,
      );
      const matSchedule = await this.materialScheduleModel.create(
        {
          title,
          csvUrl,
          ownerId,
          ProjectId,
        },
        { transaction: dbTransaction },
      );

      projectData.status = ProjectStatus.ACTIVE;
      await projectData.save({ transaction: dbTransaction });
      const attachedMatId = data.map((d) => {
        return {
          ...d,
          materialScheduleId: matSchedule.id,
          ownerId: matSchedule.ownerId,
        };
      });

      const bulkMat = await this.userUploadMaterial.bulkCreate(attachedMatId, {
        ignoreDuplicates: true,
        transaction: dbTransaction,
      });
      await dbTransaction.commit();
      return bulkMat;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadFile(file: any, body: RfqUploadTypeBody) {
    if (!file) {
      return { success: false, message: 'No file uploaded' };
    }

    try {
      let data: RfqUploadType[] = [];
      if (file.mimetype === 'text/csv') {
        const myData = await this.parseCsv(file.buffer);
        data = myData.map((d: any) => {
          const proc: RfqUploadType = {
            category: d['Category'],
            name: d['Material Name'],
            budget: d['Budget'],
            description: d['Description'],
            ownerId: body.ownerId,
          };
          return proc;
        });
      } else if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const rawData = await this.parseExcel(file.buffer);
        const header = rawData.splice(0, 1)[0];
        data = rawData.map((mat) => {
          const d: RfqUploadType = {
            name: '',
            category: ' ',
            budget: 0,
            description: '',
            id: randomUUID(),
            ownerId: '',
          };
          d.name = mat[1];
          d.description = mat[2];
          d.category = mat[3];
          d.budget = mat[4];
          return d;
        });
      } else {
        return { success: false, message: 'Unsupported file type' };
      }

      await this.processUploadedData({ data, body });

      return {
        success: true,
        message: 'File uploaded and processed successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async parseCsv(fileBuffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      csvParse.parse(fileBuffer.toString(), { columns: true }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private async parseExcel(fileBuffer: Buffer): Promise<unknown[]> {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];

    const data = worksheet
      .getSheetValues()
      .filter(
        (r: Array<any>) =>
          r.length > 0 && r.some((cell) => cell !== null && cell !== undefined),
      );
    return data.map((cur: Array<any>) => {
      return cur.splice(1);
    });
  }

  async getProjectMaterialSchedule({
    user,
    projectId,
    search,
  }: {
    user: User;
    projectId: string;
    search?: string;
  }) {
    const whereOptions: WhereOptions<MaterialSchedule> = {
      ProjectId: projectId,
      ownerId: user.id,
    };

    const subOption: WhereOptions<MaterialSchedule> = {};
    if (search) {
      subOption[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ];
    }

    return await this.materialScheduleModel.findAll({
      where: whereOptions,
      include: [
        {
          model: UserUploadMaterial,
          where: subOption,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
  getExcelFilePath(): string {
    return path.resolve("./material_schedule _sample.xlsx");
  }

  getExcelFileStream(filePath: string): fs.ReadStream {
    return fs.createReadStream(filePath);
  }
}
