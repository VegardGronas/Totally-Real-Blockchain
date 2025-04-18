import express from 'express';
import { getUserByUserName } from '../data/userdatabase.ts';
// src/data/userdatabase.ts
import type { User } from '../types/types.ts';  // No .ts extension needed
import { createUser } from '../data/userdatabase.ts';
import bcrypt from 'bcrypt'; 

const router = express.Router();

/**
 * @swagger
 * /players/register:
 *   post:
 *     summary: Register a new player
 *     tags:
 *       - Players
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Error creating user
*/

// POST /players/register - Register a new player// POST /players/register - Register a new player
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

    // Respond with success and the wallet address
    res.status(201).json({ message: 'User created successfully', userName});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

/**
 * @swagger
 * /players/login:
 *   post:
 *     summary: Login to account
 *     tags:
 *       - Players
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Error during login
*/

// POST /players/login - Log in an existing player
router.post('/login', async (req, res) => {
    const { userName, password }: User = req.body as User;
  
    // Find user by username
    const user = getUserByUserName(userName);
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  
    try {
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Respond with success and the wallet address
      res.status(200).json({ message: 'Login successful', user: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error during login' });
    }
});
 
/**
 * @swagger
 * /players/user:
 *   post:
 *     summary: Get user
 *     tags:
 *       - Players
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: res user
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Error during loading user
*/

// GET /players/:username - Get user details (user)
router.post('/user', async (req, res) => {
  const { userName, password } = req.body as User;

  const user = getUserByUserName(userName);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try
  {
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({user: user});
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json({message : "Error during loading user"});
  }
});

export default router;