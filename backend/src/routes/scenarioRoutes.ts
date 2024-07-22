import { Router } from "express";
import { scenarioController } from "../controllers/scenarioController";

const router = Router();

router.post("/scenarioProject", () => {});
router.post("/keyFactor", () => {});
router.post("/influenceMatrix", () => {});
router.post("/keyFactorCatalog", () => {});
router.post("/rawScenario", () => {});
router.post("/rawScenarioCatalog", () => {});
router.post("/scenarioProject", () => {});
router.post("/futureProjection", () => {});
router.post("/projectionBundle", () => {});
router.post("/projectionBundleCatalog", () => {});
router.post("/distanceMatrix", scenarioController.executeClustering);
router.post("/scenarioProject", () => {});
router.post("/consistencyMatrix", () => {});

export default router;
