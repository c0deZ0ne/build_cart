import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SystemPermissions } from 'src/modules/auth/types';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(SystemPermissions)
  @ApiProperty({ example: SystemPermissions.create })
  name: SystemPermissions;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'This permision grant the ability to create a record in any Resouce it is given to ',
  })
  description: string;
}
