import { UserQueryDto } from '../../user/dto/user-query.dto';
import { TestSortables } from '../constants/test-sortables.constant';
import { BaseQueryDto } from '../dtos/base-query.dto';
import { SortingOrder } from '../enums/sorting-order.enum';
import { SortingOptions } from '../interfaces/sorting-options.interface';

export function getSortingOptions(
  query: BaseQueryDto | UserQueryDto,
): SortingOptions {
  let sortBy = 'createdAt';
  if (query.sortBy && TestSortables.includes(query.sortBy)) {
    sortBy = query.sortBy;
  }

  const orderBy =
    query.orderBy && Object.values(SortingOrder).includes(query.orderBy)
      ? query.orderBy
      : SortingOrder.ASC;

  return { sortBy, orderBy };
}

//usecase

// GET /products?sortBy=price&orderBy=DESC&page=2&limit=5

// async getQuotations(query: any) {
//   const { sortBy, orderBy } = getSortingOptions(query);
//   const { skip, take, page, limit } = getPaginationOptions(query);

//   const qb = this.quotationRepository
//     .createQueryBuilder('quotation')
//     .select([
//       'quotation.id',
//     ]);

//   applySearch(qb, query.search, [
//     'quotation.customerName',
//   ]);

//   qb.addSelect(`quotation.${sortBy}`)
//     .orderBy(`quotation.${sortBy}`, orderBy)
//     .skip(skip)
//     .take(take);

//   const [quotationAndCount, error] = await safeError(qb.getManyAndCount());

//   if (error) {
//     console.error('Error fetching quotations:', error);
//     throw new InternalServerErrorException(
//       'Error while fetching Quotations. Please try again later.',
//     );
//   }

//   const [quotations, totalCount] = quotationAndCount;

//   return {
//     success: true,
//     message: `Quotations fetched successfully.`,
//     data: quotations,
//     meta: getPaginationMeta(totalCount, page, limit, quotations.length),
//   };
// }
