import * as React from 'react';
import RootLayout from '@/components/main/RootLayout';
import ConsistencyMatrix from "@/components/main/ConsistencyMatrix";

const ConsistencyMatrixPage: React.FC = () => {
  return (
    <RootLayout>
      <ConsistencyMatrix />
    </RootLayout>
  );
};

export default ConsistencyMatrixPage;
