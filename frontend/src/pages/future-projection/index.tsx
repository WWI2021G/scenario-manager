import * as React from 'react';
import RootLayout from '@/components/main/RootLayout';
import FutureProjectionForm from "@/components/main/FutureProjectionForm";

const KeyFactorsPage: React.FC = () => {
  return (
    <RootLayout>
      <h1>Future Projections</h1>
      <FutureProjectionForm />
    </RootLayout>
  );
};

export default KeyFactorsPage;
