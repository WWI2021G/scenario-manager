import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { InfluencingFactor } from '@/types';
import Table from '@mui/joy/Table';
import { Box, Button } from '@mui/material';
import RootLayout from "@/components/main/RootLayout";
import { Root } from "postcss";

export default function InfluencingFactorsPage() {
  const [influencingFactors, setInfluencingFactors] = useState<InfluencingFactor[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedFactors = localStorage.getItem('influencingFactors');
    if (storedFactors) {
      setInfluencingFactors(JSON.parse(storedFactors));
    }
  }, []);

  const handleCreate = () => {
    router.push('/influencing-factors/create');
  };

  return (
    <RootLayout>
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mb: 2 }}>
        Create New Influencing Factor
      </Button>
      <Button variant="outlined" color="secondary" sx={{ mb: 2, ml: 2 }}>
        Select from Catalogue
      </Button>
      <Table hoverRow stickyHeader>
        <thead>
        <tr>
          <th style={{ width: '5%' }}>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Variable</th>
          <th>Influencing Areas</th>
        </tr>
        </thead>
        <tbody>
        {influencingFactors.map((factor) => (
          <tr key={factor.id}>
            <td>{factor.id}</td>
            <td>{factor.name}</td>
            <td>{factor.description}</td>
            <td>{factor.variable}</td>
            <td>{factor.influencingArea}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </Box>
    </RootLayout>
  );
}
