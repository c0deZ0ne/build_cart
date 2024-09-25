import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class BuilderShareProjectDto {
  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  @ApiProperty({ example: 'fundManager@cutstruct.com' })
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  ProjectId: string;
}
