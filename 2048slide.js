// Constants for the game size
const GAME_SIZE = 16; // 16x16 for the larger field
const WINDOW_SIZE = 4; // 4x4 for the sliding window

// Game state
let board = []; // Represents the entire 16x16 board
let windowPosition = { x: 0, y: 0 }; // Top-left position of the 4x4 window

/**
 * Initialize the game board to a 16x16 grid with all zeros.
 */
function initializeBoard() {
    for (let i = 0; i < GAME_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < GAME_SIZE; j++) {
            board[i][j] = 0;
        }
    }
    // Place the initial two numbers on the board
    placeRandomNumber();
    placeRandomNumber();
}

/**
 * Place a random number (2 or 4) in an empty spot on the board.
 */
function placeRandomNumber() {
    // Implementation for placing a random number on the board
}

document.addEventListener('DOMContentLoaded', (event) => {
    initializeBoard(); // Set up the initial state of the board
    renderBoard(); // Render the board on the page

    // Event listeners for keypresses (arrow keys and WASD)
    document.addEventListener('keydown', handleKeyPress);
});

/**
 * Render the board on the page.
 */
function renderBoard() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear the previous state

    const boardElement = document.createElement('div');
    boardElement.className = 'board';

    for (let i = 0; i < GAME_SIZE; i++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        for (let j = 0; j < GAME_SIZE; j++) {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            // Check if the current tile is within the sliding window
            if (i >= windowPosition.x && i < windowPosition.x + WINDOW_SIZE &&
                j >= windowPosition.y && j < windowPosition.y + WINDOW_SIZE) {
                tileElement.classList.add('sliding-window');
            }
            tileElement.textContent = board[i][j] === 0 ? '' : board[i][j];
            rowElement.appendChild(tileElement);
        }

        boardElement.appendChild(rowElement);
    }

    gameContainer.appendChild(boardElement);
}

/**
 * Handle keypress events for moving the sliding window and tiles.
 * @param {KeyboardEvent} event - The keydown event object
 */
function handleKeyPress(event) {
    switch (event.key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            // Handle sliding window movement
            moveWindow(event.key);
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            // Handle tile movement within the sliding window
            moveTiles(event.key);
            break;
    }
}

/**
 * Move the sliding window based on the WASD keys.
 * @param {string} direction - The key representing the direction
 */
function moveWindow(direction) {
    const maxPosition = GAME_SIZE - WINDOW_SIZE;
    switch (direction) {
        case 'w': // up
            windowPosition.x = Math.max(0, windowPosition.x - 1);
            break;
        case 'a': // left
            windowPosition.y = Math.max(0, windowPosition.y - 1);
            break;
        case 's': // down
            windowPosition.x = Math.min(maxPosition, windowPosition.x + 1);
            break;
        case 'd': // right
            windowPosition.y = Math.min(maxPosition, windowPosition.y + 1);
            break;
    }
    renderBoard(); // Update the board to reflect the new window position
}

/**
 * Move the tiles within the sliding window based on arrow keys.
 * @param {string} direction - The key representing the direction
 */
function moveTiles(direction) {
    // Implementation for moving the tiles within the sliding window
}
