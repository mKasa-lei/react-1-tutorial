import React, { useState } from 'react';
import ReactDOM, { render } from "react-dom";
import "./style.scss";
import * as serviceWorker from "./serviceWorker";

/*
* 正方形のマス目（ボタン機能）
*/
const Square = (props) => {
    // クラスコンポーネント: onClick={() => this.props.onClick()}
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
};

/**
* 盤面
*/
const Board = (props) => {
    const renderSquare = (i) => { // Squareコンポーネントにprop経由でデータを渡す
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }
    return (
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
}

/**
 * タイムトラベル機能、トップレベルコンポーネント、stateはトップレベルコンポーネントで管理する（子コンポーネントにstateを管理すると、親コンポーネントがアクセスできない）
 */
const Game = () => {
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null), // 値が存在しない要素（null）を指定して、配列を生成する
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (i) => {
        const newHistory = history.slice(0, stepNumber + 1); // slice(開始index, 終了index)
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice(); // squares配列をコピーする(直接[mutate: 書き換え]をしてしまうのを防ぐため)
        if (calculateWinner(squares) || squares[i]){ // 勝敗がついている、あるいはマス目が埋まってる場合はreturnする
            return;
        }
        squares[i] = xIsNext ? 'X' : '◯'; // xIsNextがtrueの時→Xを表示、falseの時→◯を表示
        setHistory(newHistory.concat([ // history配列に最新の盤面を追加する、concatはミューテートしない（pushはミューテ-トされる）
            {
                squares: squares, // 最新のsquares(盤面)状態に変更する
            }
        ]));
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
    }
    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0); // stepはindex番号
    }
    const current = history[stepNumber]; // 現在（◯回目）のsquaresの状態
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => { // map((配列の各アイテム, index)) step→各squares状態のこと
        const desc = move ?
            'Go to move #' + move :
            'Go to game start'; // 最初は何もクリックされていないためmove（index）が存在しない
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner){
        status = 'Winner: ' + winner; // 勝者を示す
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : '◯'); // 次のプレイヤーを示す
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={handleClick}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );

    /* history配列の中にオブジェクト（squares）が入っている
        history = [
            {
                squares: [
                    null, null, null,
                    null, null, null,
                    null, null, null
                ]
            }
        ]
        */
    //}
}

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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
          return squares[a];
      }
  }
  return null;
};
ReactDOM.render(
    <Game />,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();