export interface RespostaBaseApi<T> {
  Content: T;
  Message: string;
  Success: boolean;
  Total?: number;
}

export interface LoginInternoDto {
  access_token: string;
  refresh_token: string;
}