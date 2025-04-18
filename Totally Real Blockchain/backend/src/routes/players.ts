import express from 'express';
import { getAllUsers } from '../data/userdatabase.ts';  // Import functions from database
import { getUserByWallet } from '../data/userdatabase.ts';
// src/data/userdatabase.ts
import type { User } from '../types/types.ts';  // No .ts extension needed
import { createUser } from '../data/userdatabase.ts';
import bcrypt from 'bcrypt'; 

const router = express.Router();

// POST /players/register - Register a new player
router.post('/register', async (req, res) => {
    const { userName, password }: User = req.body as User;  // Type assertion to make req.body a UserRequest
  
    // Check if username already exists
    const existingUser = getUserByWallet(userName);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  
    try {
      // Create the new user and wallet (await the asynchronous createUser function)
      const wallet = await createUser(userName, password);
  
      // Respond with success and the wallet address
      res.status(201).json({ message: 'User created successfully', wallet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    }
});  

// POST /players/login - Log in an existing player
router.post('/login', async (req, res) => {
    const { userName, password }: User = req.body as User;
  
    // Find user by username
    const user = getUserByWallet(userName);
  
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
      res.status(200).json({ message: 'Login successful', wallet: user.wallet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error during login' });
    }
});
  

// GET /players/:username - Get user details (wallet)
router.get('/:wallet', (req, res) => {
  const { wallet } = req.params;

  const user = getUserByWallet(wallet);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return the user's wallet and other info (you can customize what you return)
  res.status(200).json({ userName: user.userName, wallet: user.wallet });
});

// GET /players - Get all users
router.get('/', (req, res) => {
    const users = getAllUsers();  // Retrieve all users from the database
  
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
  
    // Return the list of users with basic information (customize the response as needed)
    res.status(200).json({ users });
});

export default router;