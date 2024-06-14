import { Router } from "express";
import { dbController } from "../controllers/dbController";

const router = Router();

router.get("/setup", dbController.setupDB);
router.get("/user/:id", dbController.getUser);
router.post("/userid", dbController.getUserID);
router.post("/user/add", dbController.addUser);
router.get("/sp/:id", dbController.getScenarioProject);
router.post("/spid", dbController.getScenarioProjectID);
router.post("/sp/add", dbController.addScenarioProject);
// WARN: Only for development purposes - will destroy everything in database <2024-06-13>
router.get("/redoDB", dbController.redoDB);

export default router;
