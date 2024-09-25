import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateUserProjectDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  UserId: string;

  @ApiProperty({ description: 'Project ID', example: randomUUID() })
  @IsString()
  ProjectId: string;
}
