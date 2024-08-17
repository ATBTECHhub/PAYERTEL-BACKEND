import { Router } from 'express';
import { getThirdPartyWalletBalance } from '../controllers/thirdPartyWalletController.js';

const router = Router();

router.get('/balance', getThirdPartyWalletBalance);

export default router;
