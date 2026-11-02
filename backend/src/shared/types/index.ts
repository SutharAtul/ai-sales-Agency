export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiErrorPayload;
  requestId: string;
}

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

