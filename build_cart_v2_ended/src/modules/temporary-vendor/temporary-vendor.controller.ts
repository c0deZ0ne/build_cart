import { Body, Post, Controller, ValidationPipe } from '@nestjs/common';
import { TemporaryVendorService } from './temporary-vendor.service';
import { CreateTemporaryVendorDto } from './dto/create-temporary-vendor.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('temporary-vendor')
@ApiTags('temporary-vendors')
export class TemporaryVendorController {
  constructor(
    private readonly temporaryVendorService: TemporaryVendorService,
  ) {}

  @ApiOperation({
    summary: 'Create a new temporary vendor',
  })
  @Post('create-vendor')
  async createVendor(@Body(ValidationPipe) body: CreateTemporaryVendorDto) {
    return this.temporaryVendorService.createTemporaryVendor(body);
  }
}
