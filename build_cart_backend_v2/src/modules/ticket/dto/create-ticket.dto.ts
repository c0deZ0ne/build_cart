import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Unable to see vendors' })
  subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'I am unable to request for quote on the platform' })
  message: string;
}
