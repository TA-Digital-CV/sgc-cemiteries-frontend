export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}
