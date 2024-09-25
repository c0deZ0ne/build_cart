import {
  IsOptional,
  IsDateString,
  IsUUID,
  IsNumber,
  IsString,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { CreateRfqQuoteDto } from 'src/modules/vendor/dto/create-rfq-quote.dto';

export class CreateRfqBargainDTO {
  @ApiProperty({
    description: 'Unique identifier of the project',
    example: randomUUID(),
  })
  @IsUUID()
  ProjectId: string;

  @ApiProperty({
    description: 'Unique identifier of the RFQ quote',
    example: randomUUID(),
  })
  @IsUUID()
  @IsOptional()
  RfqQuoteId: string;

  @ApiProperty({
    description: 'Price in DECIMAL(15, 2)',
    example: 100.0,
  })
  @IsNumber({})
  @IsDefined()
  price: number;

  @ApiProperty({
    description: 'Delivery date in ISO 8601 format',
    example: '2023-10-26T10:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  deliveryDate?: Date;

  @ApiProperty({
    description: 'Description (optional)',
    example: 'This is a description.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string | null;
}

export class VendorAcceptRfqOrBargainDTO extends CreateRfqQuoteDto {
  @ApiProperty({
    description: 'Unique identifier of the project',
    example: randomUUID(),
  })
  @IsUUID()
  ProjectId: string;
}
