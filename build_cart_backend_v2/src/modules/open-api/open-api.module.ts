import { Module } from '@nestjs/common';
import { OpenApiController } from './open-api.controller';
import { OpenApiService } from './open-api.service';
import { RfqModule } from '../rfq/rfq.module';
import { UserModule } from '../user/user.module';
import { ContractModule } from '../contract/contract.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [RfqModule, UserModule, ContractModule, BlogModule],
  controllers: [OpenApiController],
  providers: [OpenApiService],
  exports: [OpenApiService],
})
export class OpenApiModule {}
