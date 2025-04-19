import Database from 'better-sqlite3';
import type { TwatterPost } from '../types/types.ts';

const db = new Database('game.db', { verbose: console.log });

// Function to create a user
export async function createPost(userName: string, header: string, content: string) {
    // Hash the password before storing it
    const insert = db.prepare(`
      INSERT INTO twatter_post (userName, header, content)
      VALUES (?, ?, ?)
    `);
    
    insert.run(userName, header, content);
    return userName;
}

export function getAllPosts(username: string) {
    const select = db.prepare('SELECT * FROM twatter_post WHERE userName = ? ORDER BY createdAt DESC');
    return select.all(username) as TwatterPost[];
}  