import React from 'react';
import InfluencingFactorForm from '../../components/demoInfluencingFacotor';
import Box from "@mui/joy/Box";
import TableHover from "../../components/sub/ProjectTable";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FilterList } from "@mui/icons-material";

const Home: React.FC = () => {
  return (
    <>
      <div className="font-bold text-md">Vorhandene Projekte</div>
      <div className="flex flex-row">
        {/*TODO: Change TextField to Autocomplete and add filter*/}
        <TextField className="my-4 w-[400px]" label="Suche Projekt" variant="outlined" />
        <Button className="text-black my-4 mx-2 w-40 justify-center border-gray-400" variant={"outlined"}
                startIcon={<FilterList />}>Filter</Button>
      </div>

  <Box className='flex'>
    <TableHover />
  </Box>
    </>
)
  ;
};

export default Home;
