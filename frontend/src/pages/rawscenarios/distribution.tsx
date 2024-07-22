import react from "react";
import DistributionOverview from "@/components/main/DistributionOverview";
import RootLayout from "@/components/main/RootLayout";

const DistributionPage: React.FC = () => {
  return (
    <RootLayout>
      <DistributionOverview />
    </RootLayout>
  );
};

export default DistributionPage;
