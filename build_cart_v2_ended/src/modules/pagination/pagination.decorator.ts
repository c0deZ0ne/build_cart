import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';

export function UsePagination(entity: string) {
  return applyDecorators(
    UseInterceptors(new PaginationInterceptor(new PaginationService(), entity)),
  );
}
