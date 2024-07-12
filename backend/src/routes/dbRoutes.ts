import { Router } from "express";
import { dbController } from "../controllers/dbController";

const router = Router();

router.get("/setup", dbController.setupDB);
// WARN: Only for development purposes - will destroy everything in database <2024-06-13>
router.get("/redoDB", dbController.redoDB);

router.get("/user/:id", dbController.getUser);
router.post("/user/add", dbController.addUser);
router.post("/userid", dbController.getUserID);
router.post("/username", dbController.getUserByName);

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
router.get("/if/as/:id", dbController.getActiveSum);
router.get("/if/ps/:id", dbController.getPassiveSum);
router.post("/if/as/update", dbController.setActiveSum);
router.post("/if/ps/update", dbController.setPassiveSum);
router.post("/if/update", dbController.updateInfluencingFactor);

router.get("/kf/:id", dbController.getKeyFactor);
router.get("/kf/sp/:id", dbController.getKeyFactorsForScenarioProject);
router.post("/kf/add", dbController.addKeyFactor);
router.post("/kf/cstate", dbController.setCurState);
router.post("/kf/critical", dbController.getCritical);
router.post("/kf/critical/update", dbController.setCritical);
router.post("/kfid", dbController.getKeyFactorID);
router.post("/kfname", dbController.getKeyFactorByName);
router.get("/kf/prop1/:id", dbController.getPropertyOne);
router.get("/kf/prop2/:id", dbController.getPropertyTwo);
router.post("/kf/prop1/update", dbController.setPropertyOne);
router.post("/kf/prop2/update", dbController.setPropertyTwo);

router.get("/fp/:id", dbController.getFutureProjection);
router.get("/fp/kf/:id", dbController.getFutureProjectionsForKeyFactor);
router.get("/fp/sp/:id", dbController.getFutureProjectionsForScenarioProject);
router.get("/fp/pb/:id", dbController.getFutureProjectionsForProjectionBundle);
router.post("/fp/add", dbController.addFutureProjection);
router.post("/fp/link", dbController.linkFutureProjectionAndProjectionBundle);
router.post("/fpid", dbController.getFutureProjectionID);
router.post("/fpname", dbController.getFutureProjectionByName);

router.get("/pb/:id", dbController.getProjectionBundle);
router.get("/pb/consistency/:id", dbController.getConsistency);
router.get(
  "/pb/numPartInconsistencies/:id",
  dbController.getNumPartInconsistencies,
);
router.get("/pb/pValue/:id", dbController.getPValue);
router.get("/pb/rs/:id", dbController.getProjectionBundlesForRawScenario);
router.get("/pb/sp/:id", dbController.getProjectionBundlesForScenarioProject);
router.post("/pb/add", dbController.addProjectionBundle);
router.post("/pb/link", dbController.linkProjectionBundleAndRawScenario);

router.get("/rs/:id", dbController.getRawScenario);
router.get("/rs/sp/:id", dbController.getRawScenariosForScenarioProject);
router.post("/rs/add", dbController.addRawScenario);
router.post("/rsid", dbController.getRawScenarioID);
router.post("/rsname", dbController.getRawScenarioByName);

export default router;
