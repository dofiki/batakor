import { useState, useRef } from "react";
import NavBar from "./components/NavBar";
import Tools from "./components/Tools";
import CanvasMap from "./components/CanvasMap";
import EditFunction from "./components/EditFunction";

function App() {
  const [currentShape, setNewCurrentShape] = useState('');
  const [shapesUpdated, setShapesUpdated] = useState(false); // State to trigger re-render
  const drawnShapesRef = useRef([]); // Persistent storage for all drawn shapes

  function handleClick(shape) {
    setNewCurrentShape(shape === currentShape ? '' : shape);
  }

  // Function to reset the drawn shapes
  function resetShapes() {
    drawnShapesRef.current = [];
    setShapesUpdated(!shapesUpdated); // Trigger re-render to update canvas
  }

  return (
    <>
      <NavBar />
      <div className="mindMapBody">
        <Tools currentShape={currentShape} onHandleClick={handleClick} />
        <CanvasMap currentShape={currentShape} drawnShapesRef={drawnShapesRef} shapesUpdated={shapesUpdated} />
        <EditFunction drawnShapesRef={drawnShapesRef} onReset={resetShapes} />
      </div>
    </>
  );
}

export default App;
