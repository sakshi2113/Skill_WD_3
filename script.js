class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.mode = 'pvp'; // 'pvp' or 'pvc'
        this.scores = { X: 0, O: 0 };
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupEventListeners();
        this.updateStatus();
    }
    
    setupEventListeners() {
        const cells = document.querySelectorAll('.cell');
        const resetBtn = document.getElementById('resetBtn');
        const modeBtns = document.querySelectorAll('.mode-btn');
        
        cells.forEach(cell => {
            cell.addEventListener('click', () => this.cellClick(cell));
        });
        
        resetBtn.addEventListener('click', () => this.resetGame());
        
        modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.mode = e.target.dataset.mode;
                this.resetGame();
            });
        });
    }
    
    cellClick(cell) {
        const index = parseInt(cell.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive) return;
        
        this.makeMove(index);
        
        // Computer's turn if in PvC mode and game is still active
        if (this.mode === 'pvc' && this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.computerMove(), 500);
        }
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateBoard();
        
        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.isBoardFull()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
            this.updateStatus();
        }
    }
    
    computerMove() {
        const availableMoves = this.board
            .map((val, idx) => val === '' ? idx : null)
            .filter(val => val !== null);
        
        if (availableMoves.length === 0) return;
        
        // Simple AI: Try to win, then block, then center, then corners, then random
        let move;
        
        // Try to win
        for (let combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] === 'O' && this.board[b] === 'O' && this.board[c] === '') {
                move = c;
                break;
            }
            if (this.board[a] === 'O' && this.board[c] === 'O' && this.board[b] === '') {
                move = b;
                break;
            }
            if (this.board[b] === 'O' && this.board[c] === 'O' && this.board[a] === '') {
                move = a;
                break;
            }
        }
        
        // Block player
        if (move === undefined) {
            for (let combo of this.winningCombinations) {
                const [a, b, c] = combo;
                if (this.board[a] === 'X' && this.board[b] === 'X' && this.board[c] === '') {
                    move = c;
                    break;
                }
                if (this.board[a] === 'X' && this.board[c] === 'X' && this.board[b] === '') {
                    move = b;
                    break;
                }
                if (this.board[b] === 'X' && this.board[c] === 'X' && this.board[a] === '') {
                    move = a;
                    break;
                }
            }
        }
        
        // Take center
        if (move === undefined && this.board[4] === '') {
            move = 4;
        }
        
        // Take corners
        if (move === undefined) {
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(index => this.board[index] === '');
            if (availableCorners.length > 0) {
                move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
        }
        
        // Random move
        if (move === undefined) {
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        
        this.makeMove(move);
    }
    
    checkWinner() {
        for (let combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winningCombo = combo;
                return true;
            }
        }
        return false;
    }
    
    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }
    
    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        
        const status = document.getElementById('status');
        status.textContent = `Player ${this.currentPlayer} Wins!`;
        status.style.color = this.currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4';
        
        this.highlightWinningCells();
    }
    
    handleDraw() {
        this.gameActive = false;
        const status = document.getElementById('status');
        status.textContent = "It's a Draw!";
        status.style.color = '#6c757d';
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
    
    updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'cell';
            if (this.board[index] === 'X') cell.classList.add('x');
            if (this.board[index] === 'O') cell.classList.add('o');
        });
    }
    
    updateStatus() {
        const status = document.getElementById('status');
        if (this.mode === 'pvc' && this.currentPlayer === 'O') {
            status.textContent = "Computer's Turn...";
        } else {
            status.textContent = `Player ${this.currentPlayer}'s Turn`;
        }
        status.style.color = this.currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4';
    }
    
    updateScores() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
    }
    
    highlightWinningCells() {
        if (!this.winningCombo) return;
        
        this.winningCombo.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('winner');
        });
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombo = null;
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateStatus();
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});