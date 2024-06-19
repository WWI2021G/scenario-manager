import { Router } from "express";
import { dbController } from "../controllers/dbController";

const router = Router();

router.get("/setup", dbController.setupDB);
router.get("/user/:id", dbController.getUser);
router.post("/user/add", dbController.addUser);
router.post("/userid", dbController.getUserID);
router.get("/sp/:id", dbController.getScenarioProject);
router.get("/sp/user/:id", dbController.getAllScenarioProjectsForUser);
router.post("/sp/add", dbController.addScenarioProject);
router.post("/spid", dbController.getScenarioProjectID);
router.get("/if/all", dbController.getAllInfluencingFactors);
router.get("/if/:id", dbController.getInfluencingFactor);
router.get("/if/sp/:id", dbController.getInfluencingFactorsForScenarioProject);
router.post("/if/add", dbController.addInfluencingFactor);
router.post("/if/link", dbController.linkInfluencingFactorAndScenarioProject);
router.post("/ifid", dbController.getInfluencingFactorID);
router.post("/ifname", dbController.getInfluencingFactorByName);
// WARN: Only for development purposes - will destroy everything in database <2024-06-13>
router.get("/redoDB", dbController.redoDB);

export default router;
