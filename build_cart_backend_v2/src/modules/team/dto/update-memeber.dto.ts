import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User Phone Number', example: '+2348123445678' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Team Member Role', example: 'ADMIN' })
  role: string;
}
