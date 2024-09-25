import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Resources } from 'src/modules/auth/types';

export class CreateResourcesAccessDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(Resources)
  @ApiProperty({
    example: `the resources name must be one of the following eg ${Object.values(
      Resources,
    )}`,
  })
  name: Resources;
}
