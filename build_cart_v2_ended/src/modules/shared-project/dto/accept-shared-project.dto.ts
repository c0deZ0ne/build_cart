import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/modules/user/models/user.model';

export class AcceptSharedProjectDto {
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  sharedProjectId: string;

  @IsOptional()
  @IsDefined()
  user: User;
}
