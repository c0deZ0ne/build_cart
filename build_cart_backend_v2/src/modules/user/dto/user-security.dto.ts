// security-update.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsString, IsObject } from 'class-validator';

export class SecurityUpdateDTO {
  @ApiProperty({
    example: true,
    description: 'Enable or disable two-factor authentication.',
  })
  @IsBoolean()
  twoFactorAuthEnabled: boolean;

  @ApiProperty({
    example: [
      { date: new Date(), link: 'https://example.com/signature1' },
      { date: new Date(), link: 'https://example.com/signature2' },
    ],
    description: 'Array of signature links.',
  })
  @IsArray()
  @IsObject({ each: true })
  signatures: string[];

  @ApiProperty({
    example: true,
    description: 'Enable or disable email notifications.',
  })
  @IsBoolean()
  emailNotificationEnabled: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable or disable SMS notifications.',
  })
  @IsBoolean()
  smsNotificationEnabled: boolean;
}
