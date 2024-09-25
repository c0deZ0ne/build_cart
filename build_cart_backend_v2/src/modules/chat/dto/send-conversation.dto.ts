import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class SendConversationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Good Evening' })
  text: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ApiProperty({
    example: [`https://picsum.photos/200/300`, `https://picsum.photos/200/300`],
  })
  images?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: '6d0493bd-0d15-40d6-931b-6036f18474e1' })
  repliedConversationId?: string;
}
export class startChartDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Good Evening' })
  text: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ApiProperty({
    example: [`https://picsum.photos/200/300`, `https://picsum.photos/200/300`],
  })
  images?: string[];
}
