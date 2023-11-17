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
            windowPosition.y = Math.max(0, windowPosition.y - 1);
            break;
        case 'a': // left
            windowPosition.x = Math.max(0, windowPosition.x - 1);
            break;
        case 's': // down
            windowPosition.y = Math.min(maxPosition, windowPosition.y + 1);
            break;
        case 'd': // right
            windowPosition.x = Math.min(maxPosition, windowPosition.x + 1);
            break;
    }
    renderBoard(); // Update the board to reflect the new window position
}

/**
 * Move the tiles within the sliding window based on arrow keys.
 * @param {string} direction - The key representing the direction
 */
function moveTiles(direction) {
    // Convert direction to vector (dx, dy)
    let vector = getDirectionVector(direction);
    let moved = false;

    // Prepare the board for tile movement
    prepareBoardForMovement(vector);

    // Traverse the board in the correct direction and move tiles
    traverseBoard(vector, (x, y) => {
        if (board[x][y] !== 0) {
            let {newX, newY, merged} = findFarthestPosition(x, y, vector);
            if (merged) {
                // Merge the tiles
                board[newX][newY] *= 2;
                board[x][y] = 0;
                moved = true;
            } else if (newX !== x || newY !== y) {
                // Move the tile
                board[newX][newY] = board[x][y];
                board[x][y] = 0;
                moved = true;
            }
        }
    });

    // Check if any tiles moved and place a new random number if so
    if (moved) {
        placeRandomNumber();
        renderBoard();
    }
}

/**
 * Convert a direction from key input to a vector.
 * @param {string} direction - The key representing the direction
 * @returns {{dx: number, dy: number}} The vector representing the direction
 */
function getDirectionVector(direction) {
    const map = {
        'ArrowUp': {dx: 0, dy: -1},
        'ArrowDown': {dx: 0, dy: 1},
        'ArrowLeft': {dx: -1, dy: 0},
        'ArrowRight': {dx: 1, dy: 0}
    };
    return map[direction] || {dx: 0, dy: 0};
}

/**
 * Prepare the board for tile movement.
 * @param {{dx: number, dy: number}} vector - The vector representing the direction of movement
 */
function prepareBoardForMovement(vector) {
    // Logic to prepare the board for movement will be added here
}

/**
 * Traverse the board in a specific order and apply a callback to each tile.
 * @param {{dx: number, dy: number}} vector - The vector representing the direction of movement
 * @param {function} callback - The callback function to apply to each tile
 */
function traverseBoard(vector, callback) {
    // Logic to traverse the board in the correct order will be added here
}

/**
 * Find the farthest position a tile can move to.
 * @param {number} x - The x-coordinate of the tile
 * @param {number} y - The y-coordinate of the tile
 * @param {{dx: number, dy: number}} vector - The vector representing the direction of movement
 * @returns {{newX: number, newY: number, merged: boolean}} The new position and merge flag
 */
function findFarthestPosition(x, y, vector) {
    // Logic to find the farthest position will be added here
    return { newX: x, newY: y, merged: false };
}

// Additional helper functions will be implemented here
