import { pool } from '../../config/db';
import { Client, CreateClientDTO } from '../../types/client.types';

const memoryClients: Client[] = [
  { id: 1, name: 'Pedro Madero', email: 'pedro@ejemplo.com', segment: 'VIP' },
  { id: 2, name: 'Cliente Corporativo', email: 'contacto@empresa.com', segment: 'Premium' }
];

export async function getAllClients(): Promise<Client[]> {
  try {
    const result = await pool.query<Client>('SELECT * FROM clients ORDER BY id ASC');
    return result.rows;
  } catch {
    return memoryClients;
  }
}

export async function createClient(data: CreateClientDTO): Promise<Client> {
  const segment = data.segment || 'Standard';
  try {
    const result = await pool.query<Client>(
      'INSERT INTO clients (name, email, segment) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.email, segment]
    );
    return result.rows[0];
  } catch {
    const newClient: Client = {
      id: memoryClients.length + 1,
      name: data.name,
      email: data.email,
      segment
    };
    memoryClients.push(newClient);
    return newClient;
  }
}