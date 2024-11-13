//app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAIMove } from './server/ai.js';
import pool from './db.js'; 
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static('public'));
//app.use(express.static('src'));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Create an API route to calculate the best path
app.post('/api/ai-move', (req, res) => {
    const { chess } = req.body;
    const result = getAIMove(chess); //Pass in the board state
    console.log("AI move result:", result); //Debug Log
    res.json(result); // Returns the AI ​​calculation result
});

// Create a User Registration API
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Encrypt password and insert into database
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a user login API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Query user information
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //Verify Password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
