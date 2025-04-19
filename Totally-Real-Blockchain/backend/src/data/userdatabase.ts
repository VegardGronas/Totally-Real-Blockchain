// src/data/database.ts
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for generating unique wallet IDs
import bcrypt from 'bcrypt';  // Import bcrypt for password hashing
// src/data/userdatabase.ts
import type { User, Wallet, WalletCoinBalance } from '../types/types.ts';  // No .ts extension needed
import crypto from 'crypto'; 

const db = new Database('game.db', { verbose: console.log });

// Helper function to generate a random wallet ID
function generateWalletId() {
  return crypto.randomBytes(32).toString('hex');  // Generates a 64-character hex string
}

// Function to create a user
export async function createUser(userName: string, password: string) {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the number of salt rounds
  
    const insert = db.prepare(`
      INSERT INTO user (userName, password)
      VALUES (?, ?)
    `);
    
    insert.run(userName, hashedPassword);
    return userName;  // Return the generated wallet address
}

// src/data/userdatabase.ts
export function getUserByUserName(userName: string): User | undefined {
    const select = db.prepare('SELECT * FROM user WHERE userName = ?');
    return select.get(userName) as User | undefined;
}

export function getUserById(userId: string) : User | undefined {
    const select = db.prepare('SELECT * FROM user WHERE id = ?');
    return select.get(userId) as User || undefined;
}

export function createWallet(username: string, amount: number = 0) {
    const walletId = generateWalletId();  // Generate the wallet ID
    
    // Insert the new wallet with user_id and wallet_id
    const walletInsert = db.prepare(`
      INSERT INTO wallets (userName, wallet_id, amount)
      VALUES (?, ?, ?)
    `);
    
    walletInsert.run(username, walletId, amount);
  
    // Insert the default 0 balance for each coin directly into the wallet_coin_balances table
    const insertBalance = db.prepare(`
      INSERT INTO wallet_coin_balances (wallet_id, coin_id)
      VALUES (?, ?)
    `);
    
    // Insert 0 balance for each coin in the coins table (assuming you already have coins defined)
    db.prepare('SELECT id FROM coins').all().forEach((coin: any) => {
      insertBalance.run(walletId, coin.id);  // Initialize coin balances to 0
    });
}  

export function getWalletWithCoinBalances(userId: string) {
    // Fetch the wallet data (asserting the result type)
    const selectWallet = db.prepare(`
      SELECT * FROM wallets WHERE userName = ?
    `);
  
    const wallet = selectWallet.get(userId) as Wallet | undefined;  // Assert that it is either a Wallet or undefined
  
    if (!wallet) {
      return null; // Return null if no wallet found
    }
  
    // Now fetch the associated coin balances for the wallet
    const selectCoinBalances = db.prepare(`
      SELECT * FROM wallet_coin_balances WHERE wallet_id = ?
    `);
    
    // Type the result of the 'all' function as WalletCoinBalance[]
    const coinBalances: WalletCoinBalance[] = selectCoinBalances.all(wallet.wallet_id) as WalletCoinBalance[];
  
    return {
      wallet,
      coinBalances,
    };
}     