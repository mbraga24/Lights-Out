import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  createBoard() {
    let board = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let rows = [];
      for (let x = 0; x < this.props.ncols; x++) {
        rows.push(Math.random() < this.props.chanceLightStartsOn)
        // [0.44, 0.12, 0.89, 0.23, 0.76] 
        // [F, T, F, T, F]
      }
      board.push(rows)
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */
  flipCellsAround(coord) {
    // Using a destructor assign all the values of rows and cols from props to ncols and nrows
    let { ncols, nrows } = this.props;
    // Shorten this.state.board by assiging it to a variable
    let board = this.state.board;
    // Use split() and map() to assign the string value from coord to y and x without "-" symbol
    let [y, x] = coord.split("-").map(Number)

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }
    flipCell(y, x)
    flipCell(y, x - 1)
    flipCell(y, x + 1)
    flipCell(y - 1, x)
    flipCell(y + 1, x)

    // win when every cell is turned off
    let hasWon = board.every(row => row.every(function(cell) {
      return cell === false
    }))

    this.setState({ board: board, hasWon: hasWon});
  }

  makeTable() {
    let tableBoard = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let rows = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`
        rows.push(<Cell key={coord} isLit={this.state.board[y][x]} flipCellsAroundMe={() => this.flipCellsAround(coord)} />)
      }
      tableBoard.push(<tr key={y}>{rows}</tr>)
    }

    return <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  }


  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    return (  
      <div>
        {this.state.hasWon ? (
          <div className="Board-title">
            <div className="Board-winner">
              <span className="Board-neon-orange">You</span>
              <span className="Board-neon-blue">Won!</span>
            </div>
          </div>
          ) : (  
          <div>
            <div className="Board-title">
              <div className="Board-neon-orange">Lights</div>
              <div className="Board-neon-blue">Out</div>
            </div>
            {this.makeTable()}
          </div>
        )}
      </div>
    )
  }
}

export default Board;