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


export async function updateClient(id: number, data: CreateClientDTO): Promise<Client | null> {
  const segment = data.segment || 'Standard';
  try {
    const result = await pool.query<Client>(
      'UPDATE clients SET name = $1, email = $2, segment = $3 WHERE id = $4 RETURNING *',
      [data.name, data.email, segment, id]
    );
    return result.rows[0] || null;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    ) {
      throw new Error('EMAIL_EXISTS');
    }
    const index = memoryClients.findIndex((c) => c.id === id);
    if (index === -1) return null;
    memoryClients[index] = {
      ...memoryClients[index],
      name: data.name,
      email: data.email,
      segment
    };
    return memoryClients[index];
  }
}

export async function deleteClient(id: number): Promise<boolean> {
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount ?? 0) > 0;
  } catch {
    const index = memoryClients.findIndex((c) => c.id === id);
    if (index === -1) return false;
    memoryClients.splice(index, 1);
    return true;
  }
}