const SIZE = 15,
    TOTAL_STEPS = SIZE * SIZE;

const BOARD_BG_COLOR = 'rgb(251,182,15)',
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

let W = Math.min(window.innerWidth, window.innerHeight) / (SIZE + 8), // size of grid
    SL = W * (SIZE + 1);

/**@type {HTMLCanvasElement} */
let gameContainer = document.querySelector('.game-container');
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let totalSteps = 0;
let isPlayerBlack = true;
canvas.width = canvas.height = SL;



let chess = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY_ROLE)),
    isBlack = true, // Black first
    moveSteps = 0,
    steps = [];


    

console.log(chess);



const clearPiece = (x, y) => {
    ctx.fillStyle = BOARD_BG_COLOR;
    ctx.fillRect(x * W + W / 2, y * W + W / 2, W, W);
    drawLine(x, y > 0 ? y - 0.5 : y, x, y < SIZE - 1 ? y + 0.5 : y);
    drawLine(x > 0 ? x - 0.5 : x, y, x < SIZE - 1 ? x + 0.5 : x, y);
}


// offline mode logic
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
        ++moveSteps === TOTAL_STEPS ? over('Draw') : isBlack = !isBlack;
}
        */

// ai mode logic

canvas.onclick = e => {
    totalSteps++;
    // player moving logic
    let [x, y] = [e.offsetX, e.offsetY].map(p => Math.round(p / W) - 1);
    if (chess[x]?.[y] !== EMPTY_ROLE) return;
    if (steps.length > 0) {
        let { x, y, isBlack } = steps.at(-1)
        clearPiece(x, y);
        drawPiece(x, y, isBlack);
        playMoveSound();
    };
    drawPiece(x, y, isBlack);
    playMoveSound();
    drawRedPoint(x, y);
    steps.push({ x, y, isBlack });
    chess[x][y] = isBlack ? BLACK_ROLE : WHITE_ROLE;
    updateTotalStepsDisplay();
    // check if there is a winning or it's a draw
    if (isWin(x, y, chess[x][y], chess)) {
        const winner = isBlack ? 'black' : 'white';
        const result = (isPlayerBlack && winner === 'black') || (!isPlayerBlack && winner === 'white')
            ? 'win'
            : 'lose';
        updateStats(result); 
    } else if (++moveSteps === TOTAL_STEPS) {
        alert('Draw!');
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
                    playMoveSound();
                };
                drawPiece(x, y, isBlack);
                playMoveSound();
                drawRedPoint(x, y);
                steps.push({ x, y, isBlack });
                chess[x][y] = isBlack ? BLACK_ROLE : WHITE_ROLE;
                if (isWin(x, y, chess[x][y], chess)) {
                    const winner = isBlack ? 'black' : 'white';
                    const result = (isPlayerBlack && winner === 'black') || (!isPlayerBlack && winner === 'white')
                        ? 'win'
                        : 'lose';
                    updateStats(result); 
                } else if (++moveSteps === TOTAL_STEPS) {
                  alert('Draw!');
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
            showWinAnimation();
            return true;
        }
    }
    return false;
}

function showWinAnimation() {

    const winSound = new Audio(isBlack ? blackWinSound() : whiteWinSound());


    const overlay = document.createElement('div');
    overlay.className = 'win-overlay';
    overlay.innerHTML = `<h2>${isBlack ? 'Black Wins!' : 'White Wins!'}</h2>`;

    const restartGameButton = document.createElement('button');
    restartGameButton.textContent = 'Restart Game';
    restartGameButton.className = 'restart-game-button';
    restartGameButton.onclick = () => {
        restartGame();
    };

    // Adding buttons to the overlay
    overlay.appendChild(restartGameButton);
    document.body.appendChild(overlay);
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
    ctx.fillStyle = 'rgb(251,182,15)';
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



const restart = () => {
    ctx.clearRect(0, 0, SL, SL);
    drawBoard();
    chess = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY_ROLE))
    isBlack = true;
    moveSteps = 0;
    totalSteps = 0;
    steps = []
    sendBoardToAI();
    updateTotalStepsDisplay();
}

function restartGame() {
    // remove overplay
    const overlay = document.querySelector('.win-overlay');
    if (overlay) {
        overlay.remove(); // remove from dom
    }
    // clear board and reset game status
    ctx.clearRect(0, 0, SL, SL);
    drawBoard();
    chess = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY_ROLE));
    isBlack = true;
    moveSteps = 0;
    steps = [];
    totalSteps = 0;
    updateTotalStepsDisplay();
    //sendBoardToAI();
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
    W = Math.min(window.innerWidth, window.innerHeight) / (SIZE + 8 );
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

// Update the steps display
function updateTotalStepsDisplay() {
    const totalStepsElement = document.getElementById('totalStepsDisplay');
    if (totalStepsElement) {
        totalStepsElement.textContent = `Total Steps: ${totalSteps}`;
    }
}



