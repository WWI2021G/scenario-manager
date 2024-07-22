import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Stepper, Step, StepLabel } from "@mui/material";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import SideNavbar from "@/components/sub/Sidebar";

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 240;

const steps = [
  { label: "Projekt auswählen", path: "/project-list" },
  { label: "Einflussfaktorenkatalog erstellen", path: "/influencing-factors" },
  { label: "Einflussanalyse", path: "/influence-matrix" },
  { label: "Schlüsselfaktoren aufbereiten", path: "/keyfactors" },
  { label: "Konsistenzanalyse", path: "/consistency-analysis" },
  { label: "Projektionsbündelung", path: "/projection-bundles" },
  { label: "Rohszenario", path: "/rawscenarios" },
];

const subPages = {
  "/influence-matrix": "/influence-matrix/influencing-factors-summary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const currentPath = router.pathname;
    let currentStep = steps.findIndex((step) => step.path === currentPath);
    if (currentStep === -1) {
      for (const [mainPath, subPath] of Object.entries(subPages)) {
        if (currentPath === subPath) {
          currentStep = steps.findIndex((step) => step.path === mainPath);
          break;
        }
      }
      // Check if the current path is a subpage of /raw-scenarios
      if (currentPath.startsWith("/rawscenarios")) {
        currentStep = steps.findIndex((step) => step.path === "/rawscenarios");
      }
    }
    setActiveStep(currentStep === -1 ? 0 : currentStep);
  }, [router.pathname]);

  const handleStepClick = (index: number) => {
    const path = steps[index].path;
    if (path !== "#") {
      router.push(path);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideNavbar />
      <main
        style={{
          flexGrow: 1,
          padding: "24px",
          marginLeft: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step
              key={step.label}
              onClick={() => handleStepClick(index)}
              style={{ cursor: "pointer" }}
            >
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {children}
      </main>
    </div>
  );
}
