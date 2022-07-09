import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//Square组件渲染一个单独的button。Square是受控组件，Board组件完全控制了Square组件
// class Square extends React.Component {
//     render() {
//       return (
//         <button
//           className="square"
//           onClick={() => this.props.onClick()}//每次在组件中调用setState时，React都会自动更新其子组件
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }

//这个项目的组件层级关系是 Game>Board>Square
//一步步把低层级组件的状态提升到高层级组件，实现高层级组件对低层级组件数据的控制

//现在把以上代码替换成函数组件啦：
function Square(props){
  return(
    //组件函数时可以不用写onClick={() => this.props.onClick()}，变简短了
    <button className='Square' onClick={props.onClick}> 
      {props.value}
    </button>
  );
}

 //Board组件渲染9个方块
 class Board extends React.Component {

  //这里被Game给提升状态了
  //为Board组件添加 构造函数
  // constructor(props){
  //   super(props);
  //   this.state={
  //     squares:Array(9).fill(null),
  //     xIsNext:true,//设置先手棋（该值确定下一步轮到哪个玩家）
  //   };
  // }

  //由于状态提升，这块儿被移到Game组件中去了
  // handleClick(i){
  //   const squares = this.state.squares.slice();//(slice方法以 新的数组对象 返回数组中被选中的元素，相当于是创建了一个副本)
  //   //当有玩家胜出，或者某个Square已经被填充时，该函数不做任何处理直接返回
  //   if(calculateWinner(squares)||squares[i]){
  //     return;
  //   }
  //   squares[i]=this.state.xIsNext ? 'X':'O';
  //   this.setState({
  //     squares:squares,
  //     xIsNext:!this.state.xIsNext,//反转xIsNext的值
  //   });
  // }

    renderSquare(i) {
      return( //这里向Square传递两个props
      <Square
       value={this.props.squares[i]}
       onClick={()=>this.props.onClick(i)}//从Board向Square传递函数，当Square被点击时，这个函数被调用
       />
      );
    }
  
    render() {
      //由于Game组件渲染了游戏状态，因此移除以下代码
      // const winner = calculateWinner(this.state.squares);
      // let status;
      // if(winner){
      //   status = 'Winner:' + winner;
      // }else{
      //   status = 'Next player:'+(this.state.xIsNext?'X':'O');
      // }
  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  //Game组件渲染默认值的棋盘
class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history:[{
          squares:Array(9).fill(null),
        }],
        stepNumber:0,
        xIsNext:true,
      };
    }

    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber + 1);//如果“回到过去”，就把“未来”产生的历史数据丢掉
      const current = history[history.length-1];
      const squares = current.squares.slice();//(slice方法以 新的数组对象 返回数组中被选中的元素，相当于是创建了一个副本)
      //当有玩家胜出，或者某个Square已经被填充时，该函数不做任何处理直接返回
      if(calculateWinner(squares)||squares[i]){
        return;
      }
      squares[i]=this.state.xIsNext ? 'X':'O';
      this.setState({
          history:history.concat([{//concat方法不会改变原数组
            squares:squares,
        }]),
        stepNumber:history.length,//保证stepNumber会跟着变
        xIsNext:!this.state.xIsNext,//反转xIsNext的值
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext:(step % 2)===0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];//最新状态
      const winner = calculateWinner(current.squares);

      //以下代码块出来的是一个历史步骤button数组
      const moves = history.map((step,move)=>{
        const desc = move ?
        'Go to move #'+move:
        'Go to game start';
        return(
          <li key={move}>
            <button onClick={()=>this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if(winner){
        status = 'Winner:'+winner;
      }else{
        status = 'Next player:'+(this.state.xIsNext? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
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
      //判断不是null，并且是同一个玩家
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];//返回获胜玩家
      }
    }
    return null;
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
