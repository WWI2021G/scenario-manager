"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import { useRouter, usePathname } from "next/navigation";
import Search from "@mui/icons-material/Search";
import {
  BackupTable,
  Checklist,
  CollectionsBookmark,
  ExitToApp,
  FormatListBulleted,
  PermMedia,
  SsidChart,
  StackedBarChart,
  TableChart,
} from "@mui/icons-material";

const drawerWidth = 240;

const SideNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        width: drawerWidth,
        height: "100vh",
        bgcolor: "#5046e5",
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        borderRight: "2px solid #e0e0e0",
        color: "white",
      }}
    >
      <div className="m-4 font-bold text-xl">
        <SsidChart /> Szenario-App
      </div>
      <List>
        {[
          { text: "Startseite", icon: <HomeIcon />, path: "/project-list" },
          {
            text: "Einflussfaktoren",
            icon: <FormatListBulleted />,
            path: "/influencing-factors",
          },
          {
            text: "Schlüsselfaktoren",
            icon: <Checklist />,
            path: "/keyfactors",
          },
          {
            text: "Bündel",
            icon: <StackedBarChart />,
            path: "/projection-bundles",
          },
          { text: "Rohszenarien", icon: <TableChart />, path: "/rawscenarios" },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              className={`m-2 rounded-md ${pathname === item.path ? "bg-[#4438ca]" : "hover:bg-[#4438ca]"}`}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <hr className="border-t-2 border-white p-2" />
      <ListItem disablePadding className="position-bottom">
        <ListItemButton
          className={`m-2 rounded-md hover:bg-[#4438ca]`}
          onClick={() => handleNavigation("/")}
        >
          <ListItemIcon className="text-white">
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default SideNavbar;
