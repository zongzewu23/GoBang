import express from 'express';
import { getAIMove } from './server/ai.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 创建 API 路由来计算最佳走法
app.post('/api/ai-move', (req, res) => {
    const { boardState } = req.body; // 前端传入的棋盘状态
    const result = getAIMove(boardState);
    res.json(result); // 返回 AI 的计算结果
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
