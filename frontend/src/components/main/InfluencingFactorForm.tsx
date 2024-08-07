import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { InfluencingFactor } from "@/types";

interface InfluencingFactorFormProps {
  initialData?: InfluencingFactor;
  scenarioProjectId: number;
  onSubmit: (influencingFactor: InfluencingFactor) => void;
}

const InfluencingFactorForm: React.FC<InfluencingFactorFormProps> = ({
  initialData,
  scenarioProjectId,
  onSubmit,
}) => {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>(
    initialData || {
      name: "",
      description: "",
      activeSum: 0,
      passiveSum: 0,
    },
  );

  const [influencingFactorsList, setInfluencingFactorsList] = useState<
    InfluencingFactor[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { value: unknown }
    >,
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | { name: string; value: unknown };
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfluencingFactorsList([
      ...influencingFactorsList,
      { ...influencingFactor },
    ]);
    setInfluencingFactor({
      name: "",
      description: "",
      activeSum: 0,
      passiveSum: 0,
    });
  };

  return (
    <Box sx={{ width: "50%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {initialData
          ? "Edit Influencing Factor"
          : "Create New Influencing Factor"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={influencingFactor.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Description"
          name="description"
          value={influencingFactor.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save Influencing Factor
        </Button>
      </form>
    </Box>
  );
};

export default InfluencingFactorForm;
