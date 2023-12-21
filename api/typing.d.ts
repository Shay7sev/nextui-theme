// * 请求响应参数(不包含data)
export interface Result {
  success: boolean;
}
// * 请求响应参数(包含data)
export interface ResultDataList<T = any> extends Result {
  data: T[];
}

export interface ResultData<T = any> extends Result {
  data: T;
}

export interface ResPage<T> extends Extra {
  list: T[];
  page_number?: number;
  page_size?: number;
  total: number;
  total_pages?: number;
}
