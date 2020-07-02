import React from "react";

export const GAME_STATES = {
    IN_PROGRESS: null,
    PLAYER_WON: -10,
    COMPUTER_WON: 10,
    DRAW: 0,
};

export const TILE_STATES = {
    EMPTY: '',
    PLAYER: 'X',
    COMPUTER: 'O',
};

function checkForWin(board, a, b, c) {
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== TILE_STATES.EMPTY) {
        return board[a];
    }
}

export function getGameState(board) {
    // TODO: is there a cleaner more concise refactor for this code?
    for (let i = 0; i < 3; i++) {
        var winner = checkForWin(board, i * 3, i * 3 + 1, i * 3 + 2);
        if (winner) {
            return winner === TILE_STATES.PLAYER ? GAME_STATES.PLAYER_WON : GAME_STATES.COMPUTER_WON;
        }
        winner = checkForWin(board, i, 3 + i, 6 + i);
        if (winner) {
            return winner === TILE_STATES.PLAYER ? GAME_STATES.PLAYER_WON : GAME_STATES.COMPUTER_WON;
        }
    }
    winner = checkForWin(board, 0, 4, 8);
    if (winner) {
        return winner === TILE_STATES.PLAYER ? GAME_STATES.PLAYER_WON : GAME_STATES.COMPUTER_WON;
    }
    winner = checkForWin(board, 2, 4, 6);
    if (winner) {
        return winner === TILE_STATES.PLAYER ? GAME_STATES.PLAYER_WON : GAME_STATES.COMPUTER_WON;
    }
    if (board.some(tile => tile === TILE_STATES.EMPTY)) {
        return GAME_STATES.IN_PROGRESS;
    }
    return GAME_STATES.DRAW;
}

export function minimax(board, maximize, chosenTile) {
    const score = getGameState(board);
    if (score !== GAME_STATES.IN_PROGRESS) {
        // console.log(`reached end state: ${chosenTile}, ${maximize}, ${score}`);
        return [chosenTile, score];
    }
    let bestScore = maximize ? GAME_STATES.PLAYER_WON : GAME_STATES.COMPUTER_WON;
    let bestTile;
    for (let i = 0; i < 9; i++) {
        if (board[i] === TILE_STATES.EMPTY) {
            board[i] = maximize ? TILE_STATES.COMPUTER : TILE_STATES.PLAYER;
            const [tileChoice, newScore] = minimax(board, !maximize, i);
            if (maximize && newScore > bestScore) {
                bestScore = newScore;
                bestTile = i;
                // console.log(`maximized computer choosing ${i} with score ${newScore}`);
            } else if (!maximize && newScore < bestScore) {
                bestScore = newScore;
                bestTile = i;
            }
            board[i] = TILE_STATES.EMPTY;
        }
    }
    return [bestTile, bestScore];
}

export const GameState = ({gameState}) => {
    let gameStateMsg;
    switch (gameState) {
        case GAME_STATES.IN_PROGRESS:
            gameStateMsg = "Try to beat the computer";
            break;
        case GAME_STATES.DRAW:
            gameStateMsg = "It's a draw!";
            break;
        case GAME_STATES.PLAYER_WON:
            gameStateMsg = "You won!";
            break;
        case GAME_STATES.COMPUTER_WON:
            gameStateMsg = "Sorry, you lost.";
            break;
    }
    console.log(`game state: ${gameStateMsg}`);
    return (
        <h2>{gameStateMsg}</h2>
    );
}