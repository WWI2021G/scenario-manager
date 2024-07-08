import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FutureProjection, Probability, ProjectionType, KeyFactor } from '@/types';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import axios from 'axios';

const FutureProjectionForm: React.FC = () => {
  const router = useRouter();
  const keyFactor_id: number = parseInt(router.query.keyFactor_id as string);
  const [mainProjection, setMainProjection] = useState<FutureProjection>({
    keyFactor_id: keyFactor_id,
    keyFactor: {} as KeyFactor,
    probability: Probability.LOW,
    projectionType: ProjectionType.TREND,
    timeFrame: new Date(),
    name: '',
    description: ''
  });

  const [alternativeProjection, setAlternativeProjection] = useState<FutureProjection>({
    keyFactor_id: keyFactor_id,
    keyFactor: {} as KeyFactor,
    probability: Probability.LOW,
    projectionType: ProjectionType.TREND,
    timeFrame: new Date(),
    name: '',
    description: ''
  });

  const handleChangeMain = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMainProjection({ ...mainProjection, [name]: value });
  };

  const handleChangeAlternative = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlternativeProjection({ ...alternativeProjection, [name]: value });
  };

  const handleSelectChangeMain = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setMainProjection({ ...mainProjection, [name as string]: value });
  };

  const handleSelectChangeAlternative = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setAlternativeProjection({ ...alternativeProjection, [name as string]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://localhost:3001/db/fp/add", mainProjection)
      .then(response => {
        console.log(response);
      })
      .catch(error => console.error(error));
    axios.post("http://localhost:3001/db/fp/add", alternativeProjection)
      .then(response => {
        console.log(response);
      })
      .catch(error => console.error(error));
    router.push('/keyfactors');
  };

  const handleCancel = () => {
    router.push('/keyfactors');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div className="text-lg font-bold">First Projection</div>
          <TextField
            label="Name"
            name="name"
            value={mainProjection.name}
            onChange={handleChangeMain}
            required
          />
          <TextField
            label="Main Projection Description"
            name="description"
            value={mainProjection.description}
            onChange={handleChangeMain}
            required
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel>Projection Type</InputLabel>
            <Select
              name="projectionType"
              label='Projection Type'
              value={mainProjection.projectionType}
              onChange={handleSelectChangeMain}
              required
            >
              {Object.values(ProjectionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Probability</InputLabel>
            <Select
              name="probability"
              label='Probability'
              value={mainProjection.probability}
              onChange={handleSelectChangeMain}
              required
            >
              {Object.values(Probability).map((prob) => (
                <MenuItem key={prob} value={prob}>
                  {prob}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Time Frame"
            name="timeFrame"
            type="date"
            value={format(mainProjection.timeFrame, 'yyyy-MM-dd')}
            onChange={(e) =>
              setMainProjection({
                ...mainProjection,
                timeFrame: parseISO(e.target.value),
              })
            }
            required
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            margin: "0 auto"
          }}
        >
          <div className="text-lg font-bold">Second Projection</div>
          <TextField
            label="Name"
            name="name"
            value={alternativeProjection.name}
            onChange={handleChangeAlternative}
            required
          />
          <TextField
            label="Alternative Projection Description"
            name="description"
            value={alternativeProjection.description}
            onChange={handleChangeAlternative}
            required
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel>Projection Type</InputLabel>
            <Select
              name="projectionType"
              label="Projection Type"
              value={alternativeProjection.projectionType}
              onChange={handleSelectChangeAlternative}
              required
            >
              {Object.values(ProjectionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Probability</InputLabel>
            <Select
              name="probability"
              label="Probability"
              value={alternativeProjection.probability}
              onChange={handleSelectChangeAlternative}
              required
            >
              {Object.values(Probability).map((prob) => (
                <MenuItem key={prob} value={prob}>
                  {prob}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Time Frame"
            name="timeFrame"
            type="date"
            value={format(alternativeProjection.timeFrame, 'yyyy-MM-dd')}
            onChange={(e) =>
              setAlternativeProjection({
                ...alternativeProjection,
                timeFrame: parseISO(e.target.value)
              })
            }
            required
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "left" }}>
        <Button variant="contained" className='bg-primary hover:bg-primary-hover mr-4' type="submit">
          Add Future Projection
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FutureProjectionForm;
