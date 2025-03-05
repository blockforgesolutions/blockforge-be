import { SortOrder } from '../enums/sort-order.enum';

export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  orderBy: string;
  order: SortOrder;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginatedMeta;
}

// Eski PaginatedResult'ı kaldırıp yerine PaginatedResponse'u kullanalım
export type PaginatedResult<T> = PaginatedResponse<T>; 