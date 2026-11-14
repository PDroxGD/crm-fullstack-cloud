import { useState } from 'react';
import type { ClientSegment, CreateClientDTO } from '../types/client.types';

interface ClientFormProps {
  onSubmitClient: (data: CreateClientDTO) => Promise<void>;
  isSubmitting: boolean;
}

export function ClientForm({ onSubmitClient, isSubmitting }: ClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState<ClientSegment>('Standard');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    await onSubmitClient({ name, email, segment });
    setName('');
    setEmail('');
    setSegment('Standard');
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Registrar Nuevo Cliente</h2>

      <div className="field">
        <label htmlFor="name">Nombre completo</label>
        <input
          id="name"
          type="text"
          placeholder="Ej. Ana López"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          placeholder="ana@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="segment">Segmento</label>
        <select
          id="segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value as ClientSegment)}
        >
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Agregar Cliente'}
      </button>
    </form>
  );
}