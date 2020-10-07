import React from "react";
import ReactDOM from "react-dom";
import "./style.scss";
import * as serviceWorker from "./serviceWorker";
import { useState } from "react";

//コンポーネント間の関係 : Game > Board > Square
//stateはトップレベルのGameで全て管理

const Square = (props) => {
  return (
    //BoardコンポーネントからvalueプロパティとonClickプロパティを受け取る
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square //SquareコンポーネントにvalueプロパティとonClickプロパティのprops渡す（親から子にpropsを渡している）
        value={props.squares[i]} //下のrenderメソッドで渡された値(クリックされた位置の情報)がvalueに入る
        onClick={() => props.onClick(i)}
      />
    );
  };
  return (
    //外枠を描画、renderSquare()を実行で、Squareコンポーネントのbutton.Squareが描画
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setxIsNext] = useState(true);

  const handleClick = (i) => {
    const historyA = history.slice(0, stepNumber + 1); //配列historyを中の最初からstepNumber+1のまでの要素を取得して配列をつくる
    const current = historyA[historyA.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(
      historyA.concat([
        {
          squares: squares,
        },
      ])
    );
    setStepNumber(historyA.length);
    setxIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setxIsNext(step % 2 === 0);
    console.log("関数コンポーネント");
  };

  const historyA = history;
  const current = historyA[stepNumber];
  const winner = calculateWinner(current.squares);
  const moves = historyA.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      //ゲームの履歴をリスト化する
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner:" + winner;
  } else {
    status = "Next player:" + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board //Boardコンポーネントに squaresプロパティとonClickプロパティのprops渡す（親から子にpropsを渡している）
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
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

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
