import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectSharesDto {
  ProjectId: string;
  FundManagerId?: string;
  BuilderId?: string;
}

export class UpdateProjectSharesDto {
  ProjectId?: string;
  FundManagerId?: string;
  BuilderId?: string;
}

class Owner {
  @ApiProperty({ example: 'Eco Hotel' })
  name: string;

  @ApiProperty({ example: '+2348123445678' })
  phone: string;

  @ApiProperty({ example: 'joshua@builder.com' })
  email: string;
}

export class ResponseProjectInviteDto {
  @ApiProperty({ example: '2024-01-26T11:51:27.792Z' })
  dateCreated: Date;

  @ApiProperty({ example: 'Project Location share test' })
  location: string;

  @ApiProperty({ example: 'Project Title' })
  title: string;

  @ApiProperty({ example: '237d43ec-8f54-40ed-8a74-706badcdb63c' })
  sharedId: string;

  @ApiProperty({ type: Owner })
  owner: Owner;

  @ApiProperty({ example: '84ac580d-7323-43ba-b651-635cbb4dffd8' })
  projectId: string;

  @ApiProperty({ example: '52 weeks, 11 months, 364 days' })
  duration: string;
}
