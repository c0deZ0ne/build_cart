import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class createRolePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'RoleId' })
  RoleId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'PermissionId' })
  PermissionId: string;
}

export class DeleteRolePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: randomUUID() })
  rolePermissionId: string;
}
