import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FutureProjection, Probability, ProjectionType, KeyFactor } from '@/types';
import { format, parseISO, isValid } from 'date-fns';
import { useRouter } from 'next/router';
import axios from 'axios';

const FutureProjectionForm: React.FC = () => {
  const router = useRouter();
  const keyFactor_id: number = parseInt(router.query.keyFactor_id as string);
  const defaultFutureProjection: FutureProjection = {
    keyFactor_id: keyFactor_id,
    keyFactor: {} as KeyFactor,
    probability: Probability.LOW,
    projectionType: ProjectionType.TREND,
    timeFrame: new Date(),
    name: '',
    description: ''
  };

  const [mainProjection, setMainProjection] = useState<FutureProjection>(defaultFutureProjection);
  const [alternativeProjection, setAlternativeProjection] = useState<FutureProjection>(defaultFutureProjection);
  const [futureProjectionsExist, setFutureProjectionsExist] = useState<boolean>(false);

  useEffect(() => {
    fetchFutureProjections();
  }, []);

  const fetchFutureProjections = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/db/fp/kf/${keyFactor_id}`);
      if (response.data.length > 0) {
        setFutureProjectionsExist(true);
        setMainProjection(response.data[0]);
        if (response.data.length > 1) {
          setAlternativeProjection(response.data[1]);
        }
      }
    } catch (error) {
      console.error('Error fetching future projections:', error);
    }
  };

  const handleChangeMain = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMainProjection(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeAlternative = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlternativeProjection(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChangeMain = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setMainProjection(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChangeAlternative = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setAlternativeProjection(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/db/fp/add", mainProjection);
      await axios.post("http://localhost:3001/db/fp/add", alternativeProjection);
      router.push(`/keyfactors/`);
    } catch (error) {
      console.error('Error submitting future projections:', error);
    }
  };

  const handleCancel = () => {
    router.push(`/keyfactor/edit/${keyFactor_id}`);
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
              value={mainProjection.projectionType || ProjectionType.TREND}
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
              value={mainProjection.probability || Probability.LOW}
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
            value={isValid(new Date(mainProjection.timeFrame)) ? format(new Date(mainProjection.timeFrame), 'yyyy-MM-dd') : ''}
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
              value={alternativeProjection.projectionType || ProjectionType.TREND}
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
              value={alternativeProjection.probability || Probability.LOW}
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
            value={isValid(new Date(alternativeProjection.timeFrame)) ? format(new Date(alternativeProjection.timeFrame), 'yyyy-MM-dd') : ''}
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
          {futureProjectionsExist ? 'Update Future Projections' : 'Add Future Projections'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FutureProjectionForm;
