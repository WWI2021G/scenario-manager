import * as React from 'react';
import Table from '@mui/joy/Table';
import { MoreHoriz } from "@mui/icons-material";
import Link from 'next/link';

function createData(
  pid: number,
  name: string,
  date: string,

) {
  return { pid, name, date };
}

const rows = [
  createData(1, "Projekt Shell", "12.12.2021"),
  createData(2, "Projekt BMW", "14.07.2023"),
  createData(2, "Projekt Festool", "03.04.2024"),
];

export default function TableHover() {
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
          <td><MoreHoriz/></td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}
