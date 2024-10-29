// server/ai.js
import Board from './ai/board.js';
import { minmax } from './ai/minmax.js';

export function getAIMove(chess, role = 1) {
    const board = new Board();
    chess.forEach((row, i) => row.forEach((cell, j) => {
        if (cell !== 0) board.put(i, j, cell);
    }));

    const [score, bestMove] = minmax(board, role);
    
    if (!bestMove) {
        console.log("No valid AI move found.");
        return { move: null, score };
    }
    return { move: bestMove, score };
}

