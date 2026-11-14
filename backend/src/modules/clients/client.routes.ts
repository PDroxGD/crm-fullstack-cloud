import { Router } from 'express';
import { getClients, postClient } from './client.controller';

const router = Router();

router.get('/', getClients);
router.post('/', postClient);

export default router;