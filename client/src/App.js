import React, { useState } from "react";
import Game from "./Game";

function App() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("EASY");

  if (!started) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h1>🎮 Time Loop Game</h1>

        <h3>Select Difficulty</h3>

        <button onClick={() => setDifficulty("EASY")}>🟢 Easy</button>
        <button onClick={() => setDifficulty("MEDIUM")}>🟡 Medium</button>
        <button onClick={() => setDifficulty("HARD")}>🔴 Hard</button>

        <br /><br />

        <button onClick={() => setStarted(true)}>
          ▶️ Start Game
        </button>

        <p>Selected: {difficulty}</p>
      </div>
    );
  }

  return <Game difficulty={difficulty} mode="AI" />;
}

export default App;