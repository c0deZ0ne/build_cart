import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SystemRolls } from 'src/modules/auth/types';

export class CreateRoleDto {
  @ApiProperty({
    example: `name must be one of these ${Object.values(
      SystemRolls,
    ).toString()}`,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(SystemRolls)
  name: SystemRolls;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Please provide a dscription of this role' })
  description: string;
}
