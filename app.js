// File: app.js
// Connect Four: 7 columns x 6 rows
const COLS = 7, ROWS = 6;
let boardState = []; // 2D array [col][row], bottom row index 0
let currentPlayer = 1; // 1 or 2
let gameOver = false;
let history = []; // for undo


const boardEl = document.getElementById('board');
const stateEl = document.getElementById('state');
const restartBtn = document.getElementById('restartBtn');
const undoBtn = document.getElementById('undoBtn');


function initBoard(){
boardState = Array.from({length:COLS}, ()=>Array(ROWS).fill(0));
currentPlayer = 1; gameOver=false; history = [];
renderBoard();
setStateText("Player 1's turn");
}


function renderBoard(){
boardEl.innerHTML = '';
// create a top-row for click targets
for(let c=0;c<COLS;c++){
const top = document.createElement('div');
top.className='col-hover';
top.dataset.col=c;
top.style.cursor = gameOver? 'default':'pointer';
top.addEventListener('click', onColumnClick);
top.addEventListener('mouseenter', ()=>{ if(!gameOver) highlightColumn(c,true); });
top.addEventListener('mouseleave', ()=>{ if(!gameOver) highlightColumn(c,false); });
boardEl.appendChild(top);
}
// grid cells: we render row by row from top to bottom for visual but map to bottom-up index
for(let r=ROWS-1;r>=0;r--){
for(let c=0;c<COLS;c++){
const cellWrap = document.createElement('div');
const cell = document.createElement('div');
cell.className = 'cell';
const val = boardState[c][r];
if(val===1) cell.classList.add('token','p1');
token.style.boxShadow = '0 0 0 6px rgba(255,255,255,0.06)';

token.style.transform = 'scale(1.06)';
}
}


function findWinningSequence(player){
for(let c=0;c<COLS;c++){
for(let r=0;r<ROWS;r++){
if(boardState[c][r]!==player) continue;
const dirs = [[1,0],[0,1],[1,1],[1,-1]];
for(const [dc,dr] of dirs){
const seq=[{c,r}];
let x=c+dc,y=r+dr;
while(x>=0 && x<COLS && y>=0 && y<ROWS && boardState[x][y]===player){ seq.push({c:x,r:y}); x+=dc; y+=dr; }
x=c-dc;y=r-dr;
while(x>=0 && x<COLS && y>=0 && y<ROWS && boardState[x][y]===player){ seq.unshift({c:x,r:y}); x-=dc; y-=dr; }
if(seq.length>=4) return seq.slice(0,4);
}
}
}
return null;
}


restartBtn.addEventListener('click', ()=>{
if(confirm('Restart the game?')) initBoard();
});
undoBtn.addEventListener('click', ()=>{
if(history.length===0 || gameOver) return;
const last = history.pop();
boardState[last.col][last.row]=0;
currentPlayer = last.player;
gameOver = false;
renderBoard();
setStateText(`Player ${currentPlayer}'s turn`);
});


window.addEventListener('keydown', (e)=>{
if(e.key>='1' && e.key<='7' && !gameOver){
const col = Number(e.key)-1;
if(!isColumnFull(col)){
const row = dropInColumn(col,currentPlayer);
history.push({col, row, player: currentPlayer});
renderBoard();
if(checkWin(col,row,currentPlayer)){
gameOver=true; setStateText(`Player ${currentPlayer} wins! 🎉`); highlightWinningSequence(); return;
}
if(isBoardFull()){ gameOver=true; setStateText("It's a tie!"); return; }
currentPlayer = currentPlayer===1?2:1; setStateText(`Player ${currentPlayer}'s turn`);
}
}
});


// init
initBoard();
