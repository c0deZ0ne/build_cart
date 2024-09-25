import { IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name: string;
}
