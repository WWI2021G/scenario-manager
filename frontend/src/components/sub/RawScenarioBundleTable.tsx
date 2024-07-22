import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { ProjectionBundle } from '@/types';

interface ProjectionBundleTableProps {
  projectionBundles: ProjectionBundle[];
}

const ProjectionBundleTable: React.FC<ProjectionBundleTableProps> = ({ projectionBundles }) => {
  return (
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Projektionsbündel
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Konsistenzwert</TableCell>
              <TableCell>Anzahl partieller Inkonsistenzen</TableCell>
              <TableCell>p-Wert</TableCell>
              <TableCell>Zusammensetzung</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectionBundles.map((bundle) => (
              <TableRow key={bundle.projectionBundle_id}>
                <TableCell>PB-{bundle.projectionBundle_id}</TableCell>
                <TableCell>{bundle.consistency}</TableCell>
                <TableCell>{bundle.numPartInconsistencies}</TableCell>
                <TableCell>{bundle.pValue}</TableCell>
                <TableCell>
                  {bundle.projections.slice(0, 3).map((proj) => proj.name).join(', ')}
                  {bundle.projections.length > 3 && (
                    <span title={bundle.projections.slice(3).map((proj) => proj.name).join(', ')}>...</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectionBundleTable;
