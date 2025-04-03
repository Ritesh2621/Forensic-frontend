import React, { useState, useEffect, useRef  } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useNavigate, useLocation } from "react-router-dom";

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
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
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
              flipX: node.flipX(),
              flipY: node.flipY(),
            });
          }}
        />
      )}
      {isSelected && <Transformer ref={trRef} />}
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
          console.error('Error :', error);
      }
  }
  };

  const handleDetails = () => {
    const stage = document.querySelector("canvas");
    if (stage) {
      // Create an offscreen canvas to crop the image
      const offscreenCanvas = document.createElement("canvas");
      const offscreenContext = offscreenCanvas.getContext("2d");
  
      // Get the current stage dimensions
      const stageWidth = stage.width;
      const stageHeight = stage.height;
  
      // Set the size of the offscreen canvas to match the stage size
      offscreenCanvas.width = stageWidth;
      offscreenCanvas.height = stageHeight;
  
      // Fill the canvas with a white background
      offscreenContext.fillStyle = "white";
      offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
      // Draw the stage image onto the offscreen canvas
      offscreenContext.drawImage(stage, 0, 0);
  
      // You can now crop the image before sending it to the DetailsPage
      const croppedDataURL = offscreenCanvas.toDataURL("image/png");
  
      // Navigate to the DetailsPage with the cropped image
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
      const updatedTransform = { ...transform, flipX: !transform.flipX };
      setImageTransformations((prev) => ({ ...prev, [selectedId]: updatedTransform }));
    }
  };
  
  const handleFlipY = () => {
    if (selectedId) {
      const transform = imageTransformations[selectedId] || {};
      const updatedTransform = { ...transform, flipY: !transform.flipY };
      setImageTransformations((prev) => ({ ...prev, [selectedId]: updatedTransform }));
    }
  };
  

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="w-52 bg-blue-900 text-white flex flex-col items-center py-4">
        {Object.keys(imagesByCategory).map((category) => (
          <div
            key={category}
            className={`cursor-pointer py-2 text-center w-full ${selectedCategory === category ? "bg-blue-700" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <div className="flex-1 bg-white shadow-lg border relative m-4">
      <Stage
  width={1000}
  height={680}
  className="border"
  onMouseDown={() => setSelectedId(null)}
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

      <div className="w-64 bg-gray-200 shadow-lg p-4 overflow-y-auto">
        <div className="mb-4 space-y-2">
          <button onClick={handleSave} className="bg-green-500 text-white w-full py-2 rounded">Save</button>
          <button onClick={handleReset} className="bg-yellow-500 text-white w-full py-2 rounded">Reset</button>
          <button onClick={handleDeleteShape} className="bg-red-500 text-white w-full py-2 rounded">Delete Shape</button>
          <button onClick={handleDetails} className="bg-blue-500 text-white w-full py-2 rounded">Add Details</button>
        </div>

        <h2 className="text-lg font-bold mb-4">{selectedCategory} Options</h2>
        <div className="grid grid-cols-2 gap-4">
          {imagesByCategory[selectedCategory].map((img) => (
            <div
              key={img.id}
              className="p-2 border rounded bg-white cursor-pointer hover:shadow-md"
              onClick={() => handleImageDrop(img)}
            >
              <img
                src={img.src}
                alt={img.id}
                className="w-full h-auto"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100";
                  e.target.alt = "Image not found";
                }}
              />
            </div>
          ))}
        </div>
      </div>


      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
        <button
          onClick={() => setShowTransformControls(!showTransformControls)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
        >
          🛠️
        </button>
      </div>


      {showTransformControls && selectedId && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
          <button
            onClick={() => handleScaling((imageTransformations[selectedId]?.scaleX || 1) + 0.1)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Increase Size
          </button>
          <button
            onClick={() => handleScaling((imageTransformations[selectedId]?.scaleX || 1) - 0.1)}
            className="bg-red-500 text-white p-2 rounded ml-2"
          >
            Decrease Size
          </button>
          <button
            onClick={() => handleRotation((imageTransformations[selectedId]?.rotation || 0) + 15)}
            className="bg-green-500 text-white p-2 rounded mt-2"
          >
            Rotate Right
          </button>
          <button
            onClick={() => handleRotation((imageTransformations[selectedId]?.rotation || 0) - 15)}
            className="bg-yellow-500 text-white p-2 rounded mt-2 ml-2"
          >
            Rotate Left
          </button>
          <button
            onClick={handleFlipX}
            className="bg-indigo-500 text-white p-2 rounded mt-2"
          >
            Flip X
          </button>
          <button
            onClick={handleFlipY}
            className="bg-purple-500 text-white p-2 rounded mt-2"
          >
            Flip Y
          </button>
        </div>
      )}
    </div>
  );
};

export default SketchApp;
