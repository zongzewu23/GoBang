import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAIMove } from './server/ai.js';

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

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
