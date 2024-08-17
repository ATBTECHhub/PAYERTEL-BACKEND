import { Router } from 'express';
import { getThirdPartyWalletBalance } from '../controllers/thirdartyWalletController.js';

const router = Router();

router.get('/balance', getThirdPartyWalletBalance);

export default router;
