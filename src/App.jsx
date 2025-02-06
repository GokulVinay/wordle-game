import { useState, useEffect, useCallback } from "react";
import "./App.css";

// Updated Word List with Hints
const WORD_LIST = [
  { word: "pizza", hint: "A popular Italian dish with cheese and toppings." },
  { word: "apple", hint: "A red or green fruit that keeps the doctor away." },
  { word: "table", hint: "A piece of furniture used for dining or studying." },
  { word: "grape", hint: "A small, juicy fruit used to make wine." },
  { word: "house", hint: "A place where people live." },
  { word: "react", hint: "A JavaScript library for building user interfaces." },
  { word: "code", hint: "A set of instructions written for computers." },
  { word: "cloud", hint: "A term used for online storage and computing." }
];

const target = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
const TARGET_WORD = target.word;
const HINT = target.hint;

const App = () => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing");
  const [darkMode, setDarkMode] = useState(false);

  const handleGuess = useCallback(() => {
    if (currentGuess.length !== 5 || guesses.length >= 6) return;
    if (!WORD_LIST.some((item) => item.word === currentGuess)) {
      alert("Invalid word!");
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === TARGET_WORD) {
      setGameStatus("won");
    } else if (newGuesses.length === 6) {
      setGameStatus("lost");
    }
  }, [currentGuess, guesses]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameStatus !== "playing") return;
      if (event.key === "Enter") {
        handleGuess();
      } else if (event.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, gameStatus, handleGuess]);

  const getLetterStatus = (letter, index) => {
    if (TARGET_WORD[index] === letter) return "green";
    if (TARGET_WORD.includes(letter)) return "yellow";
    return "gray";
  };

  const handleChange = (e) => {
    // Prevent typing beyond 5 characters
    if (e.target.value.length <= 5) {
      setCurrentGuess(e.target.value);
    }
  };

  // Apply dark mode class to the entire body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="wordle-container">
      <h1 className="title">Wordle Clone</h1>

      {/* Dark Mode Toggle Button */}
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Rules Box */}
      <div className="rules-box">
        <h3>Rules:</h3>
        <ul>
          <li>You have 6 attempts to guess the correct 5-letter word.</li>
          <li>Green: Correct letter in the correct position.</li>
          <li>Yellow: Correct letter in the wrong position.</li>
          <li>Gray: Incorrect letter.</li>
          <li>Only valid words are allowed.</li>
        </ul>
      </div>

      {/* Hint Box */}
      <div className="hint-box">Hint: {HINT}</div>

      {/* Word Grid */}
      <div className="grid-container">
        <div className="grid">
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="row">
              {guess.split("").map((letter, index) => (
                <div key={index} className={`cell ${getLetterStatus(letter, index)}`}>
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Show Input Box and Submit Button only when the game is still playing */}
        {gameStatus === "playing" && (
          <>
            <input
              type="text"
              maxLength="5"
              value={currentGuess}
              onChange={handleChange}  // Using controlled input
              className="input-box"
            />
            <button onClick={handleGuess} className="button">Submit</button>
          </>
        )}

        {/* Game Over Message */}
        {gameStatus !== "playing" && (
          <div className="game-over">
            <h2 className="message">
              {gameStatus === "won"
                ? `You Win! 🎉 The word was "${TARGET_WORD.toUpperCase()}".`
                : `Game Over! The word was "${TARGET_WORD.toUpperCase()}".`}
            </h2>
            <button onClick={() => window.location.reload()} className="button">New Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
