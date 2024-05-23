import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Import routes
import scenarioRoutes from './routes/scenario';
app.use('/api/scenario', scenarioRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

