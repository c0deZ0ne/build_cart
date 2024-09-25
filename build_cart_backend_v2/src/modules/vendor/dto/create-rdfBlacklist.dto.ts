import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateVendorRfqBlacklistDto {
  @IsNotEmpty()
  @IsDefined()
  @IsUUID()
  RfqRequestId: string;
}
