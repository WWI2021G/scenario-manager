import { Router } from "express";
import { dbController } from "../controllers/dbController";

const router = Router();

router.get('/cur-time', dbController.getCurTime);

export default router;
