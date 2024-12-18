export interface ApiResponse<T> {
  Content: T;
  Message: string;
  Success: boolean;
  Total?: number;
}
