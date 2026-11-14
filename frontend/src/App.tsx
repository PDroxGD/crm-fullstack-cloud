import { useEffect, useState } from 'react';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import { createNewClient, fetchClients } from './services/clientService';
import type { Client, CreateClientDTO } from './types/client.types';
import './App.css';

export function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

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

  const handleAddClient = async (newClientData: CreateClientDTO) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const created = await createNewClient(newClientData);
      setClients((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Mini-CRM Cloud</h1>
        <p>Arquitectura Fullstack Modular • React + TypeScript + Node.js</p>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <section className="grid-layout">
        <ClientForm onSubmitClient={handleAddClient} isSubmitting={isSubmitting} />
        <ClientList clients={clients} isLoading={isLoading} />
      </section>
    </main>
  );
}

export default App;