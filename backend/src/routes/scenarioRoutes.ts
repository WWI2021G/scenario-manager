import { Router } from "express";
import { scenarioController } from "../controllers/scenarioController";

const router = Router();

router.post("/scenarioProject", () => {});
router.post(
  "/influencingFactor",
  scenarioController.addInfluencingFactors.bind(scenarioController),
);
router.post("/keyFactor", () => {});
router.post("/influenceMatrix", () => {});
router.post("/keyFactorCatalog", () => {});
router.post("/rawScenario", () => {});
router.post("/rawScenarioCatalog", () => {});
router.post("/scenarioProject", () => {});
router.post("/futureProjection", () => {});
router.post("/projectionBundle", () => {});
router.post("/projectionBundleCatalog", () => {});
router.post("/distanceMatrix", () => {});
router.post("/scenarioProject", () => {});
router.post("/consistencyMatrix", () => {});

// Weitere Routen können hier hinzugefügt werden (z.B. getCatalog, updateCatalog, deleteCatalog, etc.)

export default router;
