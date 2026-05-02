import React, { useEffect, useRef, useState } from "react";

const SIZE = 20;

export default function Game({ difficulty = "EASY" }) {
  // 🎚️ Difficulty configs
  const CONFIGS = {
    EASY: { speed: 1, spawn: 2, levelTime: 30000 },
    MEDIUM: { speed: 1.3, spawn: 3, levelTime: 20000 },
    HARD: { speed: 1.7, spawn: 4, levelTime: 12000 },
  };

  const { speed, spawn, levelTime } = CONFIGS[difficulty];

  const [myPos, setMyPos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const [level, setLevel] = useState(1);
  const [enemies, setEnemies] = useState([]);

  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const [timeLeft, setTimeLeft] = useState(levelTime / 1000);

  const keys = useRef({});
  const slowMotion = useRef(false);

  // 🎮 Keyboard controls
  useEffect(() => {
    const down = (e) => (keys.current[e.key] = true);
    const up = (e) => (keys.current[e.key] = false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // 📱 Mobile movement
  const moveMobile = (dx, dy) => {
    setMyPos((prev) => ({
      x: Math.max(0, Math.min(window.innerWidth - SIZE, prev.x + dx)),
      y: Math.max(0, Math.min(window.innerHeight - SIZE, prev.y + dy)),
    }));
  };

  // 🎯 Enemy spawn
  useEffect(() => {
    let arr = [];
    let count = Math.min(spawn + level, 12);

    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      });
    }

    setEnemies(arr);
  }, [level, spawn]);

  // 🎮 Game loop
  useEffect(() => {
    const loop = setInterval(() => {
      if (gameOver || paused) return;

      let nx = myPos.x;
      let ny = myPos.y;

      if (keys.current["ArrowUp"]) ny -= 5;
      if (keys.current["ArrowDown"]) ny += 5;
      if (keys.current["ArrowLeft"]) nx -= 5;
      if (keys.current["ArrowRight"]) nx += 5;

      nx = Math.max(0, Math.min(window.innerWidth - SIZE, nx));
      ny = Math.max(0, Math.min(window.innerHeight - SIZE, ny));

      setMyPos({ x: nx, y: ny });

      setEnemies((prev) =>
        prev.map((e) => {
          let dx = nx - e.x;
          let dy = ny - e.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;

          let currentSpeed = speed + level * 0.2;

          if (slowMotion.current) currentSpeed *= 0.3;

          let newX = e.x + (dx / dist) * currentSpeed;
          let newY = e.y + (dy / dist) * currentSpeed;

          // 💥 Collision
          if (
            Math.abs(newX - nx) < SIZE &&
            Math.abs(newY - ny) < SIZE
          ) {
            if (!slowMotion.current) {
              slowMotion.current = true;

              setTimeout(() => {
                slowMotion.current = false;
              }, 800);

              if (lives > 1) {
                setLives((l) => l - 1);
                setMyPos({
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                });
              } else {
                setGameOver(true);
              }
            }
          }

          return { x: newX, y: newY };
        })
      );
    }, 50);

    return () => clearInterval(loop);
  }, [myPos, level, paused, gameOver, lives, speed]);

  // ⏱️ Timer-based levels
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver || paused) return;

      setTimeLeft((t) => {
        if (t <= 1) {
          setLevel((l) => l + 1);
          return levelTime / 1000;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, paused, levelTime]);

  // 💀 Game Over
  if (gameOver) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h1>💀 Game Over</h1>
        <h2>Level: {level}</h2>
        <button onClick={() => window.location.reload()}>
          Restart
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* HUD */}
      <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
        ❤️ {lives} | 🧠 Level {level} | ⏱️ {timeLeft}s | 🎚️ {difficulty}
      </div>

      {/* Pause */}
      <button
        onClick={() => setPaused(!paused)}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        {paused ? "▶️ Resume" : "⏸️ Pause"}
      </button>

      {/* Player */}
      <div
        style={{
          position: "absolute",
          left: myPos.x,
          top: myPos.y,
          width: SIZE,
          height: SIZE,
          background: "cyan",
          transition: "all 0.05s linear",
        }}
      />

      {/* Enemies */}
      {enemies.map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: e.x,
            top: e.y,
            width: SIZE,
            height: SIZE,
            background: "red",
            transition: "all 0.05s linear",
          }}
        />
      ))}

      {/* 📱 Mobile Controls */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <button onTouchStart={() => moveMobile(0, -20)}>⬆️</button>
        <button onTouchStart={() => moveMobile(-20, 0)}>⬅️</button>
        <button onTouchStart={() => moveMobile(20, 0)}>➡️</button>
        <button onTouchStart={() => moveMobile(0, 20)}>⬇️</button>
      </div>
    </div>
  );
}