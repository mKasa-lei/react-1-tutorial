import React from "react";
import ReactDOM from "react-dom";
import "./style.scss";
import * as serviceWorker from "./serviceWorker";

function Square(props) {
  return ( //Boardから処理を受け取り、クリックした時、盤面にXかOを表示させる
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return ( //Squareに現在がどちらを表示させるのかとクリックしたさいのイベントを送る
      <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
    );
  }

  render() {　//画面に表示されるマス目の作成
    return (
      <div>
        <div className='border-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='border-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='border-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null), //表示されている物とは別に記録するための配列を作成
      }],
      stepNumber: 0, //手数のカウント（今が何ターン目なのか）
      xIsNext: true, //現在がXなのかOなのかの判定
    };
  }

  handleClick(i) { //マス目をクリックしたら呼び出される
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //新たにクリックする前の手までの状態
    const current = history[history.length - 1]; //現在の手数
    const squares = current.squares.slice(); //現在の手数の保存？
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; //XとOを交互に表示させる
    this.setState({
      history: history.concat([{ //this.state.historyの配列の中に過去の手の状態の配列を新たに作る
        squares: squares, //現在の手を過去のものとして保存
      }]),
      stepNumber: history.length, //手数の記録
      xIsNext: !this.state.xIsNext, //OならXを、XならOを返すようにする
    });
  }

  jumpTo(step) { //クリックした手数の盤面の状態を表示させる
    this.setState({
      stepNumber: step, //現在が何手目なのかの情報を格納する
      xIsNext: (step % 2) === 0, //偶数（後手）ならOを返すようにする ここ何でfalseじゃなくて0を渡してるの？
    });
  }

  render() {
    const history = this.state.history; //一手前の盤面を記録する配列
    const current = history[this.state.stepNumber]; //現在が何ターン目なのか
    const winner = calculateWinner(current.squares); //マス目が一列揃った状態かどうかの判定

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to start'; //0手目であれば一から、そうでなければそれまでの手を表示させる
      return (
        <li key={move} className='play-history'>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <p>{move}</p>
        </li>
      )
    })

    let status; //勝者が決まっているかどうかの表示をする
    if (winner) { //一列揃っていたら勝者を表示（calculateWinnerと同じ状態になった場合の処理）
      status = 'Winner: ' + winner;
    }
    else { //一列揃っていない状態の時
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); //次がどちらの手になるのかの結果を格納する
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className='status'>{status}</div>
          <ol>{moves}</ol> {/* 盤面が増えるたびに過去の盤面を表示させるボタンを表示させるボタンを増やす */}
        </div>
      </div>
    );
  }
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
