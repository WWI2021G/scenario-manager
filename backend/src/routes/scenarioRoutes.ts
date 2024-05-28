import {Router} from 'express';
import {scenarioController} from '../controllers/scenarioController';

const router = Router();

router.post('/influencingFactors', scenarioController.addInfluencingFactors);