import { IsDefined, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsString()
  oldPassword: string;
  @IsDefined()
  @IsString()
  newPassword: string;
}
