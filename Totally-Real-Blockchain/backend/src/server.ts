// src/server.ts
import express from 'express';
import cors from 'cors';
import coinRoutes from './routes/coins.ts';
import playerRoutes from './routes/players.ts';  // Import player routes
import walletsRoutes from './routes/wallets.ts';
import { setupDatabase } from './db-setup.ts';
import { swaggerUi, specs } from './swagger.ts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);  // Convert to number

setupDatabase();

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Use the coin routes for the /coins endpoint
app.use('/coins', coinRoutes);

// Use the player routes for the /players endpoint
app.use('/players', playerRoutes);  // Add player routes here

app.use('/wallets', walletsRoutes);

// Listen on all interfaces (0.0.0.0) to allow access from other devices in the local network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
