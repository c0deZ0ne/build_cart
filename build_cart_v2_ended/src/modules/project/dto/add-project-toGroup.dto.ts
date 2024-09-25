import { IsUUID, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectGroupDto {
  @ApiProperty({
    example: 'a7c5318b-0d0b-4fbf-86a2-07c21e8c4cd0',
    description: 'The UUID of the project',
  })
  @IsUUID()
  ProjectId: string;

  @ApiProperty({
    example: 'a7c5318b-0d0b-4fbf-86a2-07c21e8c4cd0',
    description: 'The UUID of the group name',
  })
  @IsUUID()
  GroupNameId: string;
}
