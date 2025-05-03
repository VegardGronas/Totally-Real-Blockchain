// src/data/database.ts
import Database from 'better-sqlite3';
import { getUserByUserName } from './userdatabase.ts';  // Importing user database functions

const db = new Database('game.db', { verbose: console.log });

// Function to add a coin to the database with a user wallet
export function addCoin(name: string, creatorWallet: string, value: number, volatility: number) {
    // Check if the creator wallet exists in the user table
    const user = getUserByUserName(creatorWallet);  // You might want to check by wallet or userName
    if (!user) {
      throw new Error('User with the provided wallet does not exist');
    }
  
    // Proceed to insert the coin if the user exists
    const insert = db.prepare(`
      INSERT INTO coins (name, creator, value, volatility, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run(name, creatorWallet, value, volatility, Date.now());
}

// Function to get all coins from the database
export function getAllCoins() {
  const select = db.prepare('SELECT * FROM coins');
  return select.all();
}

// Function to get a coin by its ID
export function getCoinById(id: string) {
  const select = db.prepare('SELECT * FROM coins WHERE id = ?');
  return select.get(id);
}