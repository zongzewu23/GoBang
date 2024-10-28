// server/ai.js
import Board from './ai/board.js';
import { minmax } from './ai/minmax.js';

export function getAIMove(boardState, role = 1) {
    // 创建棋盘实例
    const board = new Board();
    // 初始化棋盘状态
    boardState.forEach((row, i) => row.forEach((cell, j) => {
        if (cell !== 0) board.put(i, j, cell);
    }));

    // 使用 minmax 算法计算最佳走法
    const [score, bestMove] = minmax(board, role);
    return { move: bestMove, score };
}
