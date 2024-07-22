import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { KeyFactor } from '@/types';
import axios from 'axios';

interface KeyFactorFormProps {
  onSubmit: (keyFactor: KeyFactor) => void;
  onCancel: () => void;
  initialData?: KeyFactor | null;
}

const KeyFactorForm: React.FC<KeyFactorFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const router = useRouter();
  const [keyFactor, setKeyFactor] = useState<KeyFactor>({
    id: 0,
    name: '',
    prop_one: '',
    prop_two: '',
    curState: '',
    projectionA: undefined,
    projectionB: undefined,
  });
  const [futureProjectionsExist, setFutureProjectionsExist] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setKeyFactor(initialData);
      fetchFutureProjections();
    }
  }, [initialData]);

  const fetchFutureProjections = async () => {
    try {
      if(!initialData) return;
      const keyFactor_id = await axios.post("http://localhost:3001/db/kfid", { "name": initialData.name, "cur_state": initialData.curState })
      const futureProjections = await axios.get(`http://localhost:3001/db/fp/kf/${keyFactor_id.data.keyFactor_id}`);
      if (futureProjections.data.length > 0) {
        setFutureProjectionsExist(true);
      }
  } catch (error) {
    console.error('Error fetching future projections:', error);
  };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeyFactor({ ...keyFactor, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const keyFactor_name: string = keyFactor.name;
    const keyFactor_curState: string = keyFactor.curState;
    let keyFactor_id = undefined;
    await axios.post("http://localhost:3001/db/kfid", { "name": keyFactor_name, "cur_state": keyFactor_curState })
      .then(response => {
        keyFactor_id = response.data.keyFactor_id;
      })
      .catch(error => console.error(error));
    const prop_one = keyFactor.prop_one;
    const prop_two = keyFactor.prop_two;
    const curState = keyFactor.curState;
    await axios.post("http://localhost:3001/db/kf/prop1/update", { keyFactor_id, prop_one }).catch(error => console.error(error));
    await axios.post("http://localhost:3001/db/kf/prop2/update", { keyFactor_id, prop_two }).catch(error => console.error(error));
    await axios.post("http://localhost:3001/db/kf/cstate", { "name": keyFactor_name, "cur_state": curState }).catch(error => console.error(error));
    onSubmit(keyFactor);
  };

  const onAddFP = async () => {
    const keyFactor_name: string = keyFactor.name;
    const keyFactor_curState: string = keyFactor.curState;
    let keyFactor_id = undefined;
    await axios.post("http://localhost:3001/db/kfid", { "name": keyFactor_name, "cur_state": keyFactor_curState })
      .then(response => {
        keyFactor_id = response.data.keyFactor_id;
      })
      .catch(error => console.error(error));
    router.push({ pathname: '/future-projection', query: { keyFactor_id: keyFactor_id }, });
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
      <TextField
        label="Name"
        name="name"
        value={keyFactor.name}
        InputProps={{ readOnly: true, }}
      />
      <TextField
        label="Merkmal 1"
        name="prop_one"
        value={keyFactor.prop_one}
        onChange={handleChange}
        required
      />
      <TextField
        label="Merkmal 2"
        name="prop_two"
        value={keyFactor.prop_two}
        onChange={handleChange}
        required
      />
      <TextField
        label="Beschreibung des Ist-Zustands"
        name="curState"
        value={keyFactor.curState}
        onChange={handleChange}
        required
        multiline
        rows={4}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" type="submit">
          {initialData ? 'Schlüsselfaktor aktualisieren' : 'Schlüsselfaktor hinzufügen'}
        </Button>
        <Button variant="contained" color="primary" onClick={onAddFP}>
          {futureProjectionsExist ? 'Projektionen aktualisieren' : 'Projektionen hinzufügen'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
      </Box>
    </Box>
  );
};

export default KeyFactorForm;

