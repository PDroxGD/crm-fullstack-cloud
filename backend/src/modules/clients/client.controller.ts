import { Request, Response } from 'express';
import * as clientService from './client.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function getClients(_req: Request, res: Response): Promise<void> {
  try {
    const clients = await clientService.getAllClients();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    res.status(500).json({ success: false, message });
  }
}

export async function postClient(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, segment } = req.body;
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios' });
      return;
    }
    if (!EMAIL_REGEX.test(String(email).trim())) {
      res.status(400).json({
        success: false,
        message: 'El correo debe incluir una extensión válida (ej. usuario@dominio.com)',
      });
      return;
    }

    const client = await clientService.createClient({
      name: String(name).trim(),
      email: String(email).trim(),
      segment,
    });
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    res.status(500).json({ success: false, message });
  }
}

export async function updateClient(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { name, email, segment } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de cliente inválido' });
      return;
    }
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios' });
      return;
    }
    if (!EMAIL_REGEX.test(String(email).trim())) {
      res.status(400).json({
        success: false,
        message: 'El correo debe incluir una extensión válida (ej. usuario@dominio.com)',
      });
      return;
    }

    const updated = await clientService.updateClient(id, {
      name: String(name).trim(),
      email: String(email).trim(),
      segment,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      res.status(409).json({ success: false, message: 'Ese correo ya pertenece a otro cliente' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Error interno al actualizar';
    res.status(500).json({ success: false, message });
  }
}

export async function deleteClient(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de cliente inválido' });
      return;
    }

    const deleted = await clientService.deleteClient(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Cliente eliminado correctamente' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno al eliminar';
    res.status(500).json({ success: false, message });
  }
}