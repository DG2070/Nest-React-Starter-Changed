import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export function applySearch<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  searchTerm: string,
  searchableFields: string[], // format: ["alias.field", "alias2.field2"]
) {
  if (!searchTerm || searchableFields.length === 0) return qb;

  const conditions = searchableFields.map((field) => {
    // cast numeric columns to text for ILIKE
    return `CAST(${field} AS TEXT) ILIKE :search`;
  });

  qb.andWhere(`(${conditions.join(' OR ')})`, {
    search: `%${searchTerm}%`,
  });

  return qb;
}

// see the format of using this helper function
// GET /products?sortBy=price&orderBy=DESC&page=2&limit=5&search=dinesh

// async getQuotations(query: any) {
//   const { sortBy, orderBy } = getSortingOptions(query);
//   const { skip, take } = getPaginationOptions(query);

//   const qb = this.quotationRepository
//     .createQueryBuilder('quotation')
//     .leftJoin('quotation.quotationServices', 'quotationServices')
//     .select([
//       'quotation.id',
//     ]);

//   applySearch(qb, query.search, [
//     'quotation.customerName',
//     'quotation.phone',
//     "quotationServices.description"
//   ]);

//   qb.addSelect(`quotation.${sortBy}`)
//     .orderBy(`quotation.${sortBy}`, orderBy)
//     .skip(skip)
//     .take(take);

//   const [quotations, error] = await safeError(qb.getMany());

//   if (error) {
//     console.log(error.message);
//     throw new InternalServerErrorException(
//       `Error while fetching Quotations.`,
//     );
//   }

//   return {
//     success: true,
//     message: `Quotations fetched successfully.`,
//     data: quotations,
//   };
// }
