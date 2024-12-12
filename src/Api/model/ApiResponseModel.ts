interface ApiResponse {
  Content: {
    Access_token: string;
    Refresh_token: string;
  };
  Message: string;
  Success: boolean;
}

export default ApiResponse;
