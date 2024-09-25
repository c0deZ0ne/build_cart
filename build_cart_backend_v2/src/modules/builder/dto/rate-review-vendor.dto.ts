import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class RateReviewVendorDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 5 })
  onTimeDelivery: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 5 })
  defectControl: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 5 })
  effectiveCommunication: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 5 })
  specificationAccuracy: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: `Great vendor! Highly recommended.` })
  review: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ApiProperty({
    example: [`https://picsum.photos/200/300`, `https://picsum.photos/200/300`],
  })
  deliveryPictures: string[];
}

export class RateReviewBuilderDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 5, maximum: 5 })
  rateScore: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: `Great builder! Highly recommended.` })
  review: string;
}
