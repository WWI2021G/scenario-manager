import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { InfluencingFactor } from '@/types';
import Table from '@mui/joy/Table';
import { Box, Button } from '@mui/material';
import RootLayout from "@/components/main/RootLayout";
import axios from 'axios';

export default function InfluencingFactorsPage() {
  const [currentSelectedProject, setCurrentSelectedProject] = useState<number>();
  const [influencingFactors, setInfluencingFactors] = useState<InfluencingFactor[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window) {
      setCurrentSelectedProject(Number(sessionStorage.getItem("scenarioProject_id")));
    }
    if (currentSelectedProject) {
      getProjectInfluencingFactors(currentSelectedProject);
    }
  }, [currentSelectedProject]);

  const getProjectInfluencingFactors = (scenarioProjectID: number) => {
    axios.get('http://localhost:3001/db/if/sp/' + scenarioProjectID)
      .then(response => {
        setInfluencingFactors(response.data)
        console.log(response.data)
      })
      .catch(error => console.error(error));
  };

  const handleCreate = () => {
    router.push('/influencing-factors/create');
  };

  const handleDone = () => {
    router.push('/influence-matrix');
  };

  return (
    <RootLayout>
      <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
        <h1 className='text-3xl my-4 font-bold'>Einflussfaktorenliste</h1>
        <h2 className='text-lg my-2'>{currentSelectedProject}</h2>
        <Button variant="contained" className={'bg-primary hover:bg-primary-hover'} onClick={handleCreate} sx={{ mb: 2 }}>
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
            </tr>
          </thead>
          <tbody>
            {influencingFactors.map((factor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{factor.name}</td>
                <td>{factor.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="contained" className={'bg-primary hover:bg-primary-hover'} onClick={handleDone} sx={{ mb: 2 }}>
          All InfluencingFactors added
        </Button>
      </Box>
    </RootLayout>
  );
}
