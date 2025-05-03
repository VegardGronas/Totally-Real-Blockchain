import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';  // For generating unique wallet IDs (if needed)

export function setupDatabase()
{
    const db = new Database('game.db', { verbose: console.log });

    // Create the user table if it doesn't exist
    db.prepare(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        userName TEXT UNIQUE,
        password TEXT,
        wallet TEXT
      )
    `).run();
    
    // Create the coins table if it doesn't exist
    db.prepare(`
      CREATE TABLE IF NOT EXISTS coins (
        id INTEGER PRIMARY KEY,
        name TEXT,
        creator TEXT,
        value REAL,
        volatility REAL,
        createdAt INTEGER,
        FOREIGN KEY(creator) REFERENCES user(wallet) ON DELETE CASCADE
      )
    `).run();

    db.prepare(`CREATE TABLE IF NOT EXISTS user_coins (
        user_id INTEGER,
        coin_id INTEGER,
        amount INTEGER,
        PRIMARY KEY (user_id, coin_id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (coin_id) REFERENCES coins(id)
        );
    `).run();
    
    // Optional: Add a sample user for testing purposes (if needed)
    const sampleUser = db.prepare(`
      SELECT * FROM user WHERE userName = ?
    `).get('sampleUser');
    if (!sampleUser) {
      const insert = db.prepare(`
        INSERT INTO user (userName, password, wallet)
        VALUES (?, ?, ?)
      `);
      insert.run('sampleUser', 'password123', uuidv4());  // You can modify this line as per your needs
      console.log('Sample user created');
    } else {
      console.log('Sample user already exists');
    }
    
    // Optional: Add a sample coin for testing purposes (if needed)
    const sampleCoin = db.prepare(`
      SELECT * FROM coins WHERE name = ?
    `).get('SampleCoin');
    if (!sampleCoin) {
      const insert = db.prepare(`
        INSERT INTO coins (name, creator, value, volatility, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `);
      insert.run('SampleCoin', 'sampleWallet', 100, 0.1, Date.now());  // Modify wallet as needed
      console.log('Sample coin created');
    } else {
      console.log('Sample coin already exists');
    }
    
    console.log('Database setup complete.');
}