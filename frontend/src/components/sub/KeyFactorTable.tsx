import React, { useState } from 'react';
import KeyFactorForm from '../main/KeyFactorForm';
import { InfluencingArea, KeyFactor } from '@/types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const KeyFactorTable = () => {
  const [keyFactors, setKeyFactors] = useState<KeyFactor[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddKeyFactor = (newKeyFactor: KeyFactor) => {
    setKeyFactors([...keyFactors, newKeyFactor]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Box>
      {showForm ? (
        <KeyFactorForm onSubmit={handleAddKeyFactor} onCancel={handleCancel} />
      ) : (
        <>
          <Button
            variant="contained"
            className='bg-primary hover:bg-primary-hover'
            onClick={() => setShowForm(true)}
          >
            Add KeyFactor
          </Button>
          <TableContainer component={Paper} className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Current State</TableCell>
                  <TableCell>Influencing Area</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keyFactors.map((keyFactor, index) => (
                  <TableRow key={index}>
                    <TableCell>{keyFactor.title}</TableCell>
                    <TableCell>
                      {keyFactor.description.split(' ').slice(0, 3).join(' ')}...
                    </TableCell>
                    <TableCell>{keyFactor.property}</TableCell>
                    <TableCell>
                      {keyFactor.currentStateDescription
                        .split(' ')
                        .slice(0, 3)
                        .join(' ')}
                      ...
                    </TableCell>
                    <TableCell>{keyFactor.influencingArea}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default KeyFactorTable;
