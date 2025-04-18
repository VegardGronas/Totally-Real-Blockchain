import Database from 'better-sqlite3';

export function setupDatabase() {
    const db = new Database('game.db', { verbose: console.log });

    // Users table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        userName TEXT UNIQUE,
        password TEXT -- Store hashed password only!
      );
    `).run();

    // Coins table (e.g. crypto or real currency)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS coins (
        id INTEGER PRIMARY KEY,
        name TEXT,
        creator_id INTEGER,
        value REAL,
        volatility REAL,
        supply INTEGER,
        createdAt INTEGER,
        isCrypto INTEGER DEFAULT 1, -- 1 for crypto, 0 for real currency
        FOREIGN KEY(creator_id) REFERENCES user(id) ON DELETE CASCADE
      );
    `).run();

    // User wallet (tracks coin holdings)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS wallets (
        wallet_id TEXT PRIMARY KEY,  -- Make wallet_id a unique string identifier
        user_id INTEGER NOT NULL,
        amount REAL DEFAULT 0,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
      );
    `).run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS wallet_coin_balances (
        id INTEGER PRIMARY KEY,
        wallet_id INTEGER NOT NULL,
        coin_id INTEGER NOT NULL,
        updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY(wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
        FOREIGN KEY(coin_id) REFERENCES coins(id) ON DELETE CASCADE,
        UNIQUE(wallet_id, coin_id)
      );
    `).run();

    // Transactions log
    db.prepare(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        sender_user_id INTEGER,
        receiver_user_id INTEGER,
        coin_id INTEGER,
        amount REAL,
        price REAL,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (sender_user_id) REFERENCES user(id),
        FOREIGN KEY (receiver_user_id) REFERENCES user(id),
        FOREIGN KEY (coin_id) REFERENCES coins(id)
      );
    `).run();

    // Coin value history (for graphs)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS coin_value_history (
        id INTEGER PRIMARY KEY,
        coin_id INTEGER,
        value REAL,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (coin_id) REFERENCES coins(id)
      );
    `).run();

    console.log('Database setup complete.');
}