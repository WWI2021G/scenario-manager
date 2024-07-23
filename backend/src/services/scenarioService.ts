import { db } from "../services/dbService";
import { RawScenario } from "../models/RawScenario";
import { ProjectionBundle } from "../models/ProjectionBundle";
import { FutureProjection } from "../models/FutureProjection";
import { KeyFactor } from "../models/KeyFactor";
import { Probability } from "../models/Probability";
import { ProjectionType } from "../models/ProjectionType";

interface KeyFactorDistribution {
  a: number;
  b: number;
  toggle: boolean;
}

interface DistributionResult {
  keyFactorId: string;
  absoluteA: number;
  absoluteB: number;
  total: number;
  relativeA: number;
  relativeB: number;
}

class ScenarioService {
  async selectRawScenariosForScenarioProject(
    scenarioProject_id: number,
  ): Promise<RawScenario[]> {
    try {
      const results: RawScenario[] = [];
      const query_results = await db.any<{
        rawscenario_id: number;
        name: string;
        quality: number;
      }>(
        `SELECT
          rs.rawscenario_id,
          name,
          quality
        FROM
          rawscenario rs
          JOIN pb_rs pbrs ON pbrs.rawscenario_id = rs.rawscenario_id
          JOIN projectionbundle pb ON pb.projectionbundle_id = pbrs.projectionbundle_id
        WHERE
          scenarioproject_id = $1;`,
        scenarioProject_id,
      );
      for (const queryResult of query_results) {
        const rawScenario = new RawScenario(
          queryResult.name,
          queryResult.quality,
        );
        const projectionBundles =
          await this.selectProjectionBundlesForRawScenario(
            queryResult.rawscenario_id,
          );
        projectionBundles.forEach((projectionBundle) => {
          rawScenario.addProjectionBundle(projectionBundle);
        });
        results.push(rawScenario);
      }
      return results;
    } catch (error) {
      console.error(
        "Error selecting all RawScenarios for scenarioProject_id:",
        scenarioProject_id,
        error,
      );
      throw error;
    }
  }

