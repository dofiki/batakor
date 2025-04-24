import { useRef, useEffect } from "react";

export default function CanvasMap({ currentShape, drawnShapesRef, shapesUpdated }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 500;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
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

    const redrawAllShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawnShapesRef.current.forEach((shape) => {
        const { type, x1, y1, x2, y2, radius } = shape;
        if (type === "rect") {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        } else if (type === "circle") {
          drawCircle(x1, y1, radius);
        } else if (type === "arrow") {
          drawArrow(x1, y1, x2, y2);
        }
      });
    };

    redrawAllShapes();

    const handleMouseDown = (e) => {
      const { x, y } = getMousePos(e);
      startX = x;
      startY = y;
      isDrawing = true;
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const { x, y } = getMousePos(e);

      redrawAllShapes();

      if (currentShape === "rect") {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, x - startX, y - startY);
      } else if (currentShape === "circle") {
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        drawCircle(startX, startY, radius);
      } else if (currentShape === "arrow") {
        drawArrow(startX, startY, x, y);
      }
    };

    const handleMouseUp = (e) => {
      if (!isDrawing) return;
      isDrawing = false;

      const { x, y } = getMousePos(e);

      if (currentShape === "rect") {
        drawnShapesRef.current.push({
          type: "rect",
          x1: startX,
          y1: startY,
          x2: x,
          y2: y,
        });
      } else if (currentShape === "circle") {
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        drawnShapesRef.current.push({
          type: "circle",
          x1: startX,
          y1: startY,
          radius,
        });
      } else if (currentShape === "arrow") {
        drawnShapesRef.current.push({
          type: "arrow",
          x1: startX,
          y1: startY,
          x2: x,
          y2: y,
        });
      }

      redrawAllShapes();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentShape, shapesUpdated]);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: "#f0f0f0", border: "1px solid black" }}
    />
  );
}
