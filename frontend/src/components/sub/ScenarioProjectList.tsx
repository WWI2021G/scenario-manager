// components/ProjectManager.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FilterList } from "@mui/icons-material";
import TableHover from "@/components/sub/ProjectTable";
import ScenarioProjectForm from '@/components/main/ScenarioProjectForm';
import { ScenarioProject } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/router';

const ProjectManager: React.FC = () => {
  const router = useRouter();
  const [user_id, setUser_id] = React.useState<number>();
  const [isProjectListEmpty, setIsProjectListEmpty] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [projects, setProjects] = React.useState<ScenarioProject[]>([]);

  React.useEffect(() => {
    if (typeof window) {
      setUser_id(Number(sessionStorage.getItem("user_id")));
    }
    if (user_id) {
      getProjects(user_id);
    }
  }, [user_id]);

  const getProjects = (userID: number) => {
    axios.get('http://localhost:3001/db/sp/user/' + userID)
      .then(response => {
        setProjects(response.data);
        setIsProjectListEmpty(response.data.length === 0);
      })
      .catch(_error => setIsProjectListEmpty(true));
  };

  const handleCreateProject = () => {
    setShowForm(true);
  };

  const handleSaveProject = (project: ScenarioProject) => {
    if (!user_id) {
      router.push('/');
      console.log("UserID undefined");
      return;
    }
    console.log(project);
    axios.post('http://localhost:3001/db/sp/add', { project, user_id })
      .then(response => {
        console.log(response);
        getProjects(user_id);  // Refresh project list after adding a new project
        setShowForm(false);
      })
      .catch(error => console.error(error));
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

const renderProjectList = (isProjectListEmpty: boolean, handleCreateProject: () => void, projects: ScenarioProject[]) => {
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

export default ProjectManager;
