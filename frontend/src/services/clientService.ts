import type { ApiResponse, Client, CreateClientDTO } from '../types/client.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchClients(): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients`);
  if (!response.ok) {
    throw new Error('Error al obtener la lista de clientes');
  }
  const result: ApiResponse<Client[]> = await response.json();
  return result.data;
}

export async function createNewClient(payload: CreateClientDTO): Promise<Client> {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Client> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Error al registrar el cliente');
  }

  return result.data;
}