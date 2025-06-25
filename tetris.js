const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const COLS = 10, ROWS = 20, BLOCK_SIZE = 30;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let score = 0;

const PIECES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]], // Z
    [[1,0,0],[1,1,1]], // J
    [[0,0,1],[1,1,1]]  // L
];

const COLORS = ['#000', '#0ff', '#ff0', '#f0f', '#0f0', '#f00', '#00f', '#fa0'];

let currentPiece = {
    shape: PIECES[Math.floor(Math.random() * PIECES.length)],
    x: 4, y: 0,
    color: Math.floor(Math.random() * 7) + 1
};

function drawBlock(x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) drawBlock(x, y, board[y][x]);
        }
    }
    
    // Draw current piece
    currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) drawBlock(currentPiece.x + dx, currentPiece.y + dy, currentPiece.color);
        });
    });
}

function isValidMove(piece, dx, dy, rotation) {
    const shape = rotation || piece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = piece.x + x + dx;
                const newY = piece.y + y + dy;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) board[currentPiece.y + dy][currentPiece.x + dx] = currentPiece.color;
        });
    });
    
    // Clear lines
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            score += 100;
            y++;
        }
    }
    
    scoreElement.textContent = score;
    
    // New piece
    currentPiece = {
        shape: PIECES[Math.floor(Math.random() * PIECES.length)],
        x: 4, y: 0,
        color: Math.floor(Math.random() * 7) + 1
    };
    
    if (!isValidMove(currentPiece, 0, 0)) {
        alert('Game Over! Score: ' + score);
        board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        score = 0;
        scoreElement.textContent = score;
    }
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) => 
        currentPiece.shape.map(row => row[i]).reverse()
    );
    if (isValidMove(currentPiece, 0, 0, rotated)) {
        currentPiece.shape = rotated;
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            if (isValidMove(currentPiece, -1, 0)) currentPiece.x--;
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (isValidMove(currentPiece, 1, 0)) currentPiece.x++;
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (isValidMove(currentPiece, 0, 1)) currentPiece.y++;
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotatePiece();
            break;
    }
});

function gameLoop() {
    if (isValidMove(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        placePiece();
    }
    draw();
}

setInterval(gameLoop, 500);
draw();