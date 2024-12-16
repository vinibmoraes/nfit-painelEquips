export interface ApiResponse {
  Content: {
    access_token: string;
    refresh_token: string;
  };
  Message: string;
  Success: boolean;
}
