import express from 'express';
import { getAIMove } from './server/ai.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 创建 API 路由来计算最佳走法
app.post('/api/ai-move', (req, res) => {
    const { chess } = req.body; // 将 boardState 改为 chess
    const result = getAIMove(chess); // 传入 chess 而非 boardState
    console.log("AI move result:", result); // 调试日志
    res.json(result); // 返回 AI 的计算结果
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
