import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Eraser, Trash2, Save, ArrowLeft } from "lucide-react";

const DetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const drawnCanvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const { image } = location.state || {};
  const [originalImage, setOriginalImage] = useState(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Additional UI states
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [color, setColor] = useState("#000000");

  // Fixed cursor size constants
  const FIXED_PENCIL_SIZE = 24;
  const FIXED_ERASER_SIZE = 28;
  
  // Offset adjustments to align tool tip with cursor
  const PENCIL_OFFSET_X = 0;
  const PENCIL_OFFSET_Y = 12; // Moves the pencil up to align the tip with cursor
  const ERASER_OFFSET_X = 0;
  const ERASER_OFFSET_Y = 8; // Moves the eraser up to align with cursor

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setOriginalImage(image);

      const img = new Image();
      img.src = image;

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight;
        
        if (canvasAspect > imgAspect) {
          drawHeight = canvas.height;
          drawWidth = img.width * (drawHeight / img.height);
        } else {
          drawWidth = canvas.width;
          drawHeight = img.height * (drawWidth / img.width);
        }

        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
      };
    }

    // Initialize drawing canvas
    if (drawnCanvasRef.current) {
      const ctx = drawnCanvasRef.current.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
    }
  }, [image]);

  // Update stroke settings when they change
  useEffect(() => {
    if (drawnCanvasRef.current) {
      const ctx = drawnCanvasRef.current.getContext('2d');
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
    }
  }, [color, strokeWidth]);

  const startDrawing = (e) => {
    setDrawing(true);
    const ctx = drawnCanvasRef.current.getContext('2d');
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    lastPosition.current = { x: offsetX, y: offsetY };
  };

  const draw = (e) => {
    // Update cursor position regardless of drawing state
    const { offsetX, offsetY } = e.nativeEvent;
    setCursorPosition({ x: offsetX, y: offsetY });
    
    if (!drawing) return;
    
    const ctx = drawnCanvasRef.current.getContext('2d');

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.arc(offsetX, offsetY, strokeWidth * 2, 0, Math.PI * 2, false);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }

    lastPosition.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (drawnCanvasRef.current) {
      const ctx = drawnCanvasRef.current.getContext('2d');
      ctx.closePath();
    }
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const clearCanvas = () => {
    const ctx = drawnCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, drawnCanvasRef.current.width, drawnCanvasRef.current.height);
  };

  const saveCanvas = () => {
    const baseCanvas = canvasRef.current;
    const drawingCanvas = drawnCanvasRef.current;
  
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = baseCanvas.width;
    combinedCanvas.height = baseCanvas.height;
  
    const ctx = combinedCanvas.getContext('2d');
    ctx.drawImage(baseCanvas, 0, 0);
    ctx.drawImage(drawingCanvas, 0, 0);
  
    const dataUrl = combinedCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'annotated_image.png';
    link.click();
  };

  const handleBackToCanvas = () => {
    if (canvasRef.current && drawnCanvasRef.current) {
      const baseCanvas = canvasRef.current;
      const drawingCanvas = drawnCanvasRef.current;
  
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = baseCanvas.width;
      tempCanvas.height = baseCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");
  
      tempCtx.drawImage(baseCanvas, 0, 0);
      tempCtx.drawImage(drawingCanvas, 0, 0);
  
      const combinedImageData = tempCanvas.toDataURL();
      navigate("/create", { state: { image: combinedImageData } });
    } else {
      navigate("/");
    }
  };

  // Custom cursor component with fixed icon size and adjusted position
  const CustomCursor = () => {
    // Use fixed size for the icons
    const iconSize = isEraser ? FIXED_ERASER_SIZE : FIXED_PENCIL_SIZE;
    
    // Apply the appropriate offset based on the current tool
    const offsetX = isEraser ? ERASER_OFFSET_X : PENCIL_OFFSET_X;
    const offsetY = isEraser ? ERASER_OFFSET_Y : PENCIL_OFFSET_Y;
    
    return (
      <div
        className="pointer-events-none absolute"
        style={{
          top: cursorPosition.y - offsetY,
          left: cursorPosition.x - offsetX,
          transform: "translate(-50%, -50%)", // Center the cursor
          zIndex: 50,
          transition: "top 0.01s linear, left 0.01s linear" // Smoother transitions
        }}
      >
        {isEraser ? (
          <div className="relative">
            {/* Dot to show exact cursor position */}
            <div 
              className="absolute rounded-full bg-red-500"
              style={{ 
                width: '4px', 
                height: '4px',
                top: offsetY,
                left: offsetX,
                zIndex: 60
              }}
            />
            <Eraser size={iconSize} color="#666" />
            {/* Circle to indicate actual eraser size */}
            <div 
              className="absolute rounded-full border-2 border-gray-400 border-dashed bg-transparent"
              style={{ 
                width: `${strokeWidth * 4}px`, 
                height: `${strokeWidth * 4}px`,
                top: offsetY,
                left: offsetX,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ) : (
          <div className="relative">
            {/* Dot to show exact cursor position */}
            <div 
              className="absolute rounded-full bg-red-500"
              style={{ 
                width: '4px', 
                height: '4px',
                top: offsetY,
                left: offsetX,
                zIndex: 60
              }}
            />
            <Pencil size={iconSize} color={color} />
            {/* Circle to indicate actual stroke width */}
            <div 
              className="absolute rounded-full" 
              style={{ 
                width: `${strokeWidth * 2}px`, 
                height: `${strokeWidth * 2}px`,
                backgroundColor: color,
                top: offsetY,
                left: offsetX,
                transform: 'translate(-50%, -50%)',
                opacity: 0.3
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Image Annotation</h1>
          <button
            onClick={handleBackToCanvas}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Canvas
          </button>
        </div>

        {image ? (
          <div className="bg-white rounded-xl shadow-lg p-4">
            {/* Drawing Tools */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-3">
                <button
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    !isEraser ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setIsEraser(false)}
                  title="Pencil"
                >
                  <Pencil size={20} />
                </button>
                <button
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    isEraser ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setIsEraser(true)}
                  title="Eraser"
                >
                  <Eraser size={20} />
                </button>
                <button
                  className="p-3 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  onClick={clearCanvas}
                  title="Clear All"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Color Picker (only visible when using pencil) */}
              {!isEraser && (
                <div className="flex items-center gap-2">
                  <label htmlFor="color-picker" className="text-sm text-gray-600">Color:</label>
                  <input
                    id="color-picker"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
              )}

              {/* Stroke Width Slider */}
              <div className="flex items-center gap-2">
                <label htmlFor="stroke-width" className="text-sm text-gray-600">
                  {isEraser ? "Eraser Size:" : "Stroke Width:"}
                </label>
                <input
                  id="stroke-width"
                  type="range"
                  min="1"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600">{strokeWidth}px</span>
              </div>

              <button
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                onClick={saveCanvas}
              >
                <Save size={18} />
                Save Image
              </button>
            </div>

            {/* Canvas Container */}
            <div className="relative border border-gray-300 rounded-lg overflow-hidden" style={{ cursor: 'none' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="max-w-full h-auto"
              />
              <canvas
                ref={drawnCanvasRef}
                width={800}
                height={600}
                className="absolute top-0 left-0 max-w-full h-auto"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseEnter={(e) => {
                  const { offsetX, offsetY } = e.nativeEvent;
                  setCursorPosition({ x: offsetX, y: offsetY });
                }}
              />
              {cursorPosition.x > 0 && cursorPosition.y > 0 && <CustomCursor />}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">No image to display. Please select an image from the canvas.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Go to Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;