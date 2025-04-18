// src/routes/coins.ts
import express from 'express';
import { addCoin, getAllCoins, getUserCoins, getCoinsForWallet } from '../data/coinbase.ts';  // Importing functions from the database module

const router = express.Router();

// GET /coins - Get all coins
router.get('/get', async (req, res) => {
  try {
    const coins = getAllCoins();  // Fetch all coins from the database

    // Check if no coins are found
    if (coins.length === 0) {
      return res.status(404).json({ message: 'No coins found' });
    }

    res.status(200).json(coins);  // Return all coins
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve coins' });
  }
});

/**
 * @swagger
 * /coins/create:
 *   post:
 *     summary: Create a new coin
 *     tags:
 *       - Coins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the coin
 *               value:
 *                 type: number
 *                 description: The value of the coin (e.g., price or amount)
 *               volatility:
 *                 type: number
 *                 description: The volatility of the coin (could be a percentage or any measure of volatility)
 *               creatorWallet:
 *                 type: string
 *                 description: The wallet of the creator (user who is creating the coin)
 *             required:
 *               - name
 *               - value
 *               - volatility
 *               - creatorWallet
 *     responses:
 *       201:
 *         description: Coin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coin created successfully"
 *                 coin:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Bitcoin"
 *                     creatorWallet:
 *                       type: string
 *                       example: "user-wallet-12345"
 *                     value:
 *                       type: number
 *                       example: 50000
 *                     volatility:
 *                       type: number
 *                       example: 5
 *       400:
 *         description: Missing required fields (name, value, volatility, creatorWallet)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields (name, value, volatility, creatorWallet)"
 *       500:
 *         description: Failed to create coin due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create coin"
*/

// POST /coins/create - Create a new coin
router.post('/create', async (req, res) => {
  const { name, value, volatility, creatorWallet } = req.body;

  // Validate required fields
  if (!name || !value || !volatility || !creatorWallet) {
    return res.status(400).json({ message: 'Missing required fields (name, value, volatility, creatorWallet)' });
  }

  try {
    // Add coin to the database
    addCoin(name, creatorWallet, value, volatility);

    // Respond with success
    res.status(201).json({
      message: 'Coin created successfully',
      coin: { name, creatorWallet, value, volatility },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create coin' });
  }
});

// GET /coins/:userId - Get coins by user wallet
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch coins associated with the user
    const coins = getUserCoins(userId);

    // If no coins are found, return a 404
    if (coins.length === 0) {
      return res.status(404).json({ message: 'No coins found for this user' });
    }

    // Respond with the user's coins
    res.status(200).json(coins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve coins' });
  }
});

// POST /wallets/:walletId/coins - Get all coins associated with a wallet
router.post('/:walletId/coins', async (req, res) => {
  const { walletId } = req.params;  // Get the wallet ID from the URL parameter

  if (!walletId) {
    return res.status(400).json({ message: 'Wallet ID is required' });
  }

  try {
    // Fetch the coins associated with the wallet
    const coins = getCoinsForWallet(parseInt(walletId));  // Ensure walletId is an integer

    // Check if any coins are found
    if (coins.length === 0) {
      return res.status(404).json({ message: 'No coins found for this wallet' });
    }

    // Respond with the coins and their amounts
    res.status(200).json({ coins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve coins for this wallet' });
  }
});

export default router;