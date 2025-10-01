export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: ApiResponseError;
};

export type ApiResponseError = {
  message: string;
  code?: string | number;
};
