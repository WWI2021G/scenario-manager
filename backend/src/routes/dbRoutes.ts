import { Router } from "express";
import { dbController } from "../controllers/dbController";

const router = Router();

router.get("/setup", dbController.setupDB);
router.post("/userid", dbController.getInsertUserID);
router.get("/user/:id", dbController.getUser);
router.post("/spid", dbController.getInsertScenarioProject);
router.get("/sp/:id", dbController.getScenarioProject);
// WARN: Only for development purposes - will destroy everything in database <2024-06-13>
router.get("/redoDB", dbController.redoDB);

export default router;
