import { PaginationOptions } from '../interfaces/pagination-options.interface';

export function getPaginationOptions(query: {
  page?: number;
  limit?: number;
}): PaginationOptions {
  const page = query.page && Number(query.page) > 0 ? Number(query.page) : 1;
  const limit =
    query.limit && Number(query.limit) > 0 ? Number(query.limit) : 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
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
