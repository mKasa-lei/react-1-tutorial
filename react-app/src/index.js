import ReactDOM from "react-dom";
import "./style.scss";
import React, { useState } from "react";

/* 全画面 */
const Game = () => {
  /* クラスにコンストラクタを追加し、stateを初期化 */
  /* 9マス全ての状態をnullに設定 */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /* 初手の盤面の状態 */
  const [history, setHistory] = useState([{ squares }]);
  /*0手目の状態を見ている */
  const [stepNumber, setStepNumber] = useState(0);
  /*Xの手番*/
  const [xIsNext, setXIsNext] = useState(true);

  /* i番目のマスを押した時の挙動 */
  const handleClick = (i) => {
    /* イミュータ（望む変更を加えた新しいデータのコピーで古いデータを置き換える） */
    /* squaresのコピー作成*/
    /* ０手目から現在までの履歴をコピー*/
    const untilHistory = history.slice(0, stepNumber + 1); //slice(start,end) endは含まれない
    /* 現在の状態 */
    const current = history[untilHistory.length - 1];

    /* 現在の盤面のコピー作成*/
    const squares = current.squares.slice();
    /* ゲームが終わっているorそのマスがすでに埋まっているならreturn */
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    /* this.state.xIsNextがtrueならば'X'、falseならば'O'をsquares[i]に上書き */
    squares[i] = xIsNext ? "X" : "O";
    /* 現在の盤面 */
    setSquares(squares);
    /* 履歴状態に現在の盤面を追加 */
    setHistory(untilHistory.concat([{ squares: squares }]));
    /* 手番を次の手番に変更 */
    setStepNumber(untilHistory.length);
    /* Xの手番がtrueならばfalseに,falseならばtrue */
    setXIsNext(!xIsNext);
  };

  /* move番目の履歴ボタンを押した時の挙動 */
  const jumpTo = (step) => {
    /* step(move)手目の状態をみている */
    setStepNumber(step);
    /* stepNumerの値が偶数ならばxIsNextをtrue */
    setXIsNext(step % 2 === 0);
  };

  /* 初手から現在までの盤面の状態 */
  const currentHistory = history;
  /* 現在の盤面の状態 */
  const current = currentHistory[stepNumber];
  /* 現在のゲーム状態勝敗確認 */
  const winner = calculateWinner(current.squares); /* 履歴を並べる */
  const moves = currentHistory.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";

    /* ゲーム履歴ボタンを表示 */
    return (
      <li key={move}>
        {/* ボタンがクリックされたら、jumptoメソッドをmoveの値を持って呼び出す */}
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  /* 手番、勝敗状態をstatusに保存する */
  let status;
  /* winnerがいるならば */
  if (winner) {
    /* statusを以下に変更 */
    status = "Winner: " + winner;
    /* winnerがいなければ */
  } else {
    /* statusを以下に変更 */
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  /* ゲーム全体を表示 */
  return (
    <div className="game">
      <div className="game-board">
        {/* Boardコンポーネントを呼び出し */}
        {/* current,squaresをsquaresとして持たせる */}
        {/* BoardコンポーネントでonClickが押されたらhandleClickを呼び出し */}
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        {/* status状態を表示 */}
        <div>{status}</div>
        {/* movesを表示 */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

/* 盤面 */
const Board = (props) => {

  const squares = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const squareList = squares.map((line, column) => {
    const square=line.map((lineValue,lineOrder)=>{
      return(
        <Square key={lineOrder}
        value={props.squares[lineValue]}
        onClick={() => props.onClick([lineValue])}
      />
      )
    })
    /* 盤面表示 */
    return (
      /* renderSquare(i)を呼び出す */
      <div key={column} className="board-row">
        {square}
      </div>
    );
  });

  return <div>{squareList}</div>;
};

/* 1マスの表示 */
/* データの入った “props”（「プロパティ」の意味）というオブジェクトを引数としてひとつ受け取る */
const Square = (props) => {
  return (
    /* マスが押されたらBoardのSquareのonClickを呼び出す */
    <button className="square" onClick={props.onClick}>
      {/* props.value(suare)を○×を表示 */}
      {props.value}
    </button>
  );
};

/* 勝敗判定 */
/* 盤面状態を引数に持つ */
const calculateWinner = (squares) => {
  /* 縦横斜めのline */
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
  /* line配列分forを実行 */
  for (let i = 0; i < lines.length; i++) {
    /* i番目のlineを[a,b,c]に代入 */
    const [a, b, c] = lines[i];
    /* a,b,cが全て同じであれば */
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      /* aの中身を返す（○ or ×） */
      return squares[a];
    }
  }
  /* nullを返す */
  return null;
};

/* Gameをレンダーする */
ReactDOM.render(<Game />, document.getElementById("root"));
