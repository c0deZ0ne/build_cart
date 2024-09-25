import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class InviteBuilderDto {
  @ApiProperty({
    description: 'Builder name',
    example: 'Adewale Johnson',
  })
  @IsString()
  buyerName: string;

  @ApiProperty({ description: 'Builder email', example: 'donald@gmail.com' })
  @IsString()
  @IsEmail()
  buyerEmail: string;

  @ApiProperty({ description: 'Builder phone', example: '+2345505049303' })
  @IsString()
  @IsOptional()
  buyerPhone: string;
}
