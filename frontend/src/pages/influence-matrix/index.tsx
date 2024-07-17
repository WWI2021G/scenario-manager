import React from 'react';
import { useRouter } from 'next/router';
import InfluencMatrixComponent from '@/components/main/InfluencingMatrix';
import RootLayout from '@/components/main/RootLayout'

const App: React.FC = () => {
  const router = useRouter();

  return (
    <RootLayout>
      <InfluencMatrixComponent  />
    </RootLayout>
  );
};

export default App;

