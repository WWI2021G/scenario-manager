import { Router } from "express";
import { dbController } from "../controllers/dbController";

const router = Router();

router.get("/setup", dbController.setupDB);
router.get("/cur-time", dbController.getCurTime);
// WARN: Only for development purposes - will destroy everything in database <2024-06-13>
router.get("/redoDB", dbController.redoDB);

export default router;
