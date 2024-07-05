import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FutureProjection, KeyFactor, Probability, ProjectionType } from '@/types';
import { format, parseISO } from 'date-fns';

const placeholderKeyFactor: KeyFactor = {
  id: 0,
  title: '',
  description: '',
  property: '',
  currentStateDescription: '',
  projectionA: undefined,
  projectionB: undefined,
};

const FutureProjectionForm: React.FC = () => {
  const [mainProjection, setMainProjection] = useState<FutureProjection>({
    keyFactor: placeholderKeyFactor,
    probability: Probability.LOW,
    projectionType: ProjectionType.TREND,
    timeFrame: new Date(),
    id: 0,
    name: '',
    projectionDescription: ''
  });

  const [alternativeProjection, setAlternativeProjection] = useState<FutureProjection>({
    keyFactor: placeholderKeyFactor,
    probability: Probability.LOW,
    projectionType: ProjectionType.TREND,
    timeFrame: new Date(),
    id: 0,
    name: '',
    projectionDescription: ''
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
    // Placeholder function for submit
    console.log('Main Projection submitted', mainProjection);
    console.log('Alternative Projection submitted', alternativeProjection);
  };

  const handleCancel = () => {
    // Placeholder function for cancel
    console.log('Form canceled');
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
            name="projectionDescription"
            value={mainProjection.projectionDescription}
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
            name="projectionDescription"
            value={alternativeProjection.projectionDescription}
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
