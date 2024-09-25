import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class superAdminCreateFundManageProjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1a450751-bb39-4b00-9c39-e508a6a23e46' })
  builderId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'project description' })
  description: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: new Date(), required: true })
  title: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'project image url' })
  image: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'project image file name' })
  fileName: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'project location' })
  location: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'message for the invitee' })
  message: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'invitee email address' })
  inviteeEmail: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: new Date(), required: true })
  startDate: Date;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: new Date(), required: true })
  endDate: Date;
}
