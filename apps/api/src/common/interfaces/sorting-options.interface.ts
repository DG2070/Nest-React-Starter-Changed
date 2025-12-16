import { SortingOrder } from '../enums/sorting-order.enum';

export interface SortingOptions {
  sortBy: string;
  orderBy: SortingOrder;
}
