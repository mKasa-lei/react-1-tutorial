import React, { useState } from 'react';
import ReactDOM from "react-dom";
import "./style.scss";
import "./reset.css";
import * as serviceWorker from "./serviceWorker";

type PropsBoard = {
  value: string | null; //Boardからどのマス目を指しているのかの数字
  onClick: () => void; //functionでもいいが返す値がないことが確定しているのでvoidにする
}

const Square: React.FC<PropsBoard> = (props) => {
  return (
    <button className={'square' + ' ' + (props.value === 'X' ? 'cross' : 'round')} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

type PropsGame = {
  squares: Array<string | null>; //squareArrayからmapされた配列
  onClick: Function; //こっちはvoidではなくfunctionにする
}


const Board: React.FC<PropsGame> = (props) => {
  const squareArray: Array<Array<number>> = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
  ]

  const squares: JSX.Element[] = squareArray.map((value, index) => { //マス目を作るための配列。３つの配列から９つの配列を作る
    return (
      <div key={index} className='border-row'>
        {/* 二回目のmapでsquareArrayの中にある[0, 1, 2],[3, 4, 5],[6, 7, 8]を一つづつ取り出すことができるようになる */}
        {value.map((array, number) => { //mapの中で関数を使う時はconstは必要ない。今回はsquaresの中の配列を参照するため、ここではvalue（[0, 1, 2]）を参照する
          return (
            <Square key={number} value={props.squares[array]} onClick={() => props.onClick(array)} />
          )
        })}
      </div>
    )
  })

  return ( //書き方は簡単になったけれどやっていることはチュートリアルに書かれている物と同じ
    <div>
      { squares}
    </div>
  )
}

const Game: React.FC = () => {
  const [history, setHistory] = useState<Array<{ squares: Array<string | null> }>>([{ squares: Array(16).fill(null) }]); //過去の情報を格納するための配列を格納する。過去の手を保存するためのsquaresをsetStateする
  const [stepNumber, setStepNumber] = useState<number>(0); //現在の手数の記録
  const [xIsNext, setXIsNext] = useState<boolean>(true); //現在XとOどちらのターンなのかの情報

  const handleClick: Function = (i: number) => { //typeで書くとエラーが発生する
    const historyData: Array<{ squares: Array<string | null> }> = history.slice(0, stepNumber + 1); //新たにクリックする手前までのデータ
    const current: { squares: Array<string | null> } = historyData[historyData.length - 1]; //現在の手
    const squares: Array<string | null> = current.squares.slice(); //打った手のデータを配列にいれる

    if (calculateWinner(squares) || squares[i]) { //勝者が勝利を停止して、ゲームを続けさせられする
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O'; //trueならX、falseならOになる
    setHistory(historyData.concat({ squares: squares })); //現在のターンで打った手を新しく配列として格納する
    setStepNumber(historyData.length); //現在が何ターン目なのかの記録
    setXIsNext(!xIsNext); //trueならfalse、falseならtrueを返す
  }

  const jumpTo: Function = (step: number) => {
    setStepNumber(step); //現在が何手なのか
    setXIsNext((step % 2) === 0); //ここで偶数であるかどうかの判定をする。偶数であればtrueを返す
  }

  const historyArray: Array<{ squares: Array<string | null> }> = history; //過去に打った手の情報を取得
  const current: { squares: Array<string | null> } = historyArray[stepNumber];　//現在の手がどのような盤面になっているのかの情報
  const winner: string | null = calculateWinner(current.squares); //現在までの手が勝利条件に当てはまっているのかどうか

  const moves: JSX.Element[] = historyArray.map((step, move) => {
    const desc: string = move ? 'Go to move #' + move : 'Go to game start'; //moveが０ならGo to startを表示させ、一手以降ならGo to moveを表示させる
    return (
      <li key={move}>
        <button className='remove-button' onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    )
  })

  let status: string; //現在までの盤面が勝利条件に当てはまるのであれば勝者を表示、当てはまらなければ次のプレイヤーを表示する
  if (winner) {
    status = 'Winner: ' + winner;
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className='status'>{status}</div>
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <ol  className='play-history'>{moves}</ol>
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares: Array<string | null>) { //関数を取得するとnull、X、Oを返す関数。返すのは数値ではないので注意
  const lines: Array<Array<number>> = [ //五目並べの勝利条件が示されている配列
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];
  for (let i = 0; i < lines.length; i++) { //受け取った配列がlinesに一つでも当てはまったら最後の手はどちらだったのかを返す。それ以外の場合はnullを返す
    const [a, b, c, d]: number[] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[b] === squares[d]) {
      return squares[a];
    }
  }
  return null;
}
serviceWorker.unregister();
