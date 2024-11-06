const SIZE = 15,
    TOTAL_STEPS = SIZE * SIZE;

const BOARD_BG_COLOR = '#E4A751',
    LINE_WIDTH = 1,
    LINE_COLOR = '#000000',
    RED_POINT_COLOR = '#F56C6C',
    BLACK_PIECE_COLOR = '#000000', //Making Gradients
    BLACK_PIECE_TOP_COLOR = '#707070',
    WHITE_PIECE_COLO6R = '#D5D8DC',
    WHITE_PIECE_TOP_COLOR = '#FFFFFF', //Making Gradients
    PIECE_SHADOW_COLOR = 'rgba(0, 0, 0, 0.5)',
    BOARD_SHADOW_COLOR = '#888888',
    BLACK_ROLE = 1,
    WHITE_ROLE = -1,
    EMPTY_ROLE = 0;

let W = Math.min(window.innerWidth, window.innerHeight) / (SIZE + 5), // size of grid
    SL = W * (SIZE + 1);

/**@type {HTMLCanvasElement} */
let gameContainer = document.querySelector('.game-container');
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = canvas.height = SL;

let chess = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY_ROLE)),
    isBlack = true, // Black first
    moveSteps = 0,
    steps = [];

console.log(chess);

let undoButton = document.querySelector('.undo-button');

undoButton.onclick = e => {
    if (steps.length === 0) return;
    isBlack = !isBlack;
    moveSteps--;
    let { x, y } = steps.pop();
    chess[x][y] = EMPTY_ROLE;
    clearPiece(x, y);
    if (steps.length === 0) return;
    let lastStep = steps.at(-1);
    drawRedPoint(lastStep.x, lastStep.y);
}

const clearPiece = (x, y) => {
    ctx.fillStyle = BOARD_BG_COLOR;
    ctx.fillRect(x * W + W / 2, y * W + W / 2, W, W);
    drawLine(x, y > 0 ? y - 0.5 : y, x, y < SIZE - 1 ? y + 0.5 : y);
    drawLine(x > 0 ? x - 0.5 : x, y, x < SIZE - 1 ? x + 0.5 : x, y);
}

/*
canvas.onclick = e => {
    //console.log(chess);
    let [x, y] = [e.offsetX, e.offsetY].map(p => Math.round(p / W) - 1);
    if (chess[x]?.[y] !== EMPTY_ROLE) return;
    if (steps.length > 0) {
        let { x, y, isBlack } = steps.at(-1)
        clearPiece(x, y);
        drawPiece(x, y, isBlack);
    };
    drawPiece(x, y, isBlack);
    drawRedPoint(x, y);
    steps.push({ x, y, isBlack })
    chess[x][y] = isBlack ? BLACK_ROLE : WHITE_ROLE;
    isWin(x, y, chess[x][y], chess) ? over(`${isBlack ? 'Black' : 'White'}Won!`) :
        ++moveSteps === TOTAL_STEPS ? over('游戏结束，平局！') : isBlack = !isBlack;
}
        */


canvas.onclick = e => {
    // player moving logic
    let [x, y] = [e.offsetX, e.offsetY].map(p => Math.round(p / W) - 1);
    if (chess[x]?.[y] !== EMPTY_ROLE) return;
    if (steps.length > 0) {
        let { x, y, isBlack } = steps.at(-1)
        clearPiece(x, y);
        drawPiece(x, y, isBlack);
    };
    drawPiece(x, y, isBlack);
    drawRedPoint(x, y);
    steps.push({ x, y, isBlack });
    chess[x][y] = isBlack ? BLACK_ROLE : WHITE_ROLE;

    // check if there is a winning or it's a draw
    if (isWin(x, y, chess[x][y], chess)) {
        over(`${isBlack ? 'Black' : 'White'} Won!`);
    } else if (++moveSteps === TOTAL_STEPS) {
        over('Game Over, Draw！');
    } else {
        isBlack = !isBlack;  // switch to AI 
        sendBoardToAI();     // send the board state to AI
    }
};





