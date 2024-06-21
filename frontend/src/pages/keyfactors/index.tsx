import * as React from 'react';
import RootLayout from '@/components/main/RootLayout';
import KeyFactorTable from '@/components/sub/KeyFactorTable';

const KeyFactorsPage: React.FC = () => {
  return (
    <RootLayout>
      <h1>Key Factors</h1>
      <KeyFactorTable />
    </RootLayout>
  );
};

export default KeyFactorsPage;
