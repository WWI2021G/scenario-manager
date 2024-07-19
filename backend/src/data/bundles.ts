import { KeyFactor, FutureProjection, Probability, ProjectionType, ProjectionBundle } from '../models';

// Step 1: Create KeyFactors
const keyFactors: KeyFactor[] = [];
for (let i = 1; i <= 10; i++) {
  keyFactors.push(new KeyFactor(`KeyFactor ${i}`, `Current State of KeyFactor ${i}`));
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
      j === 1 ? ProjectionType.TREND : ProjectionType.EXTREME
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
    const projectionsForKeyFactor = futureProjections.filter(fp => fp.getKeyFactor() === keyFactor);
    bundle.addProjection(projectionsForKeyFactor[i % 2]); // Alternate between the two projections for the key factor
  });
  projectionBundles.push(bundle);
}

// Function to display the structure of the bundles
export const displayBundles = (bundles: ProjectionBundle[]) => {
  bundles.forEach((bundle, index) => {
    console.log(`Projection Bundle ${index + 1}:`);
    bundle.getProjections().forEach(fp => {
      console.log(`  - ${fp.getName()}: ${fp.getDescription()}`);
    });
  });
};

// Export the bundles and the display function
export { keyFactors, futureProjections, projectionBundles };
