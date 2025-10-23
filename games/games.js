// Games Logic
function showGamesMenu() {
    document.getElementById('games-menu').style.display = 'flex';
    document.querySelectorAll('.game-container').forEach(game => {
        game.style.display = 'none';
    });
}

function setupGames() {
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const game = e.target.dataset.game;
            document.getElementById('games-menu').style.display = 'none';
            document.getElementById(game + '-game').style.display = 'block';
            
            if (game === 'xo') setupXOGame();
            if (game === 'snake') setupSnakeGame();
            if (game === 'memory') setupMemoryGame();
            if (game === '2048') setup2048();
            if (game === 'snakeladder') setupSnakeLadder();
        });
    });
}

// XO Game
let xoBoard = ['', '', '', '', '', '', '', '', ''];
let xoCurrentPlayer = 'X';
let xoGameActive = true;

function setupXOGame() {
    const cells = document.querySelectorAll('.cell');
    const resetBtn = document.getElementById('reset-btn');
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    resetBtn.addEventListener('click', resetXOGame);
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (xoBoard[index] !== '' || !xoGameActive) return;
    
    xoBoard[index] = xoCurrentPlayer;
    e.target.textContent = xoCurrentPlayer;
    e.target.classList.add(xoCurrentPlayer.toLowerCase());
    
    if (checkWinner()) {
        document.getElementById('game-status').textContent = `Player ${xoCurrentPlayer} wins!`;
        xoGameActive = false;
    } else if (xoBoard.every(cell => cell !== '')) {
        document.getElementById('game-status').textContent = "It's a draw!";
        xoGameActive = false;
    } else {
        xoCurrentPlayer = xoCurrentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('game-status').textContent = `Player ${xoCurrentPlayer}'s turn`;
    }
}

function checkWinner() {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return winPatterns.some(pattern => {
        const [a,b,c] = pattern;
        return xoBoard[a] && xoBoard[a] === xoBoard[b] && xoBoard[a] === xoBoard[c];
    });
}

function resetXOGame() {
    xoBoard = ['', '', '', '', '', '', '', '', ''];
    xoCurrentPlayer = 'X';
    xoGameActive = true;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    document.getElementById('game-status').textContent = "Player X's turn";
}

// Snake Game
let snake, food, dx, dy, score;

function setupSnakeGame() {}

function startSnakeGame() {
    snake = [{x: 200, y: 200}];
    food = {x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20};
    dx = 20; dy = 0; score = 0;
    document.getElementById('snake-score').textContent = score;
    document.getElementById('snake-message').textContent = '';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -20; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 20; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -20; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 20; dy = 0; }
    });
    
    gameLoop();
}

function gameLoop() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || 
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        document.getElementById('snake-message').textContent = 'Game Over! Score: ' + score;
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snake-score').textContent = score;
        food = {x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20};
    } else {
        snake.pop();
    }
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 18, 18));
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, 18, 18);
    
    setTimeout(gameLoop, 250);
}

// Memory Game
let memoryCards = [];
let flippedCards = [];
let moves = 0;

function setupMemoryGame() {
    startMemoryGame();
}

function startMemoryGame() {
    const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎯'];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    flippedCards = [];
    moves = 0;
    document.getElementById('memory-moves').textContent = moves;
    document.getElementById('memory-message').textContent = '';
    
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard(e) {
    const card = e.target;
    const index = card.dataset.index;
    
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.textContent = memoryCards[index];
        card.classList.add('flipped');
        flippedCards.push({card, index});
        
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('memory-moves').textContent = moves;
            
            setTimeout(() => {
                if (memoryCards[flippedCards[0].index] === memoryCards[flippedCards[1].index]) {
                    flippedCards.forEach(({card}) => card.classList.add('matched'));
                } else {
                    flippedCards.forEach(({card}) => {
                        card.textContent = '';
                        card.classList.remove('flipped');
                    });
                }
                flippedCards = [];
                
                if (document.querySelectorAll('.memory-card.matched').length === memoryCards.length) {
                    document.getElementById('memory-message').textContent = `You won in ${moves} moves!`;
                }
            }, 1000);
        }
    }
}

// 2048 Game
let board2048, score2048, lastMoveTime = 0;

function setup2048() {
    start2048();
    document.addEventListener('keydown', handle2048Keys);
}

function start2048() {
    board2048 = Array(4).fill().map(() => Array(4).fill(0));
    score2048 = 0;
    document.getElementById('score-2048').textContent = score2048;
    document.getElementById('message-2048').textContent = '';
    addRandom2048();
    addRandom2048();
    render2048();
}

function addRandom2048() {
    const empty = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board2048[i][j] === 0) empty.push({x: i, y: j});
        }
    }
    if (empty.length > 0) {
        const pos = empty[Math.floor(Math.random() * empty.length)];
        board2048[pos.x][pos.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function render2048() {
    const board = document.getElementById('board-2048');
    board.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile-2048';
            tile.textContent = board2048[i][j] || '';
            tile.style.backgroundColor = getTileColor(board2048[i][j]);
            board.appendChild(tile);
        }
    }
}

function getTileColor(value) {
    const colors = {0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'};
    return colors[value] || '#3c3a32';
}

function handle2048Keys(e) {
    const currentTime = Date.now();
    if (currentTime - lastMoveTime < 150) return; // 150ms cooldown
    
    let moved = false;
    
    if (e.key === 'ArrowLeft') moved = moveLeft2048();
    if (e.key === 'ArrowRight') moved = moveRight2048();
    if (e.key === 'ArrowUp') moved = moveUp2048();
    if (e.key === 'ArrowDown') moved = moveDown2048();
    
    if (moved) {
        lastMoveTime = currentTime;
        addRandom2048();
        render2048();
        document.getElementById('score-2048').textContent = score2048;
        if (checkWin2048()) document.getElementById('message-2048').textContent = 'You Win!';
        else if (checkGameOver2048()) document.getElementById('message-2048').textContent = 'Game Over!';
    }
}

function moveLeft2048() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const row = board2048[i].filter(val => val !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score2048 += row[j];
                row.splice(j + 1, 1);
            }
        }
        while (row.length < 4) row.push(0);
        if (JSON.stringify(row) !== JSON.stringify(board2048[i])) moved = true;
        board2048[i] = row;
    }
    return moved;
}

function moveRight2048() {
    for (let i = 0; i < 4; i++) board2048[i].reverse();
    const moved = moveLeft2048();
    for (let i = 0; i < 4; i++) board2048[i].reverse();
    return moved;
}

function moveUp2048() {
    board2048 = transpose2048(board2048);
    const moved = moveLeft2048();
    board2048 = transpose2048(board2048);
    return moved;
}

function moveDown2048() {
    board2048 = transpose2048(board2048);
    const moved = moveRight2048();
    board2048 = transpose2048(board2048);
    return moved;
}

function transpose2048(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function checkWin2048() {
    return board2048.some(row => row.some(cell => cell === 2048));
}

function checkGameOver2048() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board2048[i][j] === 0) return false;
            if (j < 3 && board2048[i][j] === board2048[i][j + 1]) return false;
            if (i < 3 && board2048[i][j] === board2048[i + 1][j]) return false;
        }
    }
    return true;
}

// Snake and Ladder Game
let playerPosition = 0;
let currentPlayer = 1;
const snakes = {16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78};
const ladders = {1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100};

function setupSnakeLadder() {
    startSnakeLadder();
}

function startSnakeLadder() {
    playerPosition = 0;
    currentPlayer = 1;


    document.getElementById('snakeladder-message').textContent = '';
    document.getElementById('dice').style.pointerEvents = 'auto';
    createBoard();
}

function createBoard() {
    const board = document.getElementById('snakeladder-board');
    board.innerHTML = '';
    
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        
        if (snakes[i]) {
            cell.classList.add('snake');
            cell.textContent = `${i}→${snakes[i]}`;
        } else if (ladders[i]) {
            cell.classList.add('ladder');
            cell.textContent = `${i}→${ladders[i]}`;
        } else {
            cell.textContent = i;
        }
        
        if (i === playerPosition && playerPosition > 0) cell.classList.add('player');
        
        board.appendChild(cell);
    }
}

function rollDice() {
    const diceElement = document.getElementById('dice');
    if (diceElement.classList.contains('spinning')) return;
    
    diceElement.classList.add('spinning');
    
    setTimeout(() => {
        const dice = Math.floor(Math.random() * 6) + 1;
        
        // Rotate dice to show the correct face
        const rotations = {
            1: 'rotateY(0deg) rotateX(0deg)',
            2: 'rotateY(90deg) rotateX(0deg)',
            3: 'rotateY(180deg) rotateX(0deg)',
            4: 'rotateY(-90deg) rotateX(0deg)',
            5: 'rotateY(0deg) rotateX(90deg)',
            6: 'rotateY(0deg) rotateX(-90deg)'
        };
        diceElement.style.transform = rotations[dice];
        
        const newPosition = playerPosition + dice;
        
        if (newPosition <= 100) {
            playerPosition = newPosition;
            
            if (snakes[playerPosition]) {
                playerPosition = snakes[playerPosition];
                document.getElementById('snakeladder-message').textContent = `Snake! Moved down to ${playerPosition}`;
            } else if (ladders[playerPosition]) {
                playerPosition = ladders[playerPosition];
                document.getElementById('snakeladder-message').textContent = `Ladder! Climbed up to ${playerPosition}`;
            } else {
                document.getElementById('snakeladder-message').textContent = '';
            }
            
            if (playerPosition === 100) {
                document.getElementById('snakeladder-message').textContent = `Player ${currentPlayer} Wins!`;
                diceElement.style.pointerEvents = 'none';
            }
        } else {
            document.getElementById('snakeladder-message').textContent = 'Need exact number to reach 100!';
        }
        

        createBoard();
        diceElement.classList.remove('spinning');
    }, 1000);
}

// Theme synchronization
function syncTheme() {
    try {
        const savedTheme = localStorage.getItem('mainTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
        }
    } catch (e) {
        // Handle localStorage access issues
    }
}

// Initialize games when page loads
window.addEventListener('load', () => {
    setupGames();
    syncTheme();
});

// Listen for theme changes
window.addEventListener('storage', (e) => {
    if (e.key === 'mainTheme') {
        syncTheme();
    }
});

// Listen for messages from parent window
window.addEventListener('message', (e) => {
    if (e.data.type === 'themeChange') {
        syncTheme();
    }
});