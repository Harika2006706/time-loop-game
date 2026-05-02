import { useState } from "react";

export default function Lobby({ joinRoom }) {
  const [room, setRoom] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>🎮 Multiplayer Lobby</h1>

      <input
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <br /><br />

      <button onClick={() => joinRoom(room)}>
        Join
      </button>
    </div>
  );
}