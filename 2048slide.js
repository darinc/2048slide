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
    // Place the initial set of tiles on the board
    initialTiles();
}

/**
 * Place an initial set of tiles on the board.
 */
function initialTiles() {
    placeTile(2);
    placeTile(2);
    // You can add more tiles or logic for random values here if desired
}

/**
 * Place a random number (2 or 4) in an empty spot on the board.
 */
function placeRandomNumber() {
    for (let i = 0; i < 2; i++) { // Place two tiles
        placeTile(Math.random() < 0.9 ? 2 : 4);
    }
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
            if (i >= windowPosition.y && i < windowPosition.y + WINDOW_SIZE &&
                j >= windowPosition.x && j < windowPosition.x + WINDOW_SIZE) {
                tileElement.classList.add('sliding-window');
            }
            let value = board[i][j];
            tileElement.textContent = value === 0 ? '' : value;
            tileElement.className = 'tile' + (value ? ' value-' + value : '');
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
    console.log(`Sliding window moved to: x=${windowPosition.x}, y=${windowPosition.y}`);
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

    // Check if any tiles moved and place four new random numbers if so
    if (moved) {
        placeRandomNumber(); // This will now place four new tiles
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
    // Set up a merged flag for each cell to prevent multiple merges in one move
    for (let i = 0; i < GAME_SIZE; i++) {
        for (let j = 0; j < GAME_SIZE; j++) {
            board[i][j].merged = false;
        }
    }
}

/**
 * Traverse the board in a specific order and apply a callback to each tile.
 * @param {{dx: number, dy: number}} vector - The vector representing the direction of movement
 * @param {function} callback - The callback function to apply to each tile
 */
function traverseBoard(vector, callback) {
    const startX = vector.dx === 1 ? GAME_SIZE - 1 : 0;
    const startY = vector.dy === 1 ? GAME_SIZE - 1 : 0;
    const deltaX = vector.dx === 0 ? 1 : -1 * vector.dx;
    const deltaY = vector.dy === 0 ? 1 : -1 * vector.dy;

    for (let x = startX; (vector.dx === 1 ? x >= 0 : x < GAME_SIZE); x += deltaX) {
        for (let y = startY; (vector.dy === 1 ? y >= 0 : y < GAME_SIZE); y += deltaY) {
            callback(x, y);
        }
    }
}

/**
 * Find the farthest position a tile can move to.
 * @param {number} x - The x-coordinate of the tile
 * @param {number} y - The y-coordinate of the tile
 * @param {{dx: number, dy: number}} vector - The vector representing the direction of movement
 * @returns {{newX: number, newY: number, merged: boolean}} The new position and merge flag
 */
function findFarthestPosition(x, y, vector) {
    let previous;

    // Keep moving the position until we hit an obstacle
    do {
        previous = { x: x, y: y };
        x += vector.dx;
        y += vector.dy;
    } while (x >= 0 && x < GAME_SIZE && y >= 0 && y < GAME_SIZE && board[x][y] === 0);

    let merged = false;
    // Check for a possible merge
    if (x >= 0 && x < GAME_SIZE && y >= 0 && y < GAME_SIZE && board[x][y] === board[previous.x][previous.y] && !board[x][y].merged) {
        merged = true;
        // Mark the tile as merged
        board[x][y].merged = true;
    } else {
        // If no merge, we step back to the previous position
        x = previous.x;
        y = previous.y;
    }

    return { newX: x, newY: y, merged: merged };
}

/**
 * Place a tile with a value on the board at a random empty position.
 * @param {number} value - The value of the tile to place (typically 2 or 4).
 */
function placeTile(value) {
    let emptyPositions = [];
    for (let i = 0; i < GAME_SIZE; i++) {
        for (let j = 0; j < GAME_SIZE; j++) {
            if (board[i][j] === 0) {
                emptyPositions.push({ x: i, y: j });
            }
        }
    }
    if (emptyPositions.length > 0) {
        let randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        board[randomPosition.x][randomPosition.y] = value;
    }
}
// Additional helper functions will be implemented here
