export function getPaginationMeta(
  totalCount: number,
  page: number,
  limit: number,
  currentCount: number,
) {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    currentPage: page,
    pageSize: limit,
    totalRecords: totalCount,
    totalPages,
    currentCount,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
  };
}

//usage
// async getQuotations(query: any) {
//   const { sortBy, orderBy } = getSortingOptions(query);
//   const { skip, take, page, limit } = getPaginationOptions(query);

//   const qb = this.quotationRepository
//     .createQueryBuilder('quotation')
//     .leftJoin('quotation.quotationServices', 'quotationServices')
//     .select([
//       'quotation.id',
//     ]);

//   applySearch(qb, query.search, [
//     'quotation.customerName',
//     'quotation.phone',
//     'quotation.address',
//     'quotation.email',
//   ]);

//   qb.addSelect(`quotation.${sortBy}`)
//     .orderBy(`quotation.${sortBy}`, orderBy)
//     .skip(skip)
//     .take(take);

//   const [quotations, totalCount] = await qb.getManyAndCount();

//   return {
//     success: true,
//     message: `Quotations fetched successfully.`,
//     data: quotations,
//     meta: getPaginationMeta(totalCount, page, limit, quotations.length),
//   };
// }
