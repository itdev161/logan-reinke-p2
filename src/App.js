import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Components/Canvas";
import Cannon from "./Components/Cannon.jsx"

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Cannon
          height={537.016}
          width={1920}
          style={{ cursor: "pointer"}}
        />
      </header>
    </div>
  );
}

export default App;
