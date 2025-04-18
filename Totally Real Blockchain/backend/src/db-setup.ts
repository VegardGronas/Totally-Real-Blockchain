import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

export function setupDatabase()
{
    const db = new Database('game.db', { verbose: console.log });

    // Users table with balance
    db.prepare(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        userName TEXT UNIQUE,
        password TEXT,
        wallet TEXT UNIQUE,
        balance REAL DEFAULT 1000
      )
    `).run();

    // Coins table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS coins (
        id INTEGER PRIMARY KEY,
        name TEXT,
        creator TEXT,
        value REAL,
        volatility REAL,
        supply INTEGER,
        createdAt INTEGER,
        FOREIGN KEY(creator) REFERENCES user(wallet) ON DELETE CASCADE
      )
    `).run();

    // Coin ownership
    db.prepare(`
      CREATE TABLE IF NOT EXISTS user_coins (
        user_id INTEGER,
        coin_id INTEGER,
        amount INTEGER,
        PRIMARY KEY (user_id, coin_id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (coin_id) REFERENCES coins(id)
      );
    `).run();

    // Transactions log
    db.prepare(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        sender_user_id INTEGER,
        receiver_user_id INTEGER,
        coin_id INTEGER,
        amount INTEGER,
        price REAL,
        createdAt INTEGER,
        FOREIGN KEY (sender_user_id) REFERENCES user(id),
        FOREIGN KEY (receiver_user_id) REFERENCES user(id),
        FOREIGN KEY (coin_id) REFERENCES coins(id)
      );
    `).run();

    // Coin value history for graphing
    db.prepare(`
      CREATE TABLE IF NOT EXISTS coin_value_history (
        id INTEGER PRIMARY KEY,
        coin_id INTEGER,
        value REAL,
        timestamp INTEGER,
        FOREIGN KEY (coin_id) REFERENCES coins(id)
      );
    `).run();
    
    console.log('Database setup complete.');
}
