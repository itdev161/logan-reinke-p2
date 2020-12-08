import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Components/Canvas";
import Background from "./img/group-shot-with-logo.svg";

function App() {
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="CTAContainer">
          <img src={Background} className="backgroundImg" />
          <Canvas draw={draw} height={537.016} width={1920} />
        </div>
      </header>
    </div>
  );
}

export default App;
