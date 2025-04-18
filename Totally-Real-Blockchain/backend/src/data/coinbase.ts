// src/data/database.ts
import Database from 'better-sqlite3';
import { getUserByUserName } from './userdatabase.ts';  // Importing user database functions

const db = new Database('game.db', { verbose: console.log });

// Function to add a coin to the database with a user wallet
export function addCoin(name: string, creatorWallet: string, value: number, volatility: number) {
  // Check if the creator wallet exists in the user table
  const user = getUserByUserName(creatorWallet);  // Check by wallet address
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

// Function to get all coins owned by a specific user
export function getUserCoins(creatorWallet: string) {
  const select = db.prepare('SELECT * FROM coins WHERE creator = ?');
  return select.all(creatorWallet);  // Return coins by creator's wallet
}

// Function to get a coin by its ID
export function getCoinById(id: string) {
  const select = db.prepare('SELECT * FROM coins WHERE id = ?');
  return select.get(id);
}

export function getCoinsForWallet(walletId: number) {
  const query = `
    SELECT coins.id, coins.name, coins.value, coins.volatility, wallet_coin_balances.amount
    FROM wallet_coin_balances
    JOIN coins ON wallet_coin_balances.coin_id = coins.id
    WHERE wallet_coin_balances.wallet_id = ?
  `;
  
  const select = db.prepare(query);
  return select.all(walletId);
}