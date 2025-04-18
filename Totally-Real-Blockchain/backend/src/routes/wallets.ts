import express from 'express';
import { createWallet, getUserById, getWalletWithCoinBalances } from '../data/userdatabase.ts';
import bcrypt from 'bcrypt'; 

const router = express.Router();

router.post('/create', async (req, res) => {
  const { userId, password, amount = 0 } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: 'userId and password are required' });
  }

  try {
    // Fetch the user by userId
    const user = getUserById(userId);  // Make sure `userId` is consistent type
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if wallet already exists
    const existingWallet = getWalletWithCoinBalances(userId);
    if (existingWallet) {
      return res.status(409).json({ message: 'Wallet already exists for this user' });
    }

    // Create the wallet
    createWallet(userId, amount);

    res.status(201).json({ message: 'Wallet entry created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create wallet' });
  }
});  

router.post('/get', async (req, res) => {
    const { userId, password } = req.body;

    // Validate input
    if (!userId || !password) {
        return res.status(400).json({ message: 'userId and password are required' });
    }

    try {
        // Check if the user exists and validate password
        const user = getUserById(userId);  // Fetch the user by userId
        
        console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Fetch the user's wallet
        const wallet = getWalletWithCoinBalances(userId);
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Respond with wallet details
        res.status(200).json({ message: 'Wallet retrieved successfully', wallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve wallet' });
    }
});


export default router;
