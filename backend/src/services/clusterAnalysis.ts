import { KeyFactor } from "../models/KeyFactor";
import { FutureProjection } from "../models/FutureProjection";
import { ProjectionBundle } from "../models/ProjectionBundle";
import { dbService } from "../services/dbService";

class ClusterAnalysis {
  private keyFactors: KeyFactor[];
  private futureProjections: FutureProjection[];
  private projectionBundles: ProjectionBundle[];

  constructor(projectionBundlesData: any[]) {
    this.projectionBundles = projectionBundlesData.map((bundleData) => {
      const projections = bundleData.projections.map((projData: any) => {
        const keyFactor = new KeyFactor(
          projData.keyFactor.name,
          projData.keyFactor.curState,
        );
        return new FutureProjection(
          projData.name,
          projData.description,
          keyFactor,
          projData.keyFactor_id,
          projData.probability,
          new Date(projData.timeFrame),
          projData.type,
        );
      });

      const projectionBundle = new ProjectionBundle(
        bundleData.consistency,
        bundleData.numPartInconsistencies,
        parseFloat(bundleData.probability),
        bundleData.projectionBundle_id,
      );

      projectionBundle.addProjections(projections);

      return projectionBundle;
    });

    this.keyFactors = [];
    this.futureProjections = [];
    this.projectionBundles.forEach((bundle) => {
      bundle.getProjections().forEach((proj) => {
        this.futureProjections.push(proj);
        if (
          !this.keyFactors.some(
            (kf) => kf.getName() === proj.getKeyFactor().getName(),
          )
        ) {
          this.keyFactors.push(proj.getKeyFactor());
        }
      });
    });
  }

  private calculateDistance(
    bundle1: ProjectionBundle,
    bundle2: ProjectionBundle,
  ): number {
    const projections1 = new Set(
      bundle1.getProjections().map((p) => p.getName()),
    );
    const projections2 = new Set(
      bundle2.getProjections().map((p) => p.getName()),
    );

    const intersection = new Set(
      [...projections1].filter((x) => projections2.has(x)),
    );
    const unionDifference = new Set(
      [...projections1, ...projections2].filter(
        (x) => !(projections1.has(x) && projections2.has(x)),
      ),
    );

    const A = intersection.size;
    const U = unionDifference.size;

    return U / (2 * A + U);
  }

  private createDistanceMatrix(bundles: ProjectionBundle[]): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < bundles.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < bundles.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else if (j > i) {
          matrix[i][j] = this.calculateDistance(bundles[i], bundles[j]);
        } else {
          matrix[i][j] = matrix[j][i];
        }
      }
    }
    return matrix;
  }

  private updateDistanceMatrix(
    matrix: number[][],
    index1: number,
    index2: number,
    linkageMethod: string,
  ): number[][] {
    const newMatrix: number[][] = [];
    const newSize = matrix.length - 1;

    for (let i = 0; i < newSize; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < newSize; j++) {
        if (i === j) {
          newMatrix[i][j] = 0;
        } else {
          const origI = i >= index1 ? i + 1 : i;
          const origJ = j >= index2 ? j + 1 : j;
          const distance =
            linkageMethod === "single"
              ? Math.min(matrix[index1][origJ], matrix[index2][origJ])
              : linkageMethod === "complete"
                ? Math.max(matrix[index1][origJ], matrix[index2][origJ])
                : (matrix[index1][origJ] + matrix[index2][origJ]) / 2;
          newMatrix[i][j] = distance;
        }
      }
    }

    return newMatrix;
  }

  public async agglomerativeClustering(
    linkageMethod: string,
    scenarioProject_id: number,
  ): Promise<void> {
    let clusters = this.projectionBundles.map((bundle) => [bundle]);
    let matrix = this.createDistanceMatrix(this.projectionBundles);

    while (clusters.length > 2) {
      let minDistance = Infinity;
      let mergeIndex1 = -1;
      let mergeIndex2 = -1;

      for (let i = 0; i < matrix.length; i++) {
        for (let j = i + 1; j < matrix[i].length; j++) {
          if (matrix[i][j] < minDistance) {
            minDistance = matrix[i][j];
            mergeIndex1 = i;
            mergeIndex2 = j;
          }
        }
      }

      const newCluster = [...clusters[mergeIndex1], ...clusters[mergeIndex2]];
      clusters = clusters.filter(
        (_, index) => index !== mergeIndex1 && index !== mergeIndex2,
      );
      clusters.push(newCluster);

      matrix = this.updateDistanceMatrix(
        matrix,
        mergeIndex1,
        mergeIndex2,
        linkageMethod,
      );
    }

    await dbService.createRawScenarios(clusters, scenarioProject_id);
    this.displayClusters(clusters);
  }

  public displayClusters(clusters: ProjectionBundle[][]) {
    clusters.forEach((cluster, index) => {
      console.log(`Cluster ${index + 1}:`);
      cluster.forEach((bundle) => {
        bundle.getProjections().forEach((projection) => {
          console.log(`  Projection: ${projection.getName()}`);
        });
      });
    });
  }}

export default ClusterAnalysis;
