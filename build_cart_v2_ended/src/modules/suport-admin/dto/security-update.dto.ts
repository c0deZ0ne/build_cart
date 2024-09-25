import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsEmail, IsOptional, IsString } from "class-validator";

export class SupportAdminSecurityUpdateDTO {
    @ApiProperty({
      example: true,
      description: 'Enable or disable two-factor authentication.',
    })
    @IsBoolean()
    twoFactorAuthEnabled: boolean;
  
    @ApiProperty({
      example: true,
      description: 'Enable or disable email notifications.',
    })
    @IsBoolean()
    emailNotificationEnabled: boolean;
  
    @ApiProperty({
      example: true,
      description: 'Enable or disable SMS notifications.',
    })
    @IsBoolean()
    smsNotificationEnabled: boolean;
  }
export class SupportAdminProfileUpdateDTO {
    @ApiProperty({
      example: "http://progfile.png",
      description: ' profile avatar',
      required:false
    })
    @IsString()
    @IsDefined()
    avatar: string; 
    
    
    @ApiProperty({
      example: "+234812345678",
      description: 'phoneNumber',
      required:false
    })
    @IsString()
    @IsDefined()
    phoneNumber: string;  
  }
export class UpdateEmailDto{
    @ApiProperty({
      example: "abc@kmail.com",
      description: 'update user email',
      required:true
    })
    @IsString()
    @IsEmail()
    email: string;  
  }
  