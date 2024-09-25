import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus } from '../models';
import { randomUUID } from 'crypto';
import {
  RfqRequest,
  RfqRequestPaymentTerm,
} from 'src/modules/rfq/models/rfqRequest.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Model } from 'sequelize-typescript';
import { RfqQuote, RfqRequestMaterial } from 'src/modules/rfq/models';
import { DeliverySchedule } from '../models/order-schedule.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the related RFQ request material',
    example: '63b8a39c-4291-4876-87f6-ecc111f4a519',
  })
  @IsNotEmpty()
  rfqRequestMaterialId: string;

  @ApiProperty({
    description: 'ID of the vendor',
    example: 'fa4e6b9d-4b30-4471-a9e1-c8e6d2eb18a8',
  })
  @IsUUID()
  @IsNotEmpty()
  VendorId: string;

  @ApiProperty({
    description: 'ID of the related RFQ quote',
    example: randomUUID(),
  })
  @IsUUID()
  @IsNotEmpty()
  RfqQuoteId: string;

  @ApiProperty({
    description: 'ID of the related RFQ request',
    example: '493565b3-489d-41a3-9d7d-ae6db3734459',
  })
  @IsUUID()
  @IsNotEmpty()
  RfqRequestId: string;

  @ApiProperty({
    description: 'ID of the related project',
    example: randomUUID(),
  })
  @IsUUID()
  @IsNotEmpty()
  ProjectId: string;
}

export class UpdateOrderDto extends CreateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'Order status',
    example: Object.values(OrderStatus).toLocaleString(),
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}

export class GroupedOrdersByVendorDto extends CreateOrderDto {
  status: OrderStatus;
  @ApiProperty()
  PendingOrderCount: number;
}

export interface ModifiedOrderResponse {
  id: string;
  status: OrderStatus;
  rfqRequestMaterialId: string;
  VendorId: string;
  BuilderId: string;
  FundManagerId: string;
  RfqQuoteId: string;
  RfqRequestId: string;
  ProjectId: string;
  CreatedById: string;
  paidAt: Date;
  deliverySchedules: DeliverySchedule[];
  pendingCount?: number;
}
export interface ModifiedBuilderResponse {
  email: string;
  businessName: string;
  businessAddress: string;
  CompanyProjects: Project[];
  owner: Partial<User>;
  builderCompletedProjectsCount: number;
}
export interface DeliveryResponse {
  dueDate: Date;
  quantity: number;
  description: string;
}

export interface IVendor {
  vendorData: Vendor;
  vendorRateScore: number;
  vendorCompletedOrdersCount: number;
}

export interface BidsResponseData {
  id: string;
  title: string;
  status: string;
  totalBudget: number;
  paymentTerm?: RfqRequestPaymentTerm;
  deliveryDate: Date;
  deliveryAddress: string;
  deliveryInstructions?: string;
  createdAt: Date;
  ProjectId: string;
  BuilderId?: string;
  FundManagerId?: string;
  RfqQuotes?: unknown[];
  deliverySchedule: DeliveryResponse[];
  RfqRequestMaterials?: RfqRequestMaterial[];
  Builder?: ModifiedBuilderResponse;
  orders?: ModifiedOrderResponse[];
}
