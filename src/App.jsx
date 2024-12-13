import './App.css';
import { Board } from './components/Board';

function App() {
  return (
    <>
      <div className="gradient-bg"></div>
      <h1>
        <span className="key">T</span>
        <span className="key">r</span>
        <span className="key">e</span>
        <span className="key">s</span>
        <span className="key">&nbsp;</span>
        <span className="key">e</span>
        <span className="key">n</span>
        <span className="key">&nbsp;</span>
        <span className="key">r</span>
        <span className="key">a</span>
        <span className="key">y</span>
        <span className="key">a</span>
      </h1>
      <Board />
    </>
  );
}

export default App;
