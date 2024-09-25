import { Module } from '@nestjs/common';
import { RateReviewService } from './rate-review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RateReview } from './model/rateReview.model';
import { ContractModule } from 'src/modules/contract/contract.module';

@Module({
  imports: [SequelizeModule.forFeature([RateReview]), ContractModule],
  controllers: [],
  providers: [RateReviewService],
  exports: [RateReviewService],
})
export class RateReviewModule {}
