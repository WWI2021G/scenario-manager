import React from 'react';
import RootLayout from '@/components/main/RootLayout';
import RawScenariosTable from '@/components/sub/RawScenarioTable';

const RawScenariosPage: React.FC = () => {
  return (
    <RootLayout>
      <RawScenariosTable />
    </RootLayout>
  );
};

export default RawScenariosPage;
