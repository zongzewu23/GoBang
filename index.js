const SIZE = 15,
W = Math.min(window.innerHeight, window.innerWidth)/ (SIZE + 3),
SL = W*(SIZE + 1),
TOTAL_STEP = SIZE *SIZE;

/**@type {HTMLCanvasElement} */
let canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
canvas.width = canvas.height = SL;
canvas.classList.add('game-canvas'); 
document.body.appendChild(canvas);



let isBlack = true,
moveSteps = 0,
// black1 white2 empty -1
  chess = Array.from({length : SIZE},  ()=> Array(SIZE).fill(-1));

console.log(chess);
canvas.onclick = e =>{

    let [x,y] = [e.offsetX, e.offsetY].map(p => Math.round(p /W)-1);
    if(chess[x]?.[y] !== -1) return alert('No, Buddy stop');
    drawPiece(x, y,isBlack);
    chess[x][y] = isBlack ? 1 : 2;
    if(isWin(x,y,chess[x][y], chess)){
        alert(`${isBlack ?'black' : 'white'} Won`);
    }
    if(++moveSteps === TOTAL_STEP){
        alert("It's a draw!")
    }
    isBlack = !isBlack;


}

const isWin = (x, y, role, chess)=>{
    
for(let [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]){
 let count = 1, i = 0, j = 0;
 while(count < 5 && chess[x + dx * ++i]?.[y + dy * i] === role) count++;
 while(count < 5 && chess[x - dx * ++j]?.[y - dy * j] === role) count++;
 if(count === 5) {
    i = 4 - j;
    drawLine(x + dx * i, y + dy * i, x - dx * j, y - dy * j, 5, 'green');
    return true;
}
    }
 return false;
}

const drawPiece =(x, y, isBlack)=> {
    ctx.save();
    ctx.beginPath();
    x = x*W + W;
    y = y*W + W;
    ctx.arc(x,y, W*0.4, 0, 2*Math.PI);
    ctx.closePath();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = ctx.shadowOffsetY = W * 0.08;
    ctx.shadowBlur = W *0.04;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, W*0.4);
    gradient.addColorStop(0, isBlack ? '#707070' : 'white');
    gradient.addColorStop(1, isBlack ? 'black' : '#D5D8DC');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
}

const drawBoard = () =>{
  ctx.fillStyle = '#E4A751';
  ctx.fillRect(0, 0, SL, SL);
for(let i = 0;  i <SIZE; i++){
            drawLine(0, i, SIZE -1, i);
            drawLine(i, 0, i, SIZE -1);
}

}


const drawLine = (x1, y1, x2, y2, lineWidth = 1, lineColor = 'black')=>{
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(x1*W + W, y1*W +W);
    ctx.lineTo(x2*W +W, y2*W+W);
    ctx.stroke();
}
window.onload = drawBoard

