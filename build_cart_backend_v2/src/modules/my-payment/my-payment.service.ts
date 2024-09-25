import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMyPaymentDto } from './dto/my-payment-create.dto';
import { MyPayment } from './models/myPayments.model';

@Injectable()
export class MyPaymentService {
  constructor(
    @InjectModel(MyPayment)
    private readonly myPayment: typeof MyPayment,
  ) {}

  async create(data: CreateMyPaymentDto): Promise<MyPayment> {
    return this.myPayment.create(data);
  }
}
