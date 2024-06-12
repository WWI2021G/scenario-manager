import * as React from 'react';
import Table from '@mui/joy/Table';
import { MoreHoriz } from "@mui/icons-material";
import Link from 'next/link';
import { ScenarioProject } from '@/types';

interface ProjectTableProps {
  projects: ScenarioProject[];
}

function createData(
  pid: number,
  name: string,
  date: string,
) {
  return { pid, name, date };
}

export default function TableHover({ projects }: ProjectTableProps) {
  const rows = projects.map((project, index) => createData(index + 1, project.name, new Date().toLocaleDateString()));

  return (
    <Table hoverRow stickyHeader>
      <thead>
      <tr>
        <th style={{ width: '5%' }}>PID</th>
        <th>Projekttitel</th>
        <th>Datum</th>
        <th style={{ width: '5%' }}></th>
      </tr>
      </thead>
      <tbody>
      {rows.map((row) => (
        <tr key={row.pid}>
          <td>{row.pid}</td>
          <td className="underline"><Link href="">{row.name}</Link></td>
          <td>{row.date}</td>
          <td><MoreHoriz /></td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}
