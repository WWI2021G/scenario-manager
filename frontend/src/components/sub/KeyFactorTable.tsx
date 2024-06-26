import React, { useState } from 'react';
import KeyFactorForm from '../main/KeyFactorForm';
import { KeyFactor } from '@/types';
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
  const [selectedKeyFactor, setSelectedKeyFactor] = useState<KeyFactor | null>(null);

  const handleAddKeyFactor = (newKeyFactor: KeyFactor) => {
    if (selectedKeyFactor) {
      // Update existing key factor
      setKeyFactors(
        keyFactors.map((kf) =>
          kf.id === newKeyFactor.id ? newKeyFactor : kf
        )
      );
    } else {
      // Add new key factor
      setKeyFactors([...keyFactors, { ...newKeyFactor, id: keyFactors.length + 1 }]);
    }
    setShowForm(false);
    setSelectedKeyFactor(null);
  };

  const handleEditKeyFactor = (keyFactor: KeyFactor) => {
    setSelectedKeyFactor(keyFactor);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedKeyFactor(null);
  };

  return (
    <Box>
      {showForm ? (
        <KeyFactorForm
          onSubmit={handleAddKeyFactor}
          onCancel={handleCancel}
          initialData={selectedKeyFactor}
        />
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
                </TableRow>
              </TableHead>
              <TableBody>
                {keyFactors.map((keyFactor) => (
                  <TableRow key={keyFactor.id}>
                    <TableCell>
                      <Button onClick={() => handleEditKeyFactor(keyFactor)}>
                        {keyFactor.title}
                      </Button>
                    </TableCell>
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
