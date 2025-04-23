import { useState } from "react";
import NavBar from "./components/NavBar";
import Tools from "./components/Tools";
import CanvasMap from "./components/CanvasMap";
import EditFunction from "./components/EditFunction";

function App() {
  const[currentShape, setNewCurrentShape] = useState('');

  function handleClick(shape){
    setNewCurrentShape(shape === currentShape?'':shape);
  }

  return (
    <>
      <NavBar />
      <div className="mindMapBody">
         <Tools currentShape={currentShape} onHandleClick={handleClick}/>
         <CanvasMap currentShape={currentShape} />
         <EditFunction />
      </div>
    </>
  )
}

export default App