import { useRef, useEffect } from "react";

export default function CanvasMap({ currentShape }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 500;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function drawCircle(startX, startY, radius) {
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
    }

    function drawArrow(startX, startY, endX, endY) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function handleMouseDown(e) {
      const { x, y } = getMousePos(e);
      startX = x;
      startY = y;
      isDrawing = true;
    }

    function handleMouseMove(e) {
      if (!isDrawing) return;

      const { x, y } = getMousePos(e);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the current shape
      if (currentShape === "rect") {
        const width = x - startX;
        const height = y - startY;
        ctx.strokeStyle = "black";
        ctx.strokeRect(startX, startY, width, height);
      } else if (currentShape === "circle") {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)); 
        drawCircle(startX, startY, radius);
      } else if (currentShape === "arrow") {
        drawArrow(startX, startY, x, y);
      }
    }

    function handleMouseUp(e) {
      if (!isDrawing) return;

      const { x, y } = getMousePos(e);

      // Finalize the shape once the mouse is released
      if (currentShape === "rect") {
        const width = x - startX;
        const height = y - startY;
        ctx.fillStyle = "black";
        ctx.fillRect(startX, startY, width, height);}
      else if (currentShape === "circle") {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        drawCircle(startX, startY, radius);
      } else if (currentShape === "arrow") {
        drawArrow(startX, startY, x, y);
      }

      isDrawing = false;
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentShape]);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: "#f0f0f0", border: "1px solid black" }}
    />
  );
}
