// src/server.ts
import express from 'express';
import cors from 'cors';
import coinRoutes from './routes/coins.ts';
import playerRoutes from './routes/players.ts';  // Import player routes
import { execSync } from 'child_process';
import { setupDatabase } from './db-setup.ts';

const app = express();
const PORT = process.env.PORT || 8080;

setupDatabase();

app.use(cors());
app.use(express.json());

// Use the coin routes for the /coins endpoint
app.use('/coins', coinRoutes);

// Use the player routes for the /players endpoint
app.use('/players', playerRoutes);  // Add player routes here

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});