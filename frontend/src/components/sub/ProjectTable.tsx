"use client";
import * as React from "react";
import Table from "@mui/joy/Table";
import { MoreHoriz } from "@mui/icons-material";
import Link from "next/link";
import { ScenarioProject } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ProjectTableProps {
  projects: ScenarioProject[];
}

function createData(pid: number, name: string, date: string) {
  return { pid, name, date };
}

export default function TableHover({ projects }: ProjectTableProps) {
  const router = useRouter();

  const handleRowClick = (project: ScenarioProject) => {
    console.log(project);
    axios
      .post("http://localhost:3001/db/spid", {
        name: project.name,
        description: project.description,
        scenarioType: project.scenarioType,
        user: project.user,
      })
      .then((response) => {
        sessionStorage.setItem(
          "scenarioProject_id",
          response.data.scenarioProject_id,
        );
        sessionStorage.setItem("scenarioProject_name", project.name);
        router.push("/influencing-factors");
      })
      .catch((error) => console.error(error));
  };

  const rows = projects.map((project, index) =>
    createData(index + 1, project.name, new Date().toLocaleDateString()),
  );

  return (
    <Table hoverRow stickyHeader>
      <thead>
        <tr>
          <th style={{ width: "5%" }}>PID</th>
          <th>Projekttitel</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.name}
            onClick={() => handleRowClick(projects[row.pid - 1])}
          >
            <td>{row.pid}</td>
            <td className="underline">
              <Link href="">{row.name}</Link>
            </td>
            <td>{row.date}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
