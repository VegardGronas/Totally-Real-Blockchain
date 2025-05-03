// src/routes/coins.ts
import express from 'express';
import { addCoin, getAllCoins } from '../data/database.ts';  // Importing functions from the database module

const router = express.Router();

// GET /coins - Get all coins
router.get('/', (req, res) => {
  const coins = getAllCoins();  // Using the function to get all coins from the database
  res.json(coins);
});

// POST /coins - Create a new coin
router.post('/', (req, res) => {
  const { name, creator, value, volatility } = req.body;  // Get data from the request body

  // Add the new coin to the database
  addCoin(name, creator, value, volatility);

  res.status(201).json({ message: 'Coin created successfully!' });
});

export default router;