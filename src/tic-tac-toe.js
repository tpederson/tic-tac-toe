import React, {Component} from "react";
import {GameState, getGameState, minimax, GAME_STATES, TILE_STATES} from "./game-state";
import PropTypes from 'prop-types';
import "./tic-tac-toe.css";

const COMPUTER_LEVEL = {
    POOR: 0.5,
    MEDIOCRE: 0.8,
    STRONG: 0.99,
};

const COMPUTER_DELAY = 700;

class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: new Array(9).fill(TILE_STATES.EMPTY),
            gameState: GAME_STATES.IN_PROGRESS,
            computerLevel: COMPUTER_LEVEL.MEDIOCRE,
        }
        this.handlePlayerSelect = this.handlePlayerSelect.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleLevelSelect = this.handleLevelSelect.bind(this);
    }

    static propTypes = {
        // something: PropTypes.bool.isRequired,
    };

    handleReset(e) {
        console.log('RESET!');
        this.setState({
            board: new Array(9).fill(TILE_STATES.EMPTY),
            gameState: GAME_STATES.IN_PROGRESS,
        });
    }

    handleLevelSelect(e) {
        console.log(`SET LEVEL TO ${e.target.value}!`);
        this.setState({computerLevel: e.target.value});
    }

    computerMove(board) {
        let selectedTile, bestScore;
        const levelForThisMove = Math.random();
        if (levelForThisMove < this.state.computerLevel) {
            [selectedTile, bestScore] = minimax(board, true, null);
            console.log(`make a GOOD move for the computer at level ${this.state.computerLevel}, ${levelForThisMove}`);
        } else {
            do {
                selectedTile = Math.trunc(Math.random() * 9);
            } while (board[selectedTile] !== TILE_STATES.EMPTY);
            console.log(`make a BAD move for the computer at level ${this.state.computerLevel}, ${levelForThisMove}`);
        }
        return selectedTile;
    }

    handlePlayerSelect(e) {
        if (this.state.gameState !== GAME_STATES.IN_PROGRESS) {
            return;
        }
        const playerTile = Number(e.target.id.split("block_")[1]);
        const board = this.state.board.map((tile, idx) => {
            return (idx === playerTile) ?
                TILE_STATES.PLAYER :
                tile
        });
        this.setState({board, gameState: getGameState(board)}, () => {
            // console.log(`after player move: ${getGameState(board)}`);
            // TODO: is there a callback here to get rid of need to pass board to getGameState?
            if (this.state.gameState === GAME_STATES.IN_PROGRESS) {
                setTimeout(() => {
                    this.setState((prevState, props) => {
                        const computerTile = this.computerMove(prevState.board);
                        const board = prevState.board.map((tile, idx) => {
                            return (idx === computerTile) ?
                              TILE_STATES.COMPUTER :
                              tile
                        });
                        // console.log(`after computer move: ${getGameState(board)}`);
                        return {board, gameState: getGameState(board)};
                    });
                }, COMPUTER_DELAY);
            }
        });
    }

    render() {
        const tiles = this.state.board.map((tile, idx) => {
            const id = `block_${idx}`;
            return (
                <div id={id} key={idx} className="block" onClick={this.handlePlayerSelect}>{tile}</div>
            );
        });
        const levelOptions = Object.entries(COMPUTER_LEVEL).map(([level, value], idx) => {
            return (
              <option value={value} key={idx}>{level}</option>
            )
        })
        return (
            <div>
                <label htmlFor="computer-level">Computer Level</label>
                <select value={this.state.computerLevel} id="computer-level" onChange={this.handleLevelSelect}>
                    {levelOptions}
                </select>
                <div className="game-board">
                    {tiles}
                </div>
                <GameState gameState={this.state.gameState}/>
                <button onClick={this.handleReset}>RESET</button>
            </div>
    );
    }
}

export default TicTacToe;