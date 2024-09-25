import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class adminShareProjectDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'fundManager@cutstruct.com' })
  fromEmail: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'builder@cutruct.com' })
  toEmail: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: '178282d8-8e28-4935-84aa-803bbcf4d273' })
  ProjectId: string;
}
