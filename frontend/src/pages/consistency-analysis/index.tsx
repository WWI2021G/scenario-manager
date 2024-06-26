import * as React from 'react';
import RootLayout from '@/components/main/RootLayout';
import ConsistencyMatrix from "@/components/main/ConsistencyMatrix";

const ConsistencyMatrixPage: React.FC = () => {
  return (
    <RootLayout>
      <h1 className='text-3xl font-bold my-4'>Konsistenzmatrix</h1>
      <ConsistencyMatrix />
    </RootLayout>
  );
};

export default ConsistencyMatrixPage;
