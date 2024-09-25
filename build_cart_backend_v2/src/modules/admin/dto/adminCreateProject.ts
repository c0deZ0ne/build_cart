import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminCreateProject {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'fundManager@cutstruct.com' })
  fundManagerEmail: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'builder@cutstruct.com' })
  customerEmail: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'admin shared this project ' })
  title: string;

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 200000 })
  budgetAmount: number;
}
