import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class InvitationDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'vendor damy' })
  toName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'joshua@vendor.com' })
  toEmail: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lagos Nigeria' })
  Location?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Hi ade, Im inviting you to ....' })
  message: string;
}
export class PlatformInvitation extends InvitationDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'fundManager brian' })
  inviteeName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'fundManager brian' })
  invitationId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'fundManager brian' })
  projectId?: string;
}

export class FundmanagerPlatformInvitation extends PlatformInvitation {
  @ApiProperty({ example: '+234 000 000 0000' })
  @IsString()
  @IsOptional()
  phoneNumber: string | null;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: '52cefa55-5371-4e61-a501-4d7ccf67c8f2',
  })
  projectId: string;
}

export class ISendPlatformInvitation extends PlatformInvitation {
  invitationId: string;
}

export class ICreateInvitationDto {
  toEmail: string;
  message: string;
  toName: string;
}

export class BuilderPlatformInvitation extends InvitationDto {
  @ApiProperty({ example: '+234 000 000 0000' })
  @IsString()
  @IsOptional()
  phoneNumber: string | null;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: '52cefa55-5371-4e61-a501-4d7ccf67c8f2',
  })
  projectId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'fundManager brian' })
  inviteeName: string;
}

export class BuilderInvitation extends BuilderPlatformInvitation {
  invitationId: string;
}