function updateStats(result) {
    const username = localStorage.getItem('username');
    fetch('/api/update-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, result })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Stats updated:', data);
        refreshPlayerInfo();
    })
    .catch(error => console.error('Error updating stats:', error));
}


function refreshPlayerInfo() {
    const username = localStorage.getItem('username');
    const statsDisplay = document.getElementById('statsDisplay');

    if (!username) {
        console.error('No username found in localStorage.');
        return;
    }

    fetch(`/api/get-stats?username=${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Player stats refreshed:', data);
            if (statsDisplay) {
                statsDisplay.textContent = `
                    Games: ${data.total_games}, 
                    Wins: ${data.wins}, 
                    Max Streak: ${data.max_streak}, 
                    Win Rate: ${data.win_rate}%
                `.trim();
                statsDisplay.style.display = 'block'; // Show stats
            }
        })
        .catch(error => console.error('Error fetching player stats:', error));
}




function undoLastMove() {
    for(let i = 0; i < 2; i++){
        if (steps.length === 0) return;
        isBlack = !isBlack;
        moveSteps--;
        let { x, y } = steps.pop();
        chess[x][y] = EMPTY_ROLE;
        clearPiece(x, y);
        if (steps.length === 0) {
            totalSteps = 0;
            updateTotalStepsDisplay();
        }
        let lastStep = steps.at(-1);
        drawRedPoint(lastStep.x, lastStep.y);
    }
    totalSteps--;
    updateTotalStepsDisplay();

}



const moveSound = new Audio('/src/piecedown.mp3');
moveSound.volume = 1;
function playMoveSound() {
    moveSound.play();
}

const blackwinSound = new Audio('/src/rockwin.wav');
blackwinSound.volume = 1;
function blackWinSound() {
    blackwinSound.play();
}

const whitewinSound = new Audio('/src/choirwin.wav');
whitewinSound.volume = 1;
function whiteWinSound() {
    whitewinSound.play();
}

document.getElementById('avatarUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('username', localStorage.getItem('username'));

        try {
            console.log('FormData content:', formData); 
            const response = await fetch('http://localhost:3000/api/upload-avatar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('userAvatar').src = data.avatarUrl;
            } else {
                alert('Failed to upload avatar');
            }
        } catch (error) {
            console.error('Error during upload:', error);
            alert('An error occurred during the upload process.');
        }
    }
});


// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Check login status
    const username = localStorage.getItem('username');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userInfo = document.getElementById('userInfo');
    const maxStepsDisplay = document.getElementById('maxStepsDisplay');

    // Login/Logout button visibility
    if (username) {
        refreshPlayerInfo();
        if (loginButton) loginButton.style.display = 'none';
        if (usernameDisplay) usernameDisplay.textContent = username;
        if (logoutButton) logoutButton.style.display = 'inline';
    } else {
        if (loginButton) loginButton.style.display = 'inline';
        if (logoutButton) logoutButton.style.display = 'none';
    }

    // Attach logout event to the logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('username');

            // Update UI
            if (loginButton) loginButton.style.display = 'inline';
            if (welcomeMessage) welcomeMessage.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
            console.log('User logged out');

            // Hide user info with fade-out animation
            if (userInfo) {
                userInfo.classList.add('fade-out'); // Add fade-out animation class
                setTimeout(() => {
                    userInfo.style.display = 'none'; // Hide the element after animation
                    userInfo.classList.remove('fade-out'); // Remove the class for future use
                }, 500); // Match the duration of the CSS animation
            }
            const statsDisplay = document.getElementById('statsDisplay');
            if (statsDisplay) {
                statsDisplay.style.display = 'none'; // Hide stats
            }
        });
    }

    // Fetch and display max steps for the logged-in user
    if (username && maxStepsDisplay) {
        fetch(`/api/get-max-steps?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.maxSteps !== undefined) {
                    maxStepsDisplay.textContent = `Max Steps: ${data.maxSteps}`;
                }
            })
            .catch(error => {
                console.error('Error fetching max steps:', error);
            });
    }


    const restartAsBlackButton = document.getElementById('restartAsBlack');
    const restartAsWhiteButton = document.getElementById('restartAsWhite');
    const undoButton = document.getElementById('undo');

   // Reset to black
    if (restartAsBlackButton) {
        restartAsBlackButton.addEventListener('click', () => {
            isPlayerBlack = true; // Set the player to black
            restartGame();
            console.log('Player restarts as Black');
        });
    }

   // Reset to white
    if (restartAsWhiteButton) {
        restartAsWhiteButton.addEventListener('click', () => {
            isPlayerBlack = false; // Set the player to white
            restartGame();
            console.log('Player restarts as White');
            sendBoardToAI(); // If the player is white, the AI ​​moves first
        });
    }

    // Undo one step
    if (undoButton) {
        undoButton.addEventListener('click', () => {
            undoLastMove();
            console.log('Undo last move');
        });
    }
});






window.onresize = debounce(handleResize, 512)

window.onload = drawBoard

