"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FilterList } from "@mui/icons-material";
import TableHover from "@/components/sub/ProjectTable";
import ScenarioProjectForm from '../components/main/ScenarioProjectForm';
import { ScenarioProject } from '@/types';


export default function Home() {
  const [isProjectListEmpty, setIsProjectListEmpty] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [projects, setProjects] = React.useState<ScenarioProject[]>([]);

  const handleCreateProject = () => {
    setShowForm(true);
  };

  const handleSaveProject = (project: ScenarioProject) => {
    setProjects([...projects, project]);
    setShowForm(false);
    setIsProjectListEmpty(false);
  };

  return (
    <>
      <div className="font-bold text-3xl">Vorhandene Projekte</div>
      <div className="flex flex-row">
        <TextField className="my-4 w-[400px]" label="Suche Projekt" variant="outlined" />
        <Button className="text-black my-4 mx-2 w-40 justify-center border-gray-400" variant={"outlined"}
                startIcon={<FilterList />}>Filter</Button>
      </div>
      {showForm ? (
        <ScenarioProjectForm onSave={handleSaveProject} />
      ) : (
        renderProjectList(isProjectListEmpty, handleCreateProject, projects)
      )}
    </>
  );
}

function renderProjectList(isProjectListEmpty: boolean, handleCreateProject: () => void, projects: ScenarioProject[]) {
  if (isProjectListEmpty) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <h1 className="flex justify-center text-6xl font-bold text-[#5046e5]">Keine Projekte vorhanden</h1>
        <h3 className="flex justify-center m-4 text-2xl font-bold text-stone-400">Erstellen Sie Ihr erstes Projekt</h3>
        <Button
          className="bg-[#5046e5] text-white m-8 w-40 justify-center hover:bg-[#4438ca]"
          onClick={handleCreateProject}
        >
          Erstelle neues Projekt
        </Button>
      </div>
    );
  } else {
    return (
      <Box className='flex flex-col'>
        <TableHover projects={projects} />
        <Button
          className="bg-[#5046e5] text-white my-8 w-40 justify-center hover:bg-[#4438ca]"
          onClick={handleCreateProject}
        >
          Erstelle neues Projekt
        </Button>
      </Box>
    );
  }
}
