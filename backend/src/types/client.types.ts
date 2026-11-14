export interface Client {
  id: number;
  name: string;
  email: string;
  segment: 'Standard' | 'Premium' | 'VIP';
  created_at?: Date;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  segment?: 'Standard' | 'Premium' | 'VIP';
}