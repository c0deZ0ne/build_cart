import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Message for the notification',
    example: 'New message with CTAs',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'notification logo',
    example: 'https://logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo: string;

  @ApiProperty({
    description: 'Array of CTAs for the notification',
    type: [Object],
    required: false,
    example: [{ label: 'Click Me!', url: '/dashboard' }],
  })
  @IsArray()
  ctas: { label: string; url: string }[];
}

export class SearchNotificationDto {
  @ApiProperty({
    description: 'Search query for notifications',
    example: 'important',
  })
  @IsString()
  query: string;
}
