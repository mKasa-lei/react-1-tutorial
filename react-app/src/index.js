import React, { useState } from 'react';
import ReactDOM from "react-dom";
import "./style.scss";
import * as serviceWorker from "./serviceWorker";

const Square = (props) => {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

const Board = (props) => {
  const squareArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]

  const squares = squareArray.map((value, index) => { //マス目を作るための配列。３つの配列から９つの配列を作る
    return (
      <div key={index} className='border-row'>
        {value.map((array, number) => { //タグの中で関数を使う時は中かっこ{}
          return (
            <Square key={number} value={props.squares[array]} onClick={() => props.onClick(array)} />
          )
        })}
      </div>
    )
  })

  return (
    <div>
      { squares}
    </div>
  )
}

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    const historyData = history.slice(0, stepNumber + 1); //新たにクリックする手前までのデータ
    const current = historyData[historyData.length - 1]; //現在の手
    const squares = current.squares.slice(); //打った手のデータを配列にいれる

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O'; //trueならX、falseならOになる
    setHistory(historyData.concat({ squares: squares })); //現在のターンで打った手を新しく配列として格納する
    setStepNumber(historyData.length); //現在が何ターン目なのかの記録
    setXIsNext(!xIsNext); //trueならfalse、falseならtrueを返す
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  const historyArray = history; //過去に打った手の情報を取得
  const current = historyArray[stepNumber];　//現在の手がどのような盤面になっているのかの情報
  const winner = calculateWinner(current.squares); //現在までの手が勝利条件に当てはまっているのかどうか

  const moves = historyArray.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start'; //moveが０ならGo to startを表示させ、一手以降ならGo to moveを表示させる
    return (
      <li key={move} className='play-history'>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    )
  })

  let status; //現在までの盤面が勝利条件に当てはまるのであれば勝者を表示、当てはまらなければ次のプレイヤーを表示する
  if (winner) {
    status = 'Winner: ' + winner;
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div className='status'>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) { //XもしくはOが一列揃った状態
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
}
serviceWorker.unregister();
