import "./App.css";
import { Board } from "./components/Board";
import { FloatingLetters } from "./components/FloatingLetters";
import { GameTitle } from "./components/GameTitle";

function App() {
  return (
    <>
      <div className="gradient-bg"></div>
      <FloatingLetters />
      <GameTitle />
      <Board />
    </>
  );
}

export default App;
