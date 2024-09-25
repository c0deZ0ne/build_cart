import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'praise name' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'User Phone Number', example: '+2348123445678' })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ description: 'Team Member Role', example: 'ADMIN' })
  role: string;
}
