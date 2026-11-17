import { useEffect, useState } from 'react';
import type { Client, ClientSegment, CreateClientDTO } from '../types/client.types';

interface ClientFormProps {
  onSubmitClient: (data: CreateClientDTO) => Promise<void>;
  isSubmitting: boolean;
  editingClient?: Client | null;
  onCancelEdit?: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ClientForm({
  onSubmitClient,
  isSubmitting,
  editingClient,
  onCancelEdit,
}: ClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState<ClientSegment>('Standard');
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setEmailError(null);
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setSegment(editingClient.segment);
    } else {
      setName('');
      setEmail('');
      setSegment('Standard');
    }
  }, [editingClient]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!name.trim() || !trimmedEmail) return;

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Ingresa un correo con extensión válida (ej. ana@empresa.com o .es)');
      return;
    }

    setEmailError(null);
    await onSubmitClient({ name: name.trim(), email: trimmedEmail, segment });

    if (!editingClient) {
      setName('');
      setEmail('');
      setSegment('Standard');
    }
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h2>{editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>

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
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          required
        />
        {emailError && (
          <small style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '4px' }}>
            {emailError}
          </small>
        )}
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

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : editingClient
              ? 'Guardar Cambios'
              : 'Agregar Cliente'}
        </button>

        {editingClient && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}