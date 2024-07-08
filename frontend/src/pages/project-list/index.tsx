// pages/index.tsx
import React from 'react';
import ProjectManager from '@/components/sub/ScenarioProjectList';
import RootLayout from '@/components/main/RootLayout';

const ProjectList: React.FC = () => {
  return (
    <RootLayout>
      <ProjectManager />
    </RootLayout>
  );
};

export default ProjectList;
