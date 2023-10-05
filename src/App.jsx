import { useState } from 'react'
//import './App.css'
import confetti from 'canvas-confetti'
import { Square } from './components/Square.jsx'
import { TURNOS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNOS.X
  })
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNOS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [... board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = (turn === TURNOS.X ? TURNOS.O : TURNOS.X)
    setTurn(newTurn)

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
   <main className='board'>
    <h1>Tic Tac Toe</h1>
    <button onClick={resetGame}>Reset del Juego</button>
    <section className="game">
      {
        board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard} >
              {square}
            </Square>
          )
        })
      }
    </section>

    <section className="turn">
      <Square isSelected={turn === TURNOS.X}>{TURNOS.X}</Square>
      <Square isSelected={turn === TURNOS.O}>{TURNOS.O}</Square>
    </section>

    <WinnerModal resetGame={resetGame} winner={winner}/>
   </main>
  )
}

export default App
