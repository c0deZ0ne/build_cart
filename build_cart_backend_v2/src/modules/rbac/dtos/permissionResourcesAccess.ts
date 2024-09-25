import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class createPermissionResourcesAccess {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: randomUUID() })
  PermissionId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: randomUUID() })
  ResourceId: string;
}
