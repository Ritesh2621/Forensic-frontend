import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronDown, Save, RefreshCw, Trash2, Paintbrush, 
  ZoomIn, ZoomOut, RotateCw, RotateCcw, FlipHorizontal, 
  Settings, Move, Plus, Minus, X, ArrowRight
} from "lucide-react";

const DraggableImage = ({
  src,
  isSelected,
  onSelect,
  onChange,
  initialX,
  initialY,
  scaleX,
  scaleY,
  rotation,
  flipX,
  flipY,
}) => {
  const [image] = useImage(src, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {image && (
        <KonvaImage
          image={image}
          x={initialX}
          y={initialY}
          scaleX={scaleX}
          scaleY={scaleY}
          rotation={rotation}
          flipX={flipX}
          flipY={flipY}
          draggable
          ref={shapeRef}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            onChange({
              x: node.x(),
              y: node.y(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
              rotation: node.rotation(),
              flipX: node.attrs.flipX, // Change from node.flipX() to node.attrs.flipX
              flipY: node.attrs.flipY, // Change from node.flipY() to node.attrs.flipY
            });
          }}
        />
      )}
      {isSelected && <Transformer ref={trRef} borderStroke="#3B82F6" anchorFill="#3B82F6" anchorStroke="#2563EB" />}
    </>
  );
};

const SketchApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Head");
  const [imageTransformations, setImageTransformations] = useState({});
  const [showTransformControls, setShowTransformControls] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleImageDrop = (image) => {
    const id = `${image.id}-${Date.now()}`;
    setCanvasImages([...canvasImages, { id, src: image.src, x: 150, y: 150 }]);
    setImageTransformations((prev) => ({
      ...prev,
      [id]: {
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        flipX: false,
        flipY: false,
      },
    }));
  };

  const handleSave = () => {
    const stage = document.querySelector("canvas");
    if (stage) {
      const offscreenCanvas = document.createElement("canvas");
      const offscreenContext = offscreenCanvas.getContext("2d");

      offscreenCanvas.width = stage.width;
      offscreenCanvas.height = stage.height;

      offscreenContext.fillStyle = "white";
      offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      offscreenContext.drawImage(stage, 0, 0);

      const dataURL = offscreenCanvas.toDataURL("image/jpeg", 1.0);

      const link = document.createElement("a");
      link.download = "canvas-image.jpg";
      link.href = dataURL;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Canvas not found!");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      try {
        setCanvasImages([]);
        setImageTransformations({});
        setSelectedId(null);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDetails = () => {
    const stage = document.querySelector("canvas");
    if (stage) {
      const offscreenCanvas = document.createElement("canvas");
      const offscreenContext = offscreenCanvas.getContext("2d");
  
      const stageWidth = stage.width;
      const stageHeight = stage.height;
  
      offscreenCanvas.width = stageWidth;
      offscreenCanvas.height = stageHeight;
  
      offscreenContext.fillStyle = "white";
      offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
      offscreenContext.drawImage(stage, 0, 0);
  
      const croppedDataURL = offscreenCanvas.toDataURL("image/png");
  
      navigate("/details", { state: { image: croppedDataURL } });
    } else {
      alert("Canvas not found!");
    }
  };

  useEffect(() => {
    if (location.state && location.state.image) {
      const newImage = {
        id: `restored-${Date.now()}`,
        src: location.state.image,
        x: 0,
        y: 0,
      };
      setCanvasImages((prevImages) => [...prevImages, newImage]);
    }
  }, [location.state]);

  const handleDeleteShape = () => {
    if (selectedId) {
      setCanvasImages(canvasImages.filter((img) => img.id !== selectedId));
      setSelectedId(null);
    } else {
      alert("No shape is selected to delete.");
    }
  };

  const handleScaling = (newScale) => {
    if (selectedId) {
      const transform = imageTransformations[selectedId] || {};
      const updatedTransform = { ...transform, scaleX: newScale, scaleY: newScale };
      setImageTransformations((prev) => ({ ...prev, [selectedId]: updatedTransform }));
    }
  };
  
  const handleRotation = (newRotation) => {
    if (selectedId) {
      const transform = imageTransformations[selectedId] || {};
      const updatedTransform = { ...transform, rotation: newRotation };
      setImageTransformations((prev) => ({ ...prev, [selectedId]: updatedTransform }));
    }
  };
  
  const handleFlipX = () => {
    if (selectedId) {
      const transform = imageTransformations[selectedId] || {};
      const updatedTransform = { 
        ...transform, 
        scaleX: transform.scaleX * -1  // Flip by negating the scale
      };
      setImageTransformations((prev) => ({ ...prev, [selectedId]: updatedTransform }));
    }
  };
  
  const handleFlipY = () => {
    if (selectedId) {
      const transform = imageTransformations[selectedId] || {};
      const updatedTransform = { 
        ...transform, 
        scaleY: transform.scaleY * -1  // Flip by negating the scale
      };
      setImageTransformations((prev) => ({ ...prev, [selectedId]: updatedTransform }));
    }
  };

  // Sample category images (in a real app, this would come from props or API)
  const imagesByCategory = {
    Head: [
      { id: "head1", src: "/assets/head/head1.png" },
      { id: "head2", src: "/assets/head/head2.png" },
      { id: "head3", src: "/assets/head/head3.png" },
      { id: "head4", src: "/assets/head/head4.png" },
      { id: "head5", src: "/assets/head/head5.png" },
      { id: "head6", src: "/assets/head/head6.png" },
      { id: "head7", src: "/assets/head/head7.png" },
      { id: "head8", src: "/assets/head/head8.png" },
      { id: "head9", src: "/assets/head/head9.png" },
      { id: "head10", src: "/assets/head/head10.png" },
    ],
    Hair: [
      { id: "hair1", src: "/assets/hair/hair1.png" },
      { id: "hair2", src: "/assets/hair/hair2.png" },
      { id: "hair3", src: "/assets/hair/hair3.png" },
      { id: "hair4", src: "/assets/hair/hair4.png" },
      { id: "hair5", src: "/assets/hair/hair5.png" },
      { id: "hair6", src: "/assets/hair/hair6.png" },
      { id: "hair7", src: "/assets/hair/hair7.png" },
      { id: "hair8", src: "/assets/hair/hair8.png" },
      { id: "hair9", src: "/assets/hair/hair9.png" },
      { id: "hair10", src: "/assets/hair/hair10.png" },
      { id: "hair11", src: "/assets/hair/hair11.png" },
      { id: "hair12", src: "/assets/hair/hair12.png" },
    ],
    Eyes: [
      { id: "eye1", src: "/assets/eyes/eye1.png" },
      { id: "eye2", src: "/assets/eyes/eye2.png" },
      { id: "eye3", src: "/assets/eyes/eye3.png" },
      { id: "eye4", src: "/assets/eyes/eye4.png" },
      { id: "eye5", src: "/assets/eyes/eye5.png" },
      { id: "eye6", src: "/assets/eyes/eye6.png" },
      { id: "eye7", src: "/assets/eyes/eye7.png" },
      { id: "eye8", src: "/assets/eyes/eye8.png" },
      { id: "eye9", src: "/assets/eyes/eye9.png" },
      { id: "eye10", src: "/assets/eyes/eye10.png" },
      { id: "eye11", src: "/assets/eyes/eye11.png" },
      { id: "eye12", src: "/assets/eyes/eye12.png" },
    ],
    Eyebrows: [
      { id: "eyebrow1", src: "/assets/eyebrows/eyebrow1.png" },
      { id: "eyebrow2", src: "/assets/eyebrows/eyebrow2.png" },
      { id: "eyebrow3", src: "/assets/eyebrows/eyebrow3.png" },
      { id: "eyebrow4", src: "/assets/eyebrows/eyebrow4.png" },
      { id: "eyebrow5", src: "/assets/eyebrows/eyebrow5.png" },
      { id: "eyebrow6", src: "/assets/eyebrows/eyebrow6.png" },
      { id: "eyebrow7", src: "/assets/eyebrows/eyebrow7.png" },
      { id: "eyebrow8", src: "/assets/eyebrows/eyebrow8.png" },
      { id: "eyebrow9", src: "/assets/eyebrows/eyebrow9.png" },
      { id: "eyebrow10", src: "/assets/eyebrows/eyebrow10.png" },
      { id: "eyebrow11", src: "/assets/eyebrows/eyebrow11.png" },
      { id: "eyebrow12", src: "/assets/eyebrows/eyebrow12.png" },
    ],
    Nose: [
      { id: "nose1", src: "/assets/nose/nose1.png" },
      { id: "nose2", src: "/assets/nose/nose2.png" },
      { id: "nose3", src: "/assets/nose/nose3.png" },
      { id: "nose4", src: "/assets/nose/nose4.png" },
      { id: "nose5", src: "/assets/nose/nose5.png" },
      { id: "nose6", src: "/assets/nose/nose6.png" },
      { id: "nose7", src: "/assets/nose/nose7.png" },
      { id: "nose8", src: "/assets/nose/nose8.png" },
      { id: "nose9", src: "/assets/nose/nose9.png" },
      { id: "nose10", src: "/assets/nose/nose10.png" },
      { id: "nose11", src: "/assets/nose/nose11.png" },
      { id: "nose12", src: "/assets/nose/nose12.png" },
    ],
    Lips: [
      { id: "lips1", src: "/assets/lips/lips1.png" },
      { id: "lips2", src: "/assets/lips/lips2.png" },
      { id: "lips3", src: "/assets/lips/lips3.png" },
      { id: "lips4", src: "/assets/lips/lips4.png" },
      { id: "lips5", src: "/assets/lips/lips5.png" },
      { id: "lips6", src: "/assets/lips/lips6.png" },
      { id: "lips7", src: "/assets/lips/lips7.png" },
      { id: "lips8", src: "/assets/lips/lips8.png" },
      { id: "lips9", src: "/assets/lips/lips9.png" },
      { id: "lips10", src: "/assets/lips/lips10.png" },
      { id: "lips11", src: "/assets/lips/lips11.png" },
      { id: "lips12", src: "/assets/lips/lips12.png" },
      { id: "lips13", src: "/assets/lips/lips13.png" },
      { id: "lips14", src: "/assets/lips/lips14.png" },
      { id: "lips15", src: "/assets/lips/lips15.png" },
      { id: "lips16", src: "/assets/lips/lips16.png" },
      { id: "lips17", src: "/assets/lips/lips17.png" },
      { id: "lips18", src: "/assets/lips/lips18.png" },
      { id: "lips19", src: "/assets/lips/lips19.png" },
      { id: "lips20", src: "/assets/lips/lips20.png" },
      { id: "lips21", src: "/assets/lips/lips21.png" },
      { id: "lips22", src: "/assets/lips/lips22.png" },
      { id: "lips23", src: "/assets/lips/lips23.png" },
      { id: "lips24", src: "/assets/lips/lips24.png" },
    ],
    Mustache: [
      { id: "mustache1", src: "/assets/mustache/mustache1.png" },
      { id: "mustache2", src: "/assets/mustache/mustache2.png" },
      { id: "mustache3", src: "/assets/mustache/mustache3.png" },
      { id: "mustache4", src: "/assets/mustache/mustache4.png" },
      { id: "mustache5", src: "/assets/mustache/mustache5.png" },
      { id: "mustache6", src: "/assets/mustache/mustache6.png" },
      { id: "mustache7", src: "/assets/mustache/mustache7.png" },
      { id: "mustache8", src: "/assets/mustache/mustache8.png" },
      { id: "mustache9", src: "/assets/mustache/mustache9.png" },
      { id: "mustache10", src: "/assets/mustache/mustache10.png" },
      { id: "mustache11", src: "/assets/mustache/mustache11.png" },
      { id: "mustache12", src: "/assets/mustache/mustache12.png" },
    ],
    More: [
      { id: "more1", src: "/assets/more/more1.png" },
      { id: "more2", src: "/assets/more/more2.png" },
      { id: "more3", src: "/assets/more/more3.png" },
      { id: "more4", src: "/assets/more/more4.png" },
      { id: "more5", src: "/assets/more/more5.png" },
      { id: "more6", src: "/assets/more/more6.png" },
      { id: "more7", src: "/assets/more/more7.png" },
      { id: "more8", src: "/assets/more/more8.png" },
      { id: "more9", src: "/assets/more/more9.png" },
    ],
  };

  // For tooltips
  const handleTooltip = (tooltipText) => {
    setShowTooltip(tooltipText);
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Top header with app title and controls */}
      <div className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="flex items-center space-x-2">
          <Paintbrush className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
          <h1 className="text-xl font-bold">Canvas Creator</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={handleSave}
            onMouseEnter={() => handleTooltip("Save")}
            onMouseLeave={() => handleTooltip("")}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Save size={20} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          </button>
          <button 
            onClick={handleReset}
            onMouseEnter={() => handleTooltip("Reset Canvas")}
            onMouseLeave={() => handleTooltip("")}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <RefreshCw size={20} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
          </button>
          <button 
            onClick={handleDetails}
            onMouseEnter={() => handleTooltip("Add Details")}
            onMouseLeave={() => handleTooltip("")}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <ArrowRight size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with categories */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-52'} transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-indigo-800'} text-white flex flex-col items-center py-4 relative`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`absolute -right-3 top-4 rounded-full p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-700'} shadow-md`}
          >
            <ChevronDown size={16} className={`transform ${sidebarCollapsed ? 'rotate-270' : 'rotate-90'}`} />
          </button>
          
          {Object.keys(imagesByCategory).map((category) => (
            <div
              key={category}
              className={`cursor-pointer py-3 text-center w-full ${selectedCategory === category ? (isDarkMode ? 'bg-blue-900' : 'bg-indigo-700') : ''} 
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-600'} transition-colors duration-200 flex justify-center`}
              onClick={() => setSelectedCategory(category)}
            >
              {sidebarCollapsed ? (
                <span className="font-bold">{category.charAt(0)}</span>
              ) : (
                <span>{category}</span>
              )}
            </div>
          ))}
        </div>

        {/* Main canvas area */}
        <div className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden relative flex items-center justify-center`}>
          <div className={`shadow-xl ${isDarkMode ? 'shadow-gray-700' : 'shadow-gray-300'} rounded-lg overflow-hidden`}>
            <Stage
              width={1000}
              height={680}
              className={isDarkMode ? 'border border-gray-700' : 'border border-gray-300'}
              onMouseDown={(e) => {
                // Only clear selection if clicking on the empty canvas
                if (e.target === e.target.getStage()) {
                  setSelectedId(null);
                }
              }}
              ref={canvasRef}
            >
              <Layer>
                {canvasImages.map((img) => {
                  const transform = imageTransformations[img.id] || {};
                  return (
                    <DraggableImage
                      key={img.id}
                      src={img.src}
                      isSelected={img.id === selectedId}
                      onSelect={() => setSelectedId(img.id)}
                      onChange={(newAttrs) => {
                        setCanvasImages((prev) =>
                          prev.map((image) => (image.id === img.id ? { ...image, ...newAttrs } : image))
                        );
                      }}
                      initialX={img.x}
                      initialY={img.y}
                      scaleX={transform.scaleX || 1}
                      scaleY={transform.scaleY || 1}
                      rotation={transform.rotation || 0}
                      flipX={transform.flipX || false}
                      flipY={transform.flipY || false}
                    />
                  );
                })}
              </Layer>
            </Stage>
          </div>
          
          {/* Bottom toolbar */}
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg px-2 py-1 flex items-center space-x-1`}>
            <button
              onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
            >
              <Settings size={20} className={toolbarCollapsed ? 'rotate-180' : ''} />
            </button>
            
            {!toolbarCollapsed && (
              <>
                <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                
                <button
                  disabled={!selectedId}
                  onClick={() => handleScaling((imageTransformations[selectedId]?.scaleX || 1) + 0.1)}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ZoomIn size={20} />
                </button>
                
                <button
                  disabled={!selectedId}
                  onClick={() => handleScaling((imageTransformations[selectedId]?.scaleX || 1) - 0.1)}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ZoomOut size={20} />
                </button>
                
                <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                
                <button
                  disabled={!selectedId}
                  onClick={() => handleRotation((imageTransformations[selectedId]?.rotation || 0) + 15)}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RotateCw size={20} />
                </button>
                
                <button
                  disabled={!selectedId}
                  onClick={() => handleRotation((imageTransformations[selectedId]?.rotation || 0) - 15)}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RotateCcw size={20} />
                </button>
                
                <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                
                <button
                  disabled={!selectedId}
                  onClick={handleFlipX}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FlipHorizontal size={20} className="transform rotate-90" />
                </button>
                
                <button
                  disabled={!selectedId}
                  onClick={handleFlipY}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FlipHorizontal size={20} />
                </button>
                
                <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                
                <button
                  disabled={!selectedId}
                  onClick={handleDeleteShape}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-100 text-red-500'} 
                    ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm py-1 px-3 rounded">
              {showTooltip}
            </div>
          )}
        </div>

        {/* Right sidebar with options */}
        <div className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-l overflow-y-auto`}>
          <div className="p-4">
            <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
              <span>{selectedCategory} Options</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {imagesByCategory[selectedCategory].map((img) => (
                <div
                  key={img.id}
                  className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} cursor-pointer shadow transition-all duration-200 hover:scale-105`}
                  onClick={() => handleImageDrop(img)}
                >
                  <img
                    src={img.src}
                    alt={img.id}
                    className="w-full h-auto rounded"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100";
                      e.target.alt = "Image not found";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchApp;