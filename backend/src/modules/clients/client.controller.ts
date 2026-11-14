import { Request, Response } from 'express';
import * as clientService from './client.service';

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
    const client = await clientService.createClient({ name, email, segment });
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    res.status(500).json({ success: false, message });
  }
}