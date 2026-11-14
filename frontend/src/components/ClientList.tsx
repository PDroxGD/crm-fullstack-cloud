import type { Client } from '../types/client.types';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
}

export function ClientList({ clients, isLoading }: ClientListProps) {
  if (isLoading) {
    return <div className="card">Cargando directorio de clientes...</div>;
  }

  if (clients.length === 0) {
    return <div className="card">No hay clientes registrados todavía.</div>;
  }

  return (
    <div className="card">
      <h2>Cartera de Clientes ({clients.length})</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Segmento</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>#{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>
                <span className={`badge badge-${client.segment.toLowerCase()}`}>
                  {client.segment}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}