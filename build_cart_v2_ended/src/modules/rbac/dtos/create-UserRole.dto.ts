import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class createUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'RoleId' })
  RoleId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'UserId to assign this role' })
  UserId: string;
}
export class DesignUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'RoleId' })
  userRoleId: string;
}
