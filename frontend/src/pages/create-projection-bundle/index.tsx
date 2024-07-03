// pages/create-projection-bundle.tsx
import React from "react";
import FutureProjectionSelection from "@/components/sub/FutureProjectionSelection";
import RootLayout from "@/components/main/RootLayout";

const CreateProjectionBundlePage: React.FC = () => {
  return (
    <RootLayout>
      <FutureProjectionSelection />
    </RootLayout>
  );
};

export default CreateProjectionBundlePage;
