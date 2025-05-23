import express from 'express';
import { getUserByUserName } from '../data/userdatabase.ts';
// src/data/userdatabase.ts
import type { User } from '../types/types.ts';  // No .ts extension needed
import { createUser, createWallet } from '../data/userdatabase.ts';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new player
 *     description: Creates a new user with a wallet that starts with 1000 in balance.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: 'johnDoe'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       201:
 *         description: User and wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User created successfully'
 *                 userName:
 *                   type: string
 *                   example: 'johnDoe'
 *       400:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Username already exists'
 *       500:
 *         description: Error creating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating user'
 */


router.post('/register', async (req, res) => {
  const { userName, password }: User = req.body as User;  // Type assertion to make req.body a UserRequest

  // Check if username already exists
  const existingUser = getUserByUserName(userName);
  if (existingUser) {
    console.log("User already exists");
    return res.status(400).json({ message: 'Username already exists' });
  }

  try {
    // Create the new user and wallet (await the asynchronous createUser function)
    await createUser(userName, password);

    console.log("Waiting");

    //Create a default start wallet for the user with 1000 in blanace
    createWallet(userName, 1000);

    // Respond with success and the wallet address
    res.status(201).json({ message: 'User created successfully', userName});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a player
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: 'johnDoe'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Login successful'
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid username or password'
 *       500:
 *         description: Error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error during login'
 */

router.post('/login', async (req, res) => {
  const { userName, password } = req.body as User;

  const user = getUserByUserName(userName);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, userName: user.userName },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login' });
  }
});

/**
 * @swagger
 * /users/get:
 *   get:
 *     summary: Get current user
 *     description: Retrieves the current authenticated user using the provided JWT token.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: 'johnDoe'
 *       401:
 *         description: No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'No token provided'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User not found'
 *       500:
 *         description: Error during loading user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error during loading user'
 */


router.get('/get', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Get the token from Authorization header
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; userName: string };
    
    // Retrieve the user from the database using the userId from the token
    const user = getUserByUserName(decoded.userName);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }



    res.status(200).json({ "user":user.userName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error during loading user' });
  }
});

export default router;