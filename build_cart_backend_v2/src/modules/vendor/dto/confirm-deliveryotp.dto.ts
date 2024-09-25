import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class ConfirmDeliveryDto {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  @IsDefined()
  orderId: string;
}
