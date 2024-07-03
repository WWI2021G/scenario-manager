// pages/projection-bundles.tsx
import React from 'react';
import ProjectionBundleTable from '@/components/sub/ProjectionBundleTable';
import RootLayout from '@/components/main/RootLayout';

const ProjectionBundlesPage: React.FC = () => {
  return (
    <RootLayout>
      <ProjectionBundleTable />
    </RootLayout>
  );
};

export default ProjectionBundlesPage;
