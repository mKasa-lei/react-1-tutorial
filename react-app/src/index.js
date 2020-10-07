import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./style.scss";
import * as serviceWorker from "./serviceWorker";

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

const renderSquare = (i, props) => {
  return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
};

const Board = (props) => {
  return (
    <div>
      <div className="board-row">
        {renderSquare(0, props)}
        {renderSquare(1, props)}
        {renderSquare(2, props)}
      </div>
      <div className="board-row">
        {renderSquare(3, props)}
        {renderSquare(4, props)}
        {renderSquare(5, props)}
      </div>
      <div className="board-row">
        {renderSquare(6, props)}
        {renderSquare(7, props)}
        {renderSquare(8, props)}
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const handleClick = (
  i,
  history,
  stepNumber,
  xIsNext,
  setHistory,
  setStepNumber,
  setXIsNext
) => {
  const historySlice = history.slice(0, stepNumber + 1);
  const current = historySlice[historySlice.length - 1];
  const squares = current.squares.slice();
  if (calculateWinner(squares) || squares[i]) {
    return;
  }
  squares[i] = xIsNext ? "X" : "O";
  setHistory(
    history.concat([
      {
        squares: squares,
      },
    ])
  );
  setStepNumber(historySlice.length);
  setXIsNext(!xIsNext);
};

const jumpTo = (step, setStepNumber, setXIsNext) => {
  setStepNumber(step);
  setXIsNext(step % 2 === 0);
};

const Game = () => {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const historySlice = history;
  const current = historySlice[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move, setStepNumber, setXIsNext)}>
          {desc}
        </button>
      </li>
    );
  });
  const mark = xIsNext ? "X" : "O";
  const status = winner ? "Winner: " + winner : "Next player: " + mark;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) =>
            handleClick(
              i,
              history,
              stepNumber,
              xIsNext,
              setHistory,
              setStepNumber,
              setXIsNext
            )
          }
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
