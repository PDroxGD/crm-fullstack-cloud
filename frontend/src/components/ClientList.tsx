import { useState } from 'react';
import type { Client } from '../types/client.types';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: number) => void;
}

export function ClientList({
  clients,
  isLoading,
  onEditClient,
  onDeleteClient,
}: ClientListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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
            <th>Acciones</th>
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
              <td style={{ display: 'flex', gap: '6px' }}>
                {confirmDeleteId === client.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteClient(client.id);
                        setConfirmDeleteId(null);
                      }}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.85rem',
                        backgroundColor: '#dc2626',
                      }}
                    >
                      ¿Confirmar?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.85rem',
                        backgroundColor: '#64748b',
                      }}
                    >
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onEditClient(client)}
                      style={{ padding: '4px 10px', fontSize: '0.85rem' }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(client.id)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.85rem',
                        backgroundColor: '#dc2626',
                      }}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}