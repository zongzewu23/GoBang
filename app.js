import express from 'express';
import { getAIMove } from './server/ai.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Create an API route to calculate the best path
app.post('/api/ai-move', (req, res) => {
    const { chess } = req.body;
    const result = getAIMove(chess); //Pass in the board state
    console.log("AI move result:", result); //Debug Log
    res.json(result); // Returns the AI ​​calculation result
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
