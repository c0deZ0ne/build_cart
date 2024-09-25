import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';
import { Bank } from './models/bank.model';
import { HttpService } from '@nestjs/axios';
import { ResolveAccountDto } from './dto/resolve-account.dto';
import { CreateBankAccountDto } from 'src/modules/vendor/dto/create-bank-account.dto';
import { Op } from 'sequelize';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export interface IBank {
  name: string;
  slug: string;
  code: string;
}

@Injectable()
export class BankService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Bank)
    private readonly bankModel: typeof Bank,
    private readonly configService: ConfigService,
  ) {}

  async getAllBanks(): Promise<IBank[]> {
    const {
      data: { data: banks },
    } = await lastValueFrom(this.httpService.get<{ data: IBank[] }>('bank'));
    return banks.map(({ name, slug, code }) => ({ name, slug, code }));
  }

  async resolveBank({ accountNumber, bankCode }) {
    try {
      const { data } = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${await this.configService.get(
              'PAYSTACK_SECRET',
            )}`,
          },
        },
      );
      return data.data;
    } catch (error) {
      if (error.response.data.status == false) {
        throw new BadRequestException('Invalid Bank details Provided ');
      }
      throw new BadRequestException(
        'We could not verify your account details ',
      );
    }
  }

  async checkBankAccountExist(accountNumber: string, vendorId: string) {
    const bankAccount = await this.bankModel.findOne({
      where: { accountNumber, VendorId: vendorId },
    });
    if (bankAccount) {
      throw new BadRequestException('bank account already exist');
    }
  }

  async checkBuilderBankAccountExist(accountNumber: string, builderId: string) {
    const bankAccount = await this.bankModel.findOne({
      where: { accountNumber, BuilderId: builderId },
    });
    if (bankAccount) {
      throw new BadRequestException('bank account already exist');
    }
  }

  async upsertBankAccountForBuilder(
    createBankAccountDto: CreateBankAccountDto,
    userId: string,
    builderId: string,
  ) {
    if (!builderId) {
      throw new BadRequestException('builderId cannot be empty.');
    }
    const data = await this.checkBuilderBankAccountExist(
      createBankAccountDto.accountNumber,
      builderId,
    );
    const { account_name } = await this.resolveBank(createBankAccountDto);
    await this.bankModel.upsert({
      BuilderId: builderId,
      accountName: account_name,
      accountNumber: createBankAccountDto.accountNumber,
      bankName: createBankAccountDto.bankName,
      bankCode: createBankAccountDto.bankCode,
      bankSlug: createBankAccountDto.bankSlug,
      UpdatedById: userId,
    });
    return data;
  }

  async getBuilderBankDetails(builderId: string) {
    return await this.bankModel.findOne({
      where: { BuilderId: builderId },
    });
  }

  async upsertBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    userId: string,
    vendorId: string,
  ) {
    if (!vendorId) {
      throw new BadRequestException('VendorId cannot be empty.');
    }
    const { account_name } = await this.resolveBank(createBankAccountDto);
    try {
      const result = await this.bankModel.upsert({
        accountName: account_name,
        VendorId: vendorId,
        accountNumber: createBankAccountDto.accountNumber,
        bankName: createBankAccountDto.bankName,
        bankCode: createBankAccountDto.bankCode,
        bankSlug: createBankAccountDto.bankSlug,
        UpdatedById: userId,
      });
      return result[0];
    } catch (e) {
      throw new BadRequestException(
        'Please confirm the Account number has not been used before',
      );
    }
  }

  async getBankDetails(vendorId: string) {
    const bankData = await this.bankModel.findOne({
      where: { VendorId: vendorId },
    });
    if (!bankData)
      throw new BadRequestException('Please update your bank details');
    return bankData;
  }
}
