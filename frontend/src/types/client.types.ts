export type ClientSegment = 'Standard' | 'Premium' | 'VIP';

export interface Client {
  id: number;
  name: string;
  email: string;
  segment: ClientSegment;
  created_at?: string;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  segment: ClientSegment;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}