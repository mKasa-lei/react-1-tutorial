import React, { useState } from "react"; //reactを使うためのimport
import ReactDOM from "react-dom"; //reactDOMを使うためのimport
import "./style.scss"; //sassの読み込み
import * as serviceWorker from "./serviceWorker"; // バックグラウンドで動作したeventに対して何かを実行するためのAPI

const Square=(props)=> { //borad上の四角の関数コンポーネント
    return ( //構文を関数としてpropsにわたす
      <button  //ボタンタグ開始
      className="square" onClick={props.onClick}>  
        {props.value} 
      </button> //クリックした際に四角の中の状態を変化させる
    );
}

const Board=(props)=> {    //盤面のレンダリングとクリック次の操作のためのクラスをReactのコンポーネントを使い作成
  
  const squareNumbers=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
  ]  
  return (
    <div> 
    {
    squareNumbers.map((value,index)=>{
      return(
        <div key={index}>
          {value.map((cell)=>{
            return(
              <Square key={cell}
              value={props.squares[cell]} 
              onClick={()=>{props.onClick(cell)}}
            />      
            )
          })
        }
        </div>
      )
    })
  }
    </div>
    );
  };

const Game=()=>{
  const [history,setHistory]=useState([{squares:Array(9).fill(null)}])
  const [stepNumber,setStepNumber]=useState(0);
  const [xIsNext,setXisNext]=useState(true);

  const historyCurrent=history; //
  const current=historyCurrent[stepNumber]; //現在選択されている手番をレンダリングする
  const winner = calculateWinner(current.squares);

  const handleClick=(i)=>{ //マス目をクリックした際に行われる処理
    const historyfuture=history.slice(0,stepNumber + 1); //操作している手番から未来にあたる履歴を削除する
    const current = historyfuture[historyfuture.length - 1]; //historuで行って先の番号を保存しているので現在の番号はhistoryの1手後になる
    const squaresA = current.squares.slice(); //現在地点よりも先に履歴がある場合捨て去り新しい配列にする
    if(calculateWinner(squaresA)||squaresA[i]){ //勝者が決まっていたら
      return; //終了する
    }
    squaresA[i]=xIsNext ? 'X':'O'; //真偽値を入れ替えることで手番を交互に入れ替える
      setHistory(historyfuture.concat([{
        squares:squaresA
      }])) //非破壊で履歴を保存する
      setStepNumber(historyfuture.length); //何手目か
      setXisNext(!xIsNext); //stateに保存されているXisNextがtrueの場合は反転させる
    };

  const jumpTo=(step)=>{ //タイムトラベル用の動作　クリックした場合クリックした部分の手数に移動　その手数が偶数なら次の手番をXとする
      setStepNumber(step);
      setXisNext((step%2)===0);
  }

    const moves = historyCurrent.map((step,move)=>{ //history
      const desc = move ? //moveに数値が入っている場合
        'Go to move #' + move : //何手目に移動するかの履歴を表示
        'Go to game start'; //そうでない場合、ゲームスタート前であることを表示
        return (
          <li key={move}> 
            <button onClick={()=>jumpTo(move)}>{desc}</button>
          </li> //履歴をkeyとして保存、手数としてjumpToに渡す
        );
    });

    let status; //statusの変数を用意
    if (winner){ //もし勝者が決まっていたら
      status='winner:' +winner; //ステータスに勝利者を表示
    }else{ //そうでない場合
      status='Next player: '+(xIsNext ? 'X':'O'); //次にプレイするプレイヤーを表示
    }
    console.log(current.squares)
    return (
      <div className="game"> 
        <div className="game-board">
          <Board 
          squares= {current.squares}
          onClick={(i)=>handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div> 
          <ol>{moves}</ol>
        </div>
      </div> //ゲーム盤、ゲームの状況、何手動いているか、およびタイムバックボタンのレンダリング
    );
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
