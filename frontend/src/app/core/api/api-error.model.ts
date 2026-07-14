export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: unknown;
  details?: unknown;
}
