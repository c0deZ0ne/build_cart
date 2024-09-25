import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MEMBER_POSITION {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MEMBER = 'MEMBER',
}

export class CreateNewTeamMember {
  @IsString()
  @IsDefined()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  phoneNumber: string;

  @IsString()
  @IsDefined()
  RoleId: string;

  @ApiProperty({ type: String, description: 'Team ID' })
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @ApiProperty({
    type: String,
    description: 'Position within the team (ADMIN, OWNER, SUPER_ADMIN, MEMBER)',
    enum: MEMBER_POSITION,
  })
  @IsNotEmpty()
  @IsEnum(MEMBER_POSITION)
  position: MEMBER_POSITION;
}
