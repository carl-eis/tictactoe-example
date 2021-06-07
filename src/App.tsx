import React, { useState } from 'react';
import './App.css';
import styled from 'styled-components';

const BoardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 30px;
  margin: 0;
  box-sizing: border-box;
  border: 3px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Square = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  font-size: 25px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 3px;
  border: 2px solid black;
  box-sizing: border-box;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const ButtonContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.button`
  padding: 4px;
  margin: 0;
  height: 40px;
  font-size: 25px;
  margin-top: 25px;
`

const defaultBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

const AMOUNT_ROWS = 3;
const AMOUNT_COLUMNS = 3;

function App() {
  const [board, setBoard] = useState<string[][]>(defaultBoard)
  const [currentPlayer, setCurrentPlayer] = useState('X')

  const [gameOver, setGameOver] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState<string | null>(null);

  const resetBoard = () => {
    setBoard(defaultBoard)
    setWinningPlayer(null);
    setGameOver(false);
    setCurrentPlayer('X');
  }

  const handleBoardClick = (rowNumber, colNumber) => (event) => {
    if (gameOver) {
      return;
    }
    if (board[rowNumber][colNumber] !== '') {
      return;
    }
    const nextBoard = board.map((row, rowIndex) => {
      if (rowIndex === rowNumber) {
        return row.map((column, columnIndex) => {
          if (columnIndex === colNumber) {
            return currentPlayer;
          }
          return column;
        })
      }
      return row;
    })

    validateBoard(nextBoard)
    setBoard(nextBoard);
    currentPlayer === 'X' ? setCurrentPlayer('O') : setCurrentPlayer('X')
  }

  const validateBoard = (boardToValidate: string[][]) => {
    let gameOver = false;
    let winner = '';

    function checkGroup(group: string[]): boolean {
      // If entries are blank, ignore
      if (group.some(item => item === '')) {
        return false;
      }

      return group.every(item => item === group[0])
    }

    function checkColumns() {
      for (let i = 0; i < AMOUNT_COLUMNS; i++) {
        const column = boardToValidate.map(row => row[i]);
        const containsWinner = checkGroup(column);
        if (containsWinner) {
          gameOver = true;
          winner = column[0];
          break;
        }
      }
    }

    function checkRows() {
      const winningRow = boardToValidate.find(row => checkGroup(row))

      if (winningRow) {
        winner = winningRow[0];
        gameOver = true;
      }
    }

    function getDiagonals() {
      let diag1: string[] = [];
      let diag2: string[] = [];

      boardToValidate.forEach((row, index) => {
        diag1.push(row[index])
        diag2.push(row[Math.abs(index - (AMOUNT_COLUMNS - 1))])
      })

      return [diag1, diag2]
    }

    function checkDiagonals() {
      const diagonals: string[][] = getDiagonals()
      const winningRow = diagonals.find(row => checkGroup(row))
      if (winningRow) {
        winner = winningRow[0];
        gameOver = true;
      }
    }

    checkDiagonals();
    checkColumns();
    checkRows();

    if (gameOver) {
      setGameOver(true);
      setWinningPlayer(winner);
    }
  }

  return (
    <BoardContainer>
      <div style={{ margin: '10px' }}>
        <p>Winning Player: {winningPlayer || 'none yet!'}</p>
        <p>Game over?: {gameOver.toString()}</p>
      </div>
      {board.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((col, colIndex) => (
            <Square key={colIndex} onClick={handleBoardClick(rowIndex, colIndex)}>
              {col}
            </Square>
          ))}
        </Row>
      ))}
      <ButtonContainer>
        <Button onClick={resetBoard}>Reset Board</Button>
      </ButtonContainer>
    </BoardContainer>
  );
}

export default App;
