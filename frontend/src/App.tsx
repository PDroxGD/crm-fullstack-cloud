import { useEffect, useState } from 'react';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import {
  createNewClient,
  deleteClient,
  fetchClients,
  updateClient,
} from './services/clientService';
import type { Client, CreateClientDTO } from './types/client.types';
import './App.css';

export function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  // Oculta automáticamente el aviso de éxito después de 3.5 segundos
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async (clientData: CreateClientDTO) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      if (editingClient) {
        const updated = await updateClient(editingClient.id, clientData);
        setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingClient(null);
        setSuccessMessage(`Cliente "${updated.name}" actualizado correctamente`);
      } else {
        const created = await createNewClient(clientData);
        setClients((prev) => [...prev, created]);
        setSuccessMessage(`Cliente "${created.name}" agregado correctamente`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

const handleDeleteClient = async (id: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      if (editingClient?.id === id) {
        setEditingClient(null);
      }
      setSuccessMessage('Cliente eliminado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el cliente');
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Mini-CRM Cloud</h1>
        <p>Arquitectura Fullstack Modular • React + TypeScript + Node.js</p>
      </header>

      {error && <div className="alert-error">{error}</div>}
      {successMessage && <div className="alert-success">{successMessage}</div>}

      <section className="grid-layout">
        <ClientForm
          onSubmitClient={handleSaveClient}
          isSubmitting={isSubmitting}
          editingClient={editingClient}
          onCancelEdit={() => setEditingClient(null)}
        />
        <ClientList
          clients={clients}
          isLoading={isLoading}
          onEditClient={setEditingClient}
          onDeleteClient={handleDeleteClient}
        />
      </section>
    </main>
  );
}

export default App;