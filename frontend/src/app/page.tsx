import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FilterList } from "@mui/icons-material";

export default function Home() {
  return (
    <>
      <div className="font-bold text-md">Vorhandene Projekte</div>
      <div className="flex flex-row">
        {/*TODO: Change TextField to Autocomplete and add filter*/}
        <TextField className="my-4 w-[400px]" label="Suche Projekt" variant="outlined" />
        <Button className="text-black my-4 mx-2 w-40 justify-center border-gray-400" variant={"outlined"} startIcon={<FilterList/>}>Filter</Button>
      </div>
      <Box sx={{ display: "flex", }}>
        <Box

          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginLeft: `5px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div className="flex flex-col items-center justify-center mt-40">
            <h1 className="flex justify-center text-6xl font-bold text-[#5046e5]">Keine Projekte vorhanden</h1>
            <h3 className="flex justify-center m-4 text-2xl font-bold text-stone-400">Erstellen sie ihr erstes Projekt</h3>
            <Button className="bg-[#5046e5] text-white m-8 w-40 justify-center hover:bg-[#4438ca]" >Erstelle neues Projekt</Button>
          </div>
        </Box>
      </Box></>
  );
}
