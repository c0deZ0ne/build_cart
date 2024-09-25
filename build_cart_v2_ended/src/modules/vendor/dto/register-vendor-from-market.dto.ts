import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterVendorFromMarketDto {
  @IsEmail()
  @IsNotEmpty({ message: 'please email is required ' })
  @ApiProperty({ example: 'john_doe@mailer.com' })
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Please Provide a business name ' })
  @ApiProperty({ example: 'Johnson and Sons' })
  businessName?: string;

  @IsString()
  @IsNotEmpty({ message: 'please password is required ' })
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ example: 'password123456' })
  password?: string;
}

export interface OrdersResponse {
  orders: unknown[];
  totalLength: number;
  pendingCount?: number;
  contractPaymentStatus?: string;
}
