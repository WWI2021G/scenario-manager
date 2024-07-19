import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useRouter } from 'next/router';
import KeyFactorForm from '../main/KeyFactorForm';

const KeyFactorTable = () => {
  const router = useRouter();
  const [scenarioProject_id, setScenarioProject_id] = useState<number>();
  const [keyFactors, setKeyFactors] = useState<KeyFactor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedKeyFactor, setSelectedKeyFactor] = useState<KeyFactor | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const projectID = Number(sessionStorage.getItem("scenarioProject_id"));
      setScenarioProject_id(projectID);
      if (projectID) {
        getProjectKeyFactors(projectID);
      }
    }
  }, [showForm]);

  const getProjectKeyFactors = (scenarioProjectID: number) => {
    axios.get('http://localhost:3001/db/kf/sp/' + scenarioProjectID)
      .then(response => {
        console.log(response.data);
        setKeyFactors(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleAddKeyFactor = (newKeyFactor: KeyFactor) => {
    if (selectedKeyFactor) {
      setKeyFactors(
        keyFactors.map((kf) =>
          kf.id === newKeyFactor.id ? newKeyFactor : kf
        )
      );
    } else {
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
          <TableContainer component={Paper} className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Property 1</TableCell>
                  <TableCell>Property 2</TableCell>
                  <TableCell>Current State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keyFactors.map((keyFactor) => (
                  <TableRow key={keyFactor.id}>
                    <TableCell>
                      <Button onClick={() => handleEditKeyFactor(keyFactor)}>
                        {keyFactor.name}
                      </Button>
                    </TableCell>
                    <TableCell>{keyFactor.prop_one}</TableCell>
                    <TableCell>{keyFactor.prop_two}</TableCell>
                    <TableCell>
                      {keyFactor.curState ? (
                        keyFactor.curState
                          .split(' ')
                          .slice(0, 3)
                          .join(' ')) : ('')}
                      {keyFactor.curState && ' ...'}
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
