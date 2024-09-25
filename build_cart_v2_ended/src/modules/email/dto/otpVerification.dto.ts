export class OTPVerificationDto {
  name: string;
  email: string;
  otp: number;
}

export class SendGeneratedPasswordDto {
  name: string;
  email: string;
  password: string;
}
