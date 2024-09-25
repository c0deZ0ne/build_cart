import { IsArray, ValidateNested } from 'class-validator';
import { RfqRequestPaymentTerm } from 'src/modules/rfq/models';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { OrderStatus } from 'src/modules/order/models';
export class DeliveryScheduleOrderDto {
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: OrderStatus.PENDING })
  status: string;

  @ApiProperty({ example: 2000 })
  quantity: number;

  @ApiProperty({ example: '2000 bags of cement to site 2' })
  description: string;

  @ApiProperty({ example: new Date() })
  deliveryDate: Date;
}
export class BuilderRfqOrderDto {
  @ApiProperty({ example: 'Cement' })
  rfqMaterialName: string;

  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: 'Accessory' })
  category: string;

  @ApiProperty({ example: 2000 })
  totalQuantity: number;

  @ApiProperty({ example: 'Bags' })
  metric: string;

  @ApiProperty({ example: 20000 })
  budget: number;

  @ApiProperty({ example: 'B12 Unilever estate ' })
  deliveryAddress: string;

  @ApiProperty({ example: new Date() })
  estimatedDeliveryDate: Date;

  @ApiProperty({ example: 10 })
  ongoing: number;

  @ApiProperty({ example: 2 })
  completed: number;

  @ApiProperty({ example: RfqRequestPaymentTerm.ESCROW })
  paymentType: RfqRequestPaymentTerm;

  @ApiProperty({ example: 19000 })
  totalCost: number;

  @ApiProperty({ type: [DeliveryScheduleOrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryScheduleOrderDto)
  deliverySchedule_Orders: DeliveryScheduleOrderDto[];
}
