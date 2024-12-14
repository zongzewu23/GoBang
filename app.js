//app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAIMove } from './server/ai.js';
import pool from './db.js'; 
import bcrypt from 'bcrypt';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static('public'));
//app.use(express.static('src'));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));



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
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const avatarUrl = user.rows[0].avatar_url || '/src/default-avatar.jpg';
        res.status(200).json({ message: 'Login successful', avatarUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Configure Multer for avatar uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, 'public/uploads/avatars'); // 固定路径
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir); 
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });




// Avatar Upload Endpoint with Database Update
app.post('/api/upload-avatar', upload.single('avatar'), async (req, res) => {
    //console.log('Request body:', req.body);
    //console.log('Uploaded file:', req.file);
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    //console.log('File stored at:', avatarUrl);
    const username = req.body.username;

    try {
        await pool.query('UPDATE users SET avatar_url = $1 WHERE username = $2', [avatarUrl, username]);
        res.status(200).json({ avatarUrl });
    } catch (error) {
        console.error('Error updating avatar URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// update stats

app.post('/api/update-stats', async (req, res) => {
    const { username, result } = req.body;

    if (!username || !result) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
       // Get user data
        const userQuery = await pool.query(
            'SELECT total_games, wins, max_streak, current_streak FROM users WHERE username = $1',
            [username]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { total_games, wins, max_streak, current_streak } = userQuery.rows[0];

       // Update the total number of games and wins
        const newTotalGames = total_games + 1;
        const newWins = result === 'win' ? wins + 1 : wins;

      // Calculate the new winning streak and the maximum winning streak
        let newCurrentStreak = result === 'win' ? current_streak + 1 : 0;
        let newMaxStreak = Math.max(max_streak, newCurrentStreak);

       // Update the database
        await pool.query(
            'UPDATE users SET total_games = $1, wins = $2, max_streak = $3, current_streak = $4 WHERE username = $5',
            [newTotalGames, newWins, newMaxStreak, newCurrentStreak, username]
        );

        res.status(200).json({ message: 'Stats updated successfully' });
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




app.get('/api/get-stats', async (req, res) => {
    const { username } = req.query;

    try {
        const userQuery = await pool.query(
            'SELECT total_games, wins, max_streak FROM users WHERE username = $1',
            [username]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { total_games, wins, max_streak } = userQuery.rows[0];
        const winRate = total_games > 0 ? ((wins / total_games) * 100).toFixed(2) : 0;

        res.status(200).json({ 
            total_games, 
            wins, 
            max_streak, 
            win_rate: winRate 
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
