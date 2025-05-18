import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { languages } from './Data/languages'
import {getFarewellText} from './Data/utils'
import {getRandomWord}  from './Data/utils'
import Confetti from 'react-confetti'
import './App.css'
import clsx from 'clsx'
function App() {
  const [currentword,setCurrentword] = useState(()=> getRandomWord());
  const [guessedLetters,setGuessedletters] = useState([]);
  const numGuessesLeft = languages.length - 1;
  const wrongGuessesCount = guessedLetters.filter((letter) => !currentword.includes(letter)).length;
  const isGameWon = currentword.split("").every((letter) => guessedLetters.includes(letter)); 
  const isGameLost = wrongGuessesCount >= languages.length - 1;  
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessedIncorrect = lastGuessedLetter && !currentword.includes(lastGuessedLetter);
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  // const alphabet = "qwertyuiopasdfghjklzxcvbnm";
  function addguessedletter(letter){
    if(!alphabet.includes(letter)){
      return;
    }
    setGuessedletters((prevletters=>{
    return prevletters.includes(letter) ? prevletters
     : [...prevletters,letter]
    }))
  }
  useEffect(()=>{
   function handleKeydown(event){
      const letter = event.key.toLowerCase();
      if(alphabet.includes(letter)){
        addguessedletter(letter);
      }
    }
    window.addEventListener("keydown",handleKeydown);
    return () => {
      window.removeEventListener("keydown",handleKeydown);
    } 
  },[guessedLetters])
  const languageElements = languages.map((lang,index) => {
    const islanguagelost = index < wrongGuessesCount;
    const className = clsx("chip" ,islanguagelost && "lost")
    const styles = { backgroundColor: lang.backgroundColor, color: lang.color }
    return (
      <span 
      className= {className}
      key={lang.name} 
      style={styles}>
        {lang.name}
      </span>
    )
  })
  const letterElements = currentword.split("").map((letter, index) => { 
    const shouldRevealLetter = guessedLetters.includes(letter) || isGameLost;
    const letterClassName = clsx("letter", 
      isGameLost && !guessedLetters.includes(letter) && "missed-letter",
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })
  function renderGameStatus(){
    if(!isGameOver && isLastGuessedIncorrect){
     return <p className="farewell-message">
      {
      getFarewellText(languages[wrongGuessesCount - 1].name)
      }</p>
    }
    if(isGameWon){
      return (
        <>
        <h2>You Win</h2>
        <p>Well done! 🎉</p>
      </>
      )
    } 
    if(isGameLost){
      return (
        <>
        <h2>Game Over!</h2>
        <p>You Lose!,Better start learning Assembly 😭</p>
      </>
      )
    }
    return null;
  }
  const keyboardElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentword.includes(letter);
    const isWrong = isGuessed && !currentword.includes(letter);
    const className = clsx("key", {
      correct : isCorrect,
      wrong : isWrong,
      guessed : isGuessed
    })
    return (
      <button 
      onClick={()=> addguessedletter(letter)} 
      key={letter} 
      className={className}
      disabled={isGameOver}
      aria-disabled ={guessedLetters.includes(letter)}
      aria-label={`Letter ${letter.toUpperCase()}`}
      >
        {letter.toUpperCase()}
      </button>
    )
  })
  function startNewGame(){
    setCurrentword(getRandomWord());
    setGuessedletters([]);
  }
  const gameStatusClass = clsx("game-status", {
    "won" : isGameWon,
    "lost" : isGameLost,
    "farewell": !isGameOver && isLastGuessedIncorrect
  })
  return (
    <main>
      {isGameWon && 
      <Confetti 
      recycle={false}
      numberOfPieces={1000}
      />}
    <header>
      <h1>Krish's Assembly Endgame</h1>
      <p> Guess the word within 8 attempts to keep the programming world safe from Assembly</p>
    </header>
    <section 
    aria-live='polite' 
    role='status' 
    className={gameStatusClass}>
      { renderGameStatus()}
    </section>
    <section className="language-chips">
      {languageElements}
    </section>
    <section className='word'>
      {letterElements}
    </section>
    <section className="sr-only" aria-live='polite' role='status' >
    <p>
      {
      currentword.includes(lastGuessedLetter) ?
      `Correct! The letter ${lastGuessedLetter} is in the word.` :
      `Sorry, the letter ${lastGuessedLetter} is not in the word.`
      }
      You have {numGuessesLeft} attempts left.
    </p>
      <p>Current Word : {currentword.split("").map(letter=>
        guessedLetters.includes(letter) ? letter + "." : "blank."
      ).join(" ")}</p>
    </section>
    <section className="keyboard">
      {keyboardElements}
    </section>
    {
      isGameOver  && 
      <button onClick={startNewGame} className="new-game">New Game</button>
    }
    </main>
  )
}

export default App