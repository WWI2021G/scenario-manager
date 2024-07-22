import { FutureProjection } from "../models/FutureProjection";
import { Probability } from "../models/Probability";
import { ProjectionType } from "../models/ProjectionType";
import { ProjectionBundle } from "../models/ProjectionBundle";
import { KeyFactor } from "../models/KeyFactor";

// Step 1: Create KeyFactors
const keyFactors: KeyFactor[] = [];
for (let i = 1; i <= 10; i++) {
  keyFactors.push(
    new KeyFactor(`KeyFactor ${i}`, `Current State of KeyFactor ${i}`),
  );
}

// Step 2: Create FutureProjections
const futureProjections: FutureProjection[] = [];
keyFactors.forEach((keyFactor, index) => {
  for (let j = 1; j <= 2; j++) {
    const futureProjection = new FutureProjection(
      `Projection ${index + 1}${j}`,
      `Description for Projection ${index + 1}${j}`,
      keyFactor,
      index + 1,
      j === 1 ? Probability.HIGH : Probability.MEDIUM,
      new Date(),
      j === 1 ? ProjectionType.TREND : ProjectionType.EXTREME,
    );
    futureProjections.push(futureProjection);
  }
});

// Step 3: Create ProjectionBundles
const projectionBundles: ProjectionBundle[] = [];
for (let i = 1; i <= 10; i++) {
  const bundle = new ProjectionBundle(0.9, 2, 0.95); // example values for consistency, numPartInconsistencies, and probability
  // Add one projection from each key factor to the bundle
  keyFactors.forEach((keyFactor, index) => {
    const projectionsForKeyFactor = futureProjections.filter(
      (fp) => fp.getKeyFactor() === keyFactor,
    );
    bundle.addProjection(projectionsForKeyFactor[i % 2]); // Alternate between the two projections for the key factor
  });
  projectionBundles.push(bundle);
}

// Function to calculate distance
function calculateDistance(
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

// Function to create initial distance matrix
function createDistanceMatrix(bundles: ProjectionBundle[]): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < bundles.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < bundles.length; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else if (j > i) {
        matrix[i][j] = calculateDistance(bundles[i], bundles[j]);
      } else {
        matrix[i][j] = matrix[j][i];
      }
    }
  }
  return matrix;
}

// Function to update distance matrix
function updateDistanceMatrix(
  matrix: number[][],
  index1: number,
  index2: number,
  linkageMethod: string,
): number[][] {
  const newMatrix: number[][] = [];

  for (let i = 0; i < matrix.length; i++) {
    if (i !== index1 && i !== index2) {
      const newRow: number[] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        if (j !== index1 && j !== index2) {
          if (i === j) {
            newRow.push(0);
          } else {
            const distance =
              linkageMethod === "single"
                ? Math.min(matrix[index1][j], matrix[index2][j])
                : linkageMethod === "complete"
                  ? Math.max(matrix[index1][j], matrix[index2][j])
                  : (matrix[index1][j] + matrix[index2][j]) / 2;
            newRow.push(distance);
          }
        }
      }
      newMatrix.push(newRow);
    }
  }

  return newMatrix;
}

// Function to perform agglomerative clustering
function agglomerativeClustering(
  bundles: ProjectionBundle[],
  linkageMethod: string,
): ProjectionBundle[][] {
  let clusters = bundles.map((bundle) => [bundle]);
  let matrix = createDistanceMatrix(bundles);

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

    matrix = updateDistanceMatrix(
      matrix,
      mergeIndex1,
      mergeIndex2,
      linkageMethod,
    );
  }

  return clusters;
}

// Run the clustering algorithm
const clusters = agglomerativeClustering(projectionBundles, "average");

// Display the resulting clusters
function displayClusters(clusters: ProjectionBundle[][]) {
  clusters.forEach((cluster, index) => {
    console.log(`Cluster ${index + 1}:`);
    cluster.forEach((bundle) => {
      console.log(
        `  Bundle: ${bundle
          .getProjections()
          .map((fp) => fp.getName())
          .join(", ")}`,
      );
    });
  });
}

displayClusters(clusters);
