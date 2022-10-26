import express from 'express';

import {
    createSubscription,
    getAllPlans,
    subScriptionStatus,
    userSubscriptionInfo
} from './../controllers/pricingPlansControllers';
import { requiresSignIn } from '../middlewares/requireSignIn';


const router = express.Router();

router.get('/prices', getAllPlans);
router.post('/create-subscription', requiresSignIn, createSubscription);
router.get('/subscription-status', requiresSignIn, subScriptionStatus);
router.get('/subscriptions', requiresSignIn, userSubscriptionInfo);


export default router;

