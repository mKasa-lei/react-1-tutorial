import React from "react";
import ReactDOM from "react-dom";
import "./style.scss";
import * as serviceWorker from "./serviceWorker";
import { useState } from "react";

//コンポーネント間の関係 : Game > Board > Square
//stateはトップレベルのGameで全て管理

type SquareProps = {
  value: String | null;
  onClick: () => void; //returnも使わず本当に何も返さないからvoid
};

const Square: React.FC<SquareProps> = (props) => {
  return (
    //BoardコンポーネントからvalueプロパティとonClickプロパティをpropsで受け取る
    //props.value : XかOのどちらか
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

type BoardProps = {
  onClick: Function;
  squares: Array<string | null>; //Array型で、中の要素はstring
};

const Board: React.FC<BoardProps> = (props) => {
  // <div className="board-row">1個分がsquareNumberの中の配列3つを表す（例：[0,1,2]）
  const squareNumber: Array<Array<number>> = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  //配列squareNumberに対してmapで縦3つのマスを描画
  const newSquare: JSX.Element[] = squareNumber.map((value, num: number) => {
    //このvalueは、squareNumberの中の3つの配列[0,1,2]...を表す。3つの配列に対して中のコールバック関数を実行している
    return (
      <div className="board-row" key={num}>
        {value.map((item, index) => {
          //縦3つのマスの中にさらに横3つのbuttonを作る必要があるため、divのなかでさらにmap関数を実行。このitemは配列の中身の数字１個１個を表す。
          return (
            <Square
              key={index}
              value={props.squares[item]} //SquareコンポーネントにvalueとonClickプロパティを渡している。（squares[i] = xIsNext ? "X" : "O";）
              onClick={() => props.onClick(item)}
            />
          );
        })}
      </div>
    );
  });
  return <div className="board-wrapper">{newSquare}</div>;
};

const Game: React.FC = () => {
  const [history, setHistory] = useState<
    Array<{ squares: Array<string | null> }>
  >([
    //配列history:初手から最後までの盤面の全ての状態を表す＝クリックした分squaresが増える
    {
      squares: Array(9).fill(null), //マスの状態を管理する配列を９個生成（初期値は全部null）
      //中身： history=[ {squares:[null,null,nul,null,null,nul,null,null,nul] },{squares:[null,null,nul,X,null,nul,null,null,nul] }......]
    },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0); //stepNumber(=今何手目の状態を見ているのかを表す)に初期値０を設定
  const [xIsNext, setxIsNext] = useState<boolean>(true); //xIsNex（どちらのプレーヤの手番なのかを決める）に初期値trueを設定

  const handleClick: (i: number) => void = (i: number) => {
    //配列historyの最初からstepNumber+1(クリックした回数分)までの要素を取得して配列をつくる
    const historyA: Array<{ squares: Array<string | null> }> = history.slice(
      0,
      stepNumber + 1
    );
    const current: { squares: Array<string | null> } =
      historyA[historyA.length - 1]; //historyAの１番最後＝最後にクリックした時のhistory＝最終履歴
    const squares: Array<string | null> = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O"; //xIsNextがtrueだったらXを、falseだったらOを代入
    setHistory(
      historyA.concat([
        //concat()):2つ以上の配列を結合して新しい配列を返す＝配列historyAに配列squaresを結合させたものを
        {
          squares: squares,
        },
      ])
    );
    setStepNumber(historyA.length); //historyA.length:
    setxIsNext(!xIsNext); //プレーヤーがますをクリックするたびに反転してXとOが交互にプレーできるようになる
  };

  const jumpTo: (step: number) => void = (step: number) => {
    setStepNumber(step); //StepNumberをstepに更新
    setxIsNext(step % 2 === 0); //stepが偶数ならxIsNextをtrueにする
  };

  const historyA: Array<{ squares: Array<string | null> }> = history;
  const current: { squares: Array<string | null> } = historyA[stepNumber];
  const winner: string | null = calculateWinner(current.squares);
  //着手履歴の配列をマップして画面上のボタンを表現する React 要素を作りだし、過去の手番に「ジャンプ」するためのボタンの一覧を表示
  const moves: JSX.Element[] = historyA.map((step, move) => {
    // 与えられた関数を配列historyAのすべての要素に対して呼び出し、その結果からなる新しい配列を生成
    const desc: string = move ? "Go to move #" + move : "Go to game start";
    return (
      //ゲームの履歴をリスト化する
      <li key={move}>
        <button className="history-list" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  //ここでは次のプレーヤーを表示するか勝者を表示するかを判定
  let status; //statusは勝敗によって中身が再代入されるのでletを使ってる
  if (winner) {
    status = "Winner: " + winner;
    return (
      <div>
        <div className="container">
          <p className="bound">
            <span>
              プレイヤー{winner}
              <br />
              の勝ちです！！
            </span>
          </p>
        </div>
        <p className="desc">
          最初からプレイするためには
          <br />
          ページを再読み込みしてください
        </p>
      </div>
    );
  } else {
    status = "Next player :" + (xIsNext ? "X" : "O");
  }

  return (
    <div>
      <div className="scroll">
        <h1 className="game-title">
          <span className="point-color">T</span>ic-t
          <span className="point-color">a</span>
          c-to
          <span className="point-color">e</span>
        </h1>
      </div>
      <div className="game">
        <div className="game-board">
          <Board //Boardコンポーネントに squaresプロパティとonClickプロパティのprops渡す（親から子にpropsを渡している）
            squares={current.squares}
            onClick={(i: number) => handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="next-player">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
};
//勝敗判定の関数
const calculateWinner: (squares: Array<string | null>) => string | null = (
  squares: Array<string | null>
) => {
  const lines: number[][] = [
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
    const [a, b, c]: Array<number> = lines[i];
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
