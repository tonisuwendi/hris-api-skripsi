export interface IPagination {
  total: number;
  limit: number;
  page: number;
}

export interface IGetAllResult<T> {
  data: T[];
  pagination: IPagination;
}
