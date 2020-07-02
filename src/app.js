import React from 'react';
import './App.css';
import TicTacToe from "./tic-tac-toe"

function App() {
    const style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#eee",
}
  return (
    <div className="App" style={style}>
      <h1>Tic-Tac-Toe</h1>
      <TicTacToe />
    </div>
  );
}

export default App;
