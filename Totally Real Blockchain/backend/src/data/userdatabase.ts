// src/data/database.ts
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for generating unique wallet IDs
import bcrypt from 'bcrypt';  // Import bcrypt for password hashing
// src/data/userdatabase.ts
import type { User } from '../types/types.ts';  // No .ts extension needed

const db = new Database('game.db', { verbose: console.log });

// Function to create a user
export async function createUser(userName: string, password: string) {
    const wallet = uuidv4();  // Generate a unique wallet address
    
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the number of salt rounds
  
    const insert = db.prepare(`
      INSERT INTO user (userName, password, wallet)
      VALUES (?, ?, ?)
    `);
    
    insert.run(userName, hashedPassword, wallet);
    return wallet;  // Return the generated wallet address
}

export function getUserByWallet(wallet: string): User | undefined {
    const select = db.prepare('SELECT * FROM user WHERE wallet = ?');
    return select.get(wallet) as User | undefined;
}  

// Function to get all users
export function getAllUsers() {
    const select = db.prepare('SELECT * FROM user');
    return select.all();  // Returns all users as an array
}