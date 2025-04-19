import express from 'express';
import { createWallet, getUserById, getWalletWithCoinBalances, getUserByUserName } from '../data/userdatabase.ts';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @swagger
 * /wallets/create:
 *   post:
 *     summary: Create a wallet for a user
 *     description: Creates a wallet for the user after validating the user credentials and checking if a wallet already exists.
 *     tags:
 *       - wallets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: '12345'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *               amount:
 *                 type: number
 *                 example: 1000
 *                 description: The initial amount in the wallet (optional, default is 0)
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Wallet entry created successfully'
 *       400:
 *         description: Missing userId or password
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid password
 *       409:
 *         description: Wallet already exists for this user
 *       500:
 *         description: Failed to create wallet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to create wallet'
 */


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

/**
 * @swagger
 * /wallets/get:
 *   get:
 *     summary: Get the user's wallet
 *     description: Retrieves the wallet for the authenticated user using the provided JWT token in the authorization header.
 *     tags:
 *       - wallets
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Wallet retrieved successfully'
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     wallet_id:
 *                       type: string
 *                       example: 'abc123xyz'
 *                     userName:
 *                       type: string
 *                       example: 'johnDoe'
 *                     amount:
 *                       type: number
 *                       example: 1000
 *                     createdAt:
 *                       type: string
 *                       example: '2025-05-04T12:00:00Z'
 *       401:
 *         description: No token provided or token is invalid
 *       404:
 *         description: User or wallet not found
 *       500:
 *         description: Failed to retrieve wallet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to retrieve wallet'
 */


router.get('/get', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; userName: string };  
    const user = getUserByUserName(decoded.userName);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const wallet = getWalletWithCoinBalances(user.userName);
      if (!wallet) {
          return res.status(404).json({ message: 'Wallet not found' });
      }

      res.status(200).json({ message: 'Wallet retrieved successfully', wallet });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve wallet' });
  }
});


export default router;