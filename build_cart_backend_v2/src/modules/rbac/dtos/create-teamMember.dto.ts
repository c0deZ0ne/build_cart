import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsUUID,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MEMBER_POSITION {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MEMBER = 'MEMBER',
}

export class CreateTeamMemberDto {
  @ApiProperty({ type: String, description: 'Team ID' })
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @ApiProperty({ type: String, description: 'User ID' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Position within the team (ADMIN, OWNER, SUPER_ADMIN, MEMBER)',
    enum: MEMBER_POSITION,
  })
  @IsNotEmpty()
  @IsEnum(MEMBER_POSITION)
  position: MEMBER_POSITION;

  @ApiProperty({ type: String, description: 'Created By User ID' })
  @IsUUID()
  createdById?: string;
}
