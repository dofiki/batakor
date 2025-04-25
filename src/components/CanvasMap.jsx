import { useRef, useEffect, useState } from "react";

export default function CanvasMap({ currentShape, drawnShapesRef, shapesUpdated }) {
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);
  const [showTextBox, setShowTextBox] = useState(false);
  const [textBoxPos, setTextBoxPos] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 500;

    let isDrawing = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let selectedShapeIndex = -1;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const pointToLineDistance = (px, py, x1, y1, x2, y2) => {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      if (len_sq !== 0) param = dot / len_sq;

      let xx, yy;
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      const dx = px - xx;
      const dy = py - yy;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const drawCircle = (x, y, radius) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const drawArrow = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const addText = (x, y, value = "Hello, Canvas!") => {
      ctx.font = "20px Arial";
      ctx.fillStyle = "blue";
      ctx.fillText(value, x, y);
    };

    const redrawAllShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawnShapesRef.current.forEach((shape) => {
        const { type, x1, y1, x2, y2, radius, value } = shape;
        if (type === "rect") {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        } else if (type === "circle") {
          drawCircle(x1, y1, radius);
        } else if (type === "arrow") {
          drawArrow(x1, y1, x2, y2);
        } else if (type === "text") {
          addText(x1, y1, value);
        }
      });
    };

    const handleMouseDown = (e) => {
      const { x, y } = getMousePos(e);

      if (currentShape === "text") {
        setTextBoxPos({ x, y });
        setTextValue("");
        setShowTextBox(true);
        return;
      }

      if (currentShape === "move") {
        for (let i = drawnShapesRef.current.length - 1; i >= 0; i--) {
          const shape = drawnShapesRef.current[i];

          if (shape.type === "rect") {
            if (x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2) {
              selectedShapeIndex = i;
              offsetX = x - shape.x1;
              offsetY = y - shape.y1;
              isDragging = true;
              return;
            }
          } else if (shape.type === "circle") {
            const dist = Math.sqrt((x - shape.x1) ** 2 + (y - shape.y1) ** 2);
            if (dist <= shape.radius) {
              selectedShapeIndex = i;
              offsetX = x - shape.x1;
              offsetY = y - shape.y1;
              isDragging = true;
              return;
            }
          } else if (shape.type === "text") {
            ctx.font = "20px Arial";
            const width = ctx.measureText(shape.value).width;
            const height = 20;
            if (
              x >= shape.x1 && x <= shape.x1 + width &&
              y <= shape.y1 && y >= shape.y1 - height
            ) {
              selectedShapeIndex = i;
              offsetX = x - shape.x1;
              offsetY = y - shape.y1;
              isDragging = true;
              return;
            }
          } else if (shape.type === "arrow") {
            const dist = pointToLineDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
            if (dist < 10) {
              selectedShapeIndex = i;
              offsetX = x - shape.x1;
              offsetY = y - shape.y1;
              isDragging = true;
              return;
            }
          }
        }
      }

      startX = x;
      startY = y;
      isDrawing = true;
    };

    const handleMouseMove = (e) => {
      const { x, y } = getMousePos(e);
      if (isDragging && selectedShapeIndex !== -1) {
        const dx = x - offsetX;
        const dy = y - offsetY;

        const shape = drawnShapesRef.current[selectedShapeIndex];
        if (shape.type === "rect") {
          const width = shape.x2 - shape.x1;
          const height = shape.y2 - shape.y1;
          shape.x1 = dx;
          shape.y1 = dy;
          shape.x2 = dx + width;
          shape.y2 = dy + height;
        } else if (shape.type === "circle") {
          shape.x1 = dx;
          shape.y1 = dy;
        } else if (shape.type === "arrow") {
          const dx2 = shape.x2 - shape.x1;
          const dy2 = shape.y2 - shape.y1;
          shape.x1 = dx;
          shape.y1 = dy;
          shape.x2 = dx + dx2;
          shape.y2 = dy + dy2;
        } else if (shape.type === "text") {
          shape.x1 = dx;
          shape.y1 = dy;
        }

        redrawAllShapes();
        return;
      }

      if (!isDrawing) return;

      redrawAllShapes();

      if (currentShape === "rect") {
        ctx.strokeRect(startX, startY, x - startX, y - startY);
      } else if (currentShape === "circle") {
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        drawCircle(startX, startY, radius);
      } else if (currentShape === "arrow") {
        drawArrow(startX, startY, x, y);
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging) {
        isDragging = false;
        selectedShapeIndex = -1;
        return;
      }

      if (!isDrawing || currentShape === "text") return;
      isDrawing = false;

      const { x, y } = getMousePos(e);

      if (currentShape === "rect") {
        drawnShapesRef.current.push({ type: "rect", x1: startX, y1: startY, x2: x, y2: y });
      } else if (currentShape === "circle") {
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        drawnShapesRef.current.push({ type: "circle", x1: startX, y1: startY, radius });
      } else if (currentShape === "arrow") {
        drawnShapesRef.current.push({ type: "arrow", x1: startX, y1: startY, x2: x, y2: y });
      }

      redrawAllShapes();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    redrawAllShapes();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentShape, shapesUpdated]);

  useEffect(() => {
    if (showTextBox && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [showTextBox]);

  const handleTextSubmit = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.font = "20px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(textValue, textBoxPos.x, textBoxPos.y);

    drawnShapesRef.current.push({
      type: "text",
      x1: textBoxPos.x,
      y1: textBoxPos.y,
      value: textValue,
    });

    setShowTextBox(false);
    setTextValue("");
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: "#f0f0f0", border: "1px solid black" }}
      />

      {showTextBox && (
        <div
          style={{
            position: "absolute",
            top: textBoxPos.y,
            left: textBoxPos.x,
            backgroundColor: "white",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <input
            ref={textInputRef}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="textInput"
          />
          <button onClick={handleTextSubmit}>Done</button>
        </div>
      )}
    </div>
  );
}