// Send the board state to AI at the back end, then get next AI move
const sendBoardToAI = () => {
    fetch('/api/ai-move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chess }) //Send the current board data to the backend
    })
        .then(response => response.json())
        .then(data => {
            const { move } = data;
            if (move) {
                const [x, y] = move;
                if (steps.length > 0) {
                    let { x, y, isBlack } = steps.at(-1)
                    clearPiece(x, y);
                    drawPiece(x, y, isBlack);
                };
                drawPiece(x, y, isBlack);
                drawRedPoint(x, y);
                steps.push({ x, y, isBlack });
                chess[x][y] = isBlack ? BLACK_ROLE : WHITE_ROLE;
                if (isWin(x, y, chess[x][y], chess)) {
                    over(`${isBlack ? 'Black' : 'White'} Won!`);
                } else if (++moveSteps === TOTAL_STEPS) {
                    over('Game Over, Draw！');
                } else {
                    isBlack = !isBlack;  //switch to player
                }

            }
        })
        .catch(error => console.error('Error:', error));
};







const isWin = (x, y, role, chess) => {

    for (let [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
        let count = 1, i = 0, j = 0;
        while (count < 5 && chess[x + dx * ++i]?.[y + dy * i] === role) count++;
        while (count < 5 && chess[x - dx * ++j]?.[y - dy * j] === role) count++;
        if (count === 5) {
            i = 4 - j;
            drawLine(x + dx * i, y + dy * i, x - dx * j, y - dy * j, 5, 'green');
            return true;
        }
    }
    return false;
}

const drawPiece = (x, y, isBlack) => {
    ctx.save();
    ctx.beginPath();
    x = x * W + W;
    y = y * W + W;
    ctx.arc(x, y, W * 0.4, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = ctx.shadowOffsetY = W * 0.08;
    ctx.shadowBlur = W * 0.04;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, W * 0.4);
    gradient.addColorStop(0, isBlack ? '#707070' : 'white');
    gradient.addColorStop(1, isBlack ? 'black' : '#D5D8DC');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
}

const drawBoard = () => {
    ctx.fillStyle = '#E4A751';
    ctx.fillRect(0, 0, SL, SL);
    for (let i = 0; i < SIZE; i++) {
        drawLine(0, i, SIZE - 1, i);
        drawLine(i, 0, i, SIZE - 1);
    }

}


const drawLine = (x1, y1, x2, y2, lineWidth = 1, lineColor = 'black') => {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(x1 * W + W, y1 * W + W);
    ctx.lineTo(x2 * W + W, y2 * W + W);
    ctx.stroke();
}

const drawRedPoint = (x, y, r = 0.05 * W) => {
    ctx.beginPath();
    ctx.fillStyle = RED_POINT_COLOR;
    ctx.arc(x * W + W, y * W + W, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

let restartButton = document.querySelector('.restart-button');

restartButton.onclick = () => {
    restart();
};

const restart = () => {
    ctx.clearRect(0, 0, SL, SL);
    drawBoard();
    chess = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY_ROLE))
    isBlack = true;
    moveSteps = 0;
    steps = []
    sendBoardToAI();
}



const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}

const handleResize = () => {
    ctx.clearRect(0, 0, SL, SL);
    W = Math.min(window.innerWidth, window.innerHeight) / (SIZE + 3);
    SL = W * (SIZE + 1);
    canvas.width = canvas.height = SL;
    drawBoard();
    steps.forEach(({ x, y, isBlack }) => {
        drawPiece(x, y, isBlack)
    })

    if (steps.length > 0) {
        let { x, y } = steps.at(-1)
        drawRedPoint(x, y)
    }
}

window.onresize = debounce(handleResize, 512)

window.onload = drawBoard