  async selectProjectionBundlesForRawScenario(
    rawScenario_id: number,
  ): Promise<ProjectionBundle[]> {
    try {
      const results: ProjectionBundle[] = [];
      const query_results = await db.any<{
        projectionbundle_id: number;
        consistency: number;
        numpartinconsistencies: number;
        pvalue: number;
      }>(
        `SELECT
          pb.projectionbundle_id,
          consistency,
          numpartinconsistencies,
          pvalue
        FROM
          projectionbundle pb
          JOIN pb_rs pbrs ON pbrs.projectionbundle_id = pb.projectionbundle_id
        WHERE
          pbrs.rawscenario_id = $1;`,
        rawScenario_id,
      );
      for (const queryResult of query_results) {
        const projectionBundle = new ProjectionBundle(
          queryResult.consistency,
          queryResult.numpartinconsistencies,
          queryResult.pvalue,
          queryResult.projectionbundle_id,
        );
        const futureProjections =
          await this.selectFutureProjectionsForProjectionBundle(
            queryResult.projectionbundle_id,
          );
        futureProjections.forEach((fp) => {
          projectionBundle.addProjection(fp);
        });
        results.push(projectionBundle);
      }
      return results;
    } catch (error) {
      console.error(
        "Error selecting ProjectionBundles for rawScenario_id:",
        rawScenario_id,
        error,
      );
      throw error;
    }
  }
   async selectFutureProjectionsForProjectionBundle(projectionBundle_id: number): Promise<FutureProjection[]> {
    try {
      const query_results = await db.any<{
        futureprojection_id: number;
        name: string;
        description: string;
        keyfactor_id: number;
        probability: Probability;
        timeframe: Date;
        projectiontype: ProjectionType;
      }>(
        `SELECT
          fp.futureprojection_id,
          fp.name,
          fp.description,
          fp.keyfactor_id,
          fp.probability,
          fp.timeframe,
          fp.projectiontype
        FROM
          futureprojection fp
          JOIN fp_pb fpb ON fpb.futureprojection_id = fp.futureprojection_id
        WHERE
          fpb.projectionbundle_id = $1;`,
        projectionBundle_id,
      );

      return query_results.map(result => new FutureProjection(
        result.name,
        result.description,
        new KeyFactor(result.keyfactor_id.toString(), ""),
        result.keyfactor_id,
        result.probability,
        result.timeframe,
        result.projectiontype,
      ));
    } catch (error) {
      console.error("Error selecting FutureProjections for projectionBundle_id:", projectionBundle_id, error);
      throw error;
    }
  }
  async selectFutureProjectionsForRawScenario(
    rawScenario_id: number,
  ): Promise<FutureProjection[]> {
    try {
      const query_results = await db.any<{
        futureprojection_id: number;
        name: string;
        description: string;
        keyfactor_id: number;
        probability: Probability;
        timeframe: Date;
        projectiontype: ProjectionType;
      }>(
        `SELECT
          fp.futureprojection_id,
          fp.name,
          fp.description,
          fp.keyfactor_id,
          fp.probability,
          fp.timeframe,
          fp.projectiontype
        FROM
          futureprojection fp
          JOIN fp_pb fpb ON fpb.futureprojection_id = fp.futureprojection_id
          JOIN pb_rs pbrs ON pbrs.projectionbundle_id = fpb.projectionbundle_id
        WHERE
          pbrs.rawscenario_id = $1;`,
        rawScenario_id,
      );
      console.log("query_results:", query_results);

      return query_results.map((result) => {
        return new FutureProjection(
          result.name,
          result.description,
          new KeyFactor(result.keyfactor_id.toString(), ""),
          result.keyfactor_id,
          result.probability,
          result.timeframe,
          result.projectiontype,
        );
      });
    } catch (error) {
      console.error(
        "Error selecting FutureProjections for rawScenario_id:",
        rawScenario_id,
        error,
      );
      throw error;
    }
  }
  async calculateDistribution(rawScenarioId: number): Promise<DistributionResult[]> {
    try {
      const projectionBundles = await db.any(
        `SELECT pb.* FROM projectionbundle pb
         JOIN pb_rs pbrs ON pb.projectionbundle_id = pbrs.projectionbundle_id
         WHERE pbrs.rawscenario_id = $1`,
        [rawScenarioId]
      );
      projectionBundles.forEach((pb: ProjectionBundle) => {
      console.log("Projektions",pb);
      });

      const keyFactorDistributions: { [key: string]: KeyFactorDistribution } = {};

      for (const bundle of projectionBundles) {
        const projections = await this.selectFutureProjectionsForProjectionBundle(bundle.projectionbundle_id);

        projections.forEach(projection => {
          const keyFactorId = projection.getKeyFactorID().toString();

          if (!keyFactorDistributions[keyFactorId]) {
            keyFactorDistributions[keyFactorId] = { a: 0, b: 0, toggle: true };
          }

          if (keyFactorDistributions[keyFactorId].toggle) {
            keyFactorDistributions[keyFactorId].a += 1; // Assign to A
          } else {
            keyFactorDistributions[keyFactorId].b += 1; // Assign to B
          }
          keyFactorDistributions[keyFactorId].toggle = !keyFactorDistributions[keyFactorId].toggle;
        });
      }

      const results: DistributionResult[] = [];

      for (const [keyFactorId, distribution] of Object.entries(keyFactorDistributions)) {
        const total = distribution.a + distribution.b;
        const relativeA = total ? (distribution.a / total) * 100 : 0;
        const relativeB = total ? (distribution.b / total) * 100 : 0;

        results.push({
          keyFactorId,
          absoluteA: distribution.a,
          absoluteB: distribution.b,
          total,
          relativeA,
          relativeB
        });
      }

      return results;
    } catch (error) {
      console.error("Error calculating distribution:", error);
      throw error;
    }}
  }

export const scenarioService = new ScenarioService();
