import * as React from "react";
import RootLayout from "@/components/main/RootLayout";
import KeyFactorTable from "@/components/sub/KeyFactorTable";
import Box from "@mui/joy/Box";
import Button from "@mui/material/Button";
import router from "next/router";

const KeyFactorsPage: React.FC = () => {
  const handleDone = () => {
    router.push("/consistency-analysis");
  };

  return (
    <RootLayout>
      <h1 className="text-3xl my-4 font-bold">Schlüsselfaktoren</h1>
      <Box sx={{ width: "100%", margin: "0 auto", mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleDone} sx={{mb:2}}>
          Konsistenzmatrix
        </Button>
      </Box>
      <KeyFactorTable />
    </RootLayout>
  );
};

export default KeyFactorsPage;
