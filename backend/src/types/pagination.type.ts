export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQueryParams {
  take: number;
  page: number;
  sortBy: string;
  sortOrder: string;
}
