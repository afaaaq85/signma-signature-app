import React, { useRef, useEffect, useState } from "react";

const SignaturePage = () => {
  const canvasRef = useRef(null);
  const [fontSize, setFontSize] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [theme, setTheme] = useState("light");

  //change theme targetting the body tag in public html
  const toggleTheme = () => {
    if (theme === "light") {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      setTheme("dark");
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      setTheme("light");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("touchstart", handleStart);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("touchstart", handleStart);
    };
  }, []);

  const handleStart = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let x, y;

    if (e.type === "touchstart") {
      x = e.touches[0].clientX - canvas.offsetLeft;
      y = e.touches[0].clientY - canvas.offsetTop;
    } else {
      x = e.clientX - canvas.offsetLeft;
      y = e.clientY - canvas.offsetTop;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPosition.current = { x, y };
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    ctx.lineCap = "round";
    ctx.strokeStyle = theme === "light" ? "black" : "white";
    ctx.lineWidth = fontSize;
    let x, y;

    if (e.type === "touchmove") {
      x = e.touches[0].clientX - canvas.offsetLeft;
      y = e.touches[0].clientY - canvas.offsetTop;
    } else {
      x = e.clientX - canvas.offsetLeft;
      y = e.clientY - canvas.offsetTop;
    }

    const lastX = lastPosition.current.x;
    const lastY = lastPosition.current.y;

    const midX = (lastX + x) / 2;
    const midY = (lastY + y) / 2;

    ctx.quadraticCurveTo(lastX, lastY, midX, midY);
    ctx.stroke();

    lastPosition.current = { x, y };
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "signature.png";
    a.click();
  };

  return (
    <div className="main-container d-flex flex-column align-items-center justify-content-center ">
      <button className="theme-btn" onClick={toggleTheme}>
        Theme: {theme}
      </button>

      <div className="d-flex align-items-center justify-content-center my-4">
        <label htmlFor="fontSizeInput" className="m-0 p-0">
          Line thickness:
        </label>
        <input
          type="number"
          id="fontSizeInput"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>

      <div className=" d-flex flex-column align-items-center gap-3">
        <canvas
          ref={canvasRef}
          width={windowWidth > 750 ? 600 : windowWidth < 500 ? 300 : 400}
          height={400}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
        />
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <button className="btn btn-primary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            Export as PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePage;
