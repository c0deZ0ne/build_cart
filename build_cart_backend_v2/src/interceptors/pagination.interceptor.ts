import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationService } from 'src/modules/pagination/pagination.service';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(
    private readonly paginationService: PaginationService,
    readonly entity: string,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { query } = request;
    const page = this.paginationService.getPage(Number(query.page));
    const page_size = this.paginationService.getPageSize(
      Number(query.page_size),
    );

    return next.handle().pipe(
      map((data) => {
        if (!data) return data;
        const isArray = Array.isArray(data);
        const isRows = Array.isArray(data.rows);
        const tranformData = isArray
          ? this.transformArrayData(data, page, page_size)
          : Array.isArray(data?.rows)
          ? this.transformArrayData(data?.rows, page, page_size)
          : data;
        const transformedData = {
          page,
          page_size,
          size: isArray || isRows ? Number(tranformData.length) : 1,
          total: isRows ? Number(data.rows.length) : Number(data.length),
          message: 'Success',

          [this.entity]: tranformData,
        };
        return transformedData;
      }),
    );
  }

  private transformArrayData(data: any[], page: number, page_size: number) {
    if (!data.length) return data;
    if (data.length < page_size) return data;
    return this.paginationService.applyPagination(data, page, page_size);
  }
}
