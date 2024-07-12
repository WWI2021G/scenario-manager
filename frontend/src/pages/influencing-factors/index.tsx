import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { InfluencingFactor } from '@/types';
import Table from '@mui/joy/Table';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import RootLayout from "@/components/main/RootLayout";
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InfluencingFactorsPage() {
  const [currentSelectedProject, setCurrentSelectedProject] = useState<number>();
  const [influencingFactors, setInfluencingFactors] = useState<InfluencingFactor[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFactor, setSelectedFactor] = useState<InfluencingFactor | null>(null);
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
    axios.get(`http://localhost:3001/db/if/sp/${scenarioProjectID}`)
      .then(response => {
        setInfluencingFactors(response.data)
      })
      .catch(error => console.error(error));
  };

  const handleCreate = () => {
    router.push('/influencing-factors/create');
  };

  const handleDone = () => {
    router.push('/influence-matrix');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, factor: InfluencingFactor) => {
    setAnchorEl(event.currentTarget);
    setSelectedFactor(factor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFactor(null);
  };

  const handleEdit = () => {
    if (selectedFactor) {
      router.push(`/influencing-factors/edit/${selectedFactor.name}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedFactor && currentSelectedProject) {
      axios.delete(`http://localhost:3001/db/if/${selectedFactor.name}`)
        .then(() => {
          getProjectInfluencingFactors(currentSelectedProject);
        })
        .catch(error => console.error(error));
    }
    handleMenuClose();
  };
  return (
    <RootLayout>
      <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
        <h1 className='text-3xl my-4 font-bold'>Einflussfaktorenliste</h1>
        <h2 className='text-lg my-2'>Aktuelles Projekt: {sessionStorage.getItem("scenarioProject_name")}</h2>
        <Button variant="contained" className={'bg-primary hover:bg-primary-hover'} onClick={handleCreate} sx={{ mb: 2 }}>
          Create New Influencing Factor
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mb: 2, ml: 2 }}>
          Select from Catalogue
        </Button>
        <Button variant="contained" className={'bg-primary hover:bg-primary-hover'} onClick={handleDone} sx={{ mb: 2, ml: 2 }}>
          All Influencing Factors added
        </Button>
        <Table hoverRow stickyHeader>
          <thead>
            <tr>
              <th style={{ width: '5%' }}></th>
              <th style={{ width: '5%' }}>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {influencingFactors.map((factor, index) => (
              <tr key={index}>
                <td>
                  <IconButton
                    aria-controls={`menu-${index}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, factor)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`menu-${index}`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>
                      <EditIcon fontSize="small" />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <DeleteIcon fontSize="small" />
                      Delete
                    </MenuItem>
                  </Menu>
                </td>
                <td>{index + 1}</td>
                <td>{factor.name}</td>
                <td>{factor.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </RootLayout>
  );
}
