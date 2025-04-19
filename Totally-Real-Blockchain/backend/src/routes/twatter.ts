import express from 'express';
import { createPost, getAllPosts } from '../data/twatterbase.ts';
import { getUserByUserName } from '../data/userdatabase.ts';
import jwt from 'jsonwebtoken';
import type { TwatterPost } from '../types/types.ts';

const router = express.Router();

router.post('/create', async (req, res) => {
    const authHeader = req.headers.authorization;
    const { header, content } = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; userName: string };
        const user = getUserByUserName(decoded.userName);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        createPost(user.userName, header, content);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create post' });
    }
});

router.get('/get/all', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; userName: string };  
        const user = getUserByUserName(decoded.userName);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = getAllPosts(user.userName);  // Now returns an array

        res.status(200).json({ message: 'Posts received successfully', posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve posts' });
    }
});

export default router;