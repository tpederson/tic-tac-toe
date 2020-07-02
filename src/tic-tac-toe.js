import React, {Component} from "react";
import {GameState, getGameState, minimax, GAME_STATES, TILE_STATES} from "./GameState";
import PropTypes from 'prop-types';
import "./TicTacToe.css";


class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: new Array(9).fill(TILE_STATES.EMPTY),
            gameState: GAME_STATES.IN_PROGRESS,
        }
        this.handlePlayerSelect = this.handlePlayerSelect.bind(this);
        this.handleReset = this.handleReset.bind(this);
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

    computerMove(board) {
        // let selectedTile;
        // do {
        //     selectedTile = Math.trunc(Math.random() * 9);
        // } while (board[selectedTile] !== TILE_STATES.EMPTY);
        // console.log(`computer selected ${selectedTile}`);
        // console.log(`best move? : ${minimax(board, true, null)}`);
        const [selectedTile, bestScore] = minimax(board, true, null);
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
            console.log(`after player move: ${getGameState(board)}`);
            // TODO: is there a callback here to get rid of need to pass board to getGameState?
            if (this.state.gameState === GAME_STATES.IN_PROGRESS) {
                this.setState((prevState, props) => {
                    const computerTile = this.computerMove(prevState.board);
                    const board = prevState.board.map((tile, idx) => {
                        return (idx === computerTile) ?
                            TILE_STATES.COMPUTER :
                            tile
                    });
                    console.log(`after computer move: ${getGameState(board)}`);
                    return {board, gameState: getGameState(board)};
                });
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
        return (
            <div>
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