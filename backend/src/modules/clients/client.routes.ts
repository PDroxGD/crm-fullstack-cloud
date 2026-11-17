import { Router } from 'express';
import {
  getClients,
  postClient,
  updateClient,
  deleteClient,
} from './client.controller';

const router = Router();

router.get('/', getClients);
router.post('/', postClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;