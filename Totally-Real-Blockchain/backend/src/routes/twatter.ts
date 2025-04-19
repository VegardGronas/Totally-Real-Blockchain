import express from 'express';
import { createPost, getAllPosts } from '../data/twatterbase.ts';
import { getUserByUserName } from '../data/userdatabase.ts';
import jwt from 'jsonwebtoken';
import type { TwatterPost } from '../types/types.ts';

const router = express.Router();

/**
 * @swagger
 * /twatter/create:
 *   post:
 *     summary: Create a new Twatter post
 *     description: Allows an authenticated user to create a new Twatter post.
 *     tags:
 *       - Twatter
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - header
 *               - content
 *             properties:
 *               header:
 *                 type: string
 *                 example: "Exciting News!"
 *               content:
 *                 type: string
 *                 example: "Just launched my first coin on Totally Real Blockchain 🚀"
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to create post
*/

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

/**
 * @swagger
 * /twatter/get/all:
 *   get:
 *     summary: Get all Twatter posts from the authenticated user
 *     description: Returns a list of all posts created by the authenticated user.
 *     tags:
 *       - Twatter
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Posts received successfully
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       userName:
 *                         type: string
 *                         example: johndoe
 *                       header:
 *                         type: string
 *                         example: My first post
 *                       content:
 *                         type: string
 *                         example: Hello Twatter!
 *                       createdAt:
 *                         type: integer
 *                         example: 1714932312
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve posts
*/

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