import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; 
import { ArrowRight, Fingerprint, FileCheck, PenTool, Activity } from 'lucide-react';
import * as THREE from 'three';

const Home = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to get a cookie by name
  const getCookie = (name) => {
    const cookieArr = document.cookie.split('; ');
    for (let cookie of cookieArr) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  // Check for access token in cookies on mount
  useEffect(() => {
    if (getCookie('access_token')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setClearColor(0x000000, 0);

    // Create a group to hold all sketch-related objects
    const sketchGroup = new THREE.Group();
    scene.add(sketchGroup);

    // Array to hold all elements for progressive reveal
    const sketchElements = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      linewidth: 2,
      opacity: 0.8,
      transparent: true,
    });

    // Face outline drawn in segments
    const faceSegments = 8;
    for (let i = 0; i < faceSegments; i++) {
      const startAngle = (i / faceSegments) * 2 * Math.PI;
      const endAngle = ((i + 1) / faceSegments) * 2 * Math.PI;
      const faceCurve = new THREE.EllipseCurve(0, 0, 3, 4, startAngle, endAngle, false);
      const facePoints = faceCurve.getPoints(15);
      const faceGeometry = new THREE.BufferGeometry().setFromPoints(facePoints);
      const faceSegment = new THREE.Line(faceGeometry, lineMaterial.clone());
      faceSegment.rotation.x = Math.PI / 2;
      faceSegment.visible = false;
      sketchGroup.add(faceSegment);
      sketchElements.push({
        element: faceSegment,
        geometry: faceGeometry,
        material: faceSegment.material,
        startTime: i * 0.3,
      });
    }

    // Left eyebrow
    const leftEyebrowPoints = [
      new THREE.Vector3(-2, 2, 0),
      new THREE.Vector3(-1.2, 2.3, 0),
      new THREE.Vector3(-0.7, 2.1, 0),
    ];
    const leftEyebrowGeometry = new THREE.BufferGeometry().setFromPoints(leftEyebrowPoints);
    const leftEyebrow = new THREE.Line(leftEyebrowGeometry, lineMaterial.clone());
    leftEyebrow.visible = false;
    sketchGroup.add(leftEyebrow);
    sketchElements.push({
      element: leftEyebrow,
      geometry: leftEyebrowGeometry,
      material: leftEyebrow.material,
      startTime: 3.0,
    });

    // Right eyebrow
    const rightEyebrowPoints = [
      new THREE.Vector3(0.7, 2.1, 0),
      new THREE.Vector3(1.2, 2.3, 0),
      new THREE.Vector3(2, 2, 0),
    ];
    const rightEyebrowGeometry = new THREE.BufferGeometry().setFromPoints(rightEyebrowPoints);
    const rightEyebrow = new THREE.Line(rightEyebrowGeometry, lineMaterial.clone());
    rightEyebrow.visible = false;
    sketchGroup.add(rightEyebrow);
    sketchElements.push({
      element: rightEyebrow,
      geometry: rightEyebrowGeometry,
      material: rightEyebrow.material,
      startTime: 3.3,
    });

    // Left eye
    const leftEyeCurve = new THREE.EllipseCurve(-1.3, 1, 0.7, 0.4, 0, 2 * Math.PI, false);
    const leftEyePoints = leftEyeCurve.getPoints(30);
    const leftEyeGeometry = new THREE.BufferGeometry().setFromPoints(leftEyePoints);
    const leftEye = new THREE.Line(leftEyeGeometry, lineMaterial.clone());
    leftEye.rotation.x = Math.PI / 2;
    leftEye.visible = false;
    sketchGroup.add(leftEye);
    sketchElements.push({
      element: leftEye,
      geometry: leftEyeGeometry,
      material: leftEye.material,
      startTime: 3.6,
    });

    // Right eye
    const rightEyeCurve = new THREE.EllipseCurve(1.3, 1, 0.7, 0.4, 0, 2 * Math.PI, false);
    const rightEyePoints = rightEyeCurve.getPoints(30);
    const rightEyeGeometry = new THREE.BufferGeometry().setFromPoints(rightEyePoints);
    const rightEye = new THREE.Line(rightEyeGeometry, lineMaterial.clone());
    rightEye.rotation.x = Math.PI / 2;
    rightEye.visible = false;
    sketchGroup.add(rightEye);
    sketchElements.push({
      element: rightEye,
      geometry: rightEyeGeometry,
      material: rightEye.material,
      startTime: 3.9,
    });

    // Nose
    const nosePoints = [
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(-0.3, -0.7, 0),
      new THREE.Vector3(-0.5, -0.8, 0),
    ];
    const noseGeometry = new THREE.BufferGeometry().setFromPoints(nosePoints);
    const nose = new THREE.Line(noseGeometry, lineMaterial.clone());
    nose.visible = false;
    sketchGroup.add(nose);
    sketchElements.push({
      element: nose,
      geometry: noseGeometry,
      material: nose.material,
      startTime: 4.5,
    });

    // Right side of nose
    const noseRightPoints = [
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0.3, -0.7, 0),
      new THREE.Vector3(0.5, -0.8, 0),
    ];
    const noseRightGeometry = new THREE.BufferGeometry().setFromPoints(noseRightPoints);
    const noseRight = new THREE.Line(noseRightGeometry, lineMaterial.clone());
    noseRight.visible = false;
    sketchGroup.add(noseRight);
    sketchElements.push({
      element: noseRight,
      geometry: noseRightGeometry,
      material: noseRight.material,
      startTime: 4.8,
    });

    // Mouth
    const mouthCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.5, -2.2, 0),
      new THREE.Vector3(-0.5, -2.8, 0),
      new THREE.Vector3(0.5, -2.8, 0),
      new THREE.Vector3(1.5, -2.2, 0)
    );
    const mouthPoints = mouthCurve.getPoints(30);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouth = new THREE.Line(mouthGeometry, lineMaterial.clone());
    mouth.visible = false;
    sketchGroup.add(mouth);
    sketchElements.push({
      element: mouth,
      geometry: mouthGeometry,
      material: mouth.material,
      startTime: 5.1,
    });

    // Chin line
    const chinCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.5, -3.5, 0),
      new THREE.Vector3(0, -4, 0),
      new THREE.Vector3(1.5, -3.5, 0)
    );
    const chinPoints = chinCurve.getPoints(20);
    const chinGeometry = new THREE.BufferGeometry().setFromPoints(chinPoints);
    const chin = new THREE.Line(chinGeometry, lineMaterial.clone());
    chin.visible = false;
    sketchGroup.add(chin);
    sketchElements.push({
      element: chin,
      geometry: chinGeometry,
      material: chin.material,
      startTime: 5.4,
    });

    // Left ear
    const leftEarPoints = [
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(-3.3, 0.2, 0),
      new THREE.Vector3(-3.5, 0.8, 0),
      new THREE.Vector3(-3.3, 1.5, 0),
      new THREE.Vector3(-3, 1.8, 0),
    ];
    const leftEarGeometry = new THREE.BufferGeometry().setFromPoints(leftEarPoints);
    const leftEar = new THREE.Line(leftEarGeometry, lineMaterial.clone());
    leftEar.visible = false;
    sketchGroup.add(leftEar);
    sketchElements.push({
      element: leftEar,
      geometry: leftEarGeometry,
      material: leftEar.material,
      startTime: 5.7,
    });

    // Right ear
    const rightEarPoints = [
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(3.3, 0.2, 0),
      new THREE.Vector3(3.5, 0.8, 0),
      new THREE.Vector3(3.3, 1.5, 0),
      new THREE.Vector3(3, 1.8, 0),
    ];
    const rightEarGeometry = new THREE.BufferGeometry().setFromPoints(rightEarPoints);
    const rightEar = new THREE.Line(rightEarGeometry, lineMaterial.clone());
    rightEar.visible = false;
    sketchGroup.add(rightEar);
    sketchElements.push({
      element: rightEar,
      geometry: rightEarGeometry,
      material: rightEar.material,
      startTime: 6.0,
    });

    // Hair - multiple strokes
    const hairLines = [
      // Top of head
      [
        new THREE.Vector3(-2.5, 3, 0),
        new THREE.Vector3(-1.5, 3.5, 0),
        new THREE.Vector3(0, 3.7, 0),
        new THREE.Vector3(1.5, 3.5, 0),
        new THREE.Vector3(2.5, 3, 0),
      ],
      // Left side
      [
        new THREE.Vector3(-2.8, 2.5, 0),
        new THREE.Vector3(-3, 1.5, 0),
        new THREE.Vector3(-3, 0.5, 0),
      ],
      // Right side
      [
        new THREE.Vector3(2.8, 2.5, 0),
        new THREE.Vector3(3, 1.5, 0),
        new THREE.Vector3(3, 0.5, 0),
      ],
      // Bangs
      [
        new THREE.Vector3(-2, 2.8, 0),
        new THREE.Vector3(-1, 3, 0),
        new THREE.Vector3(0, 3.1, 0),
        new THREE.Vector3(1, 3, 0),
        new THREE.Vector3(2, 2.8, 0),
      ],
    ];
    for (let i = 0; i < hairLines.length; i++) {
      const hairGeometry = new THREE.BufferGeometry().setFromPoints(hairLines[i]);
      const hairStrand = new THREE.Line(hairGeometry, lineMaterial.clone());
      hairStrand.visible = false;
      sketchGroup.add(hairStrand);
      sketchElements.push({
        element: hairStrand,
        geometry: hairGeometry,
        material: hairStrand.material,
        startTime: 6.3 + i * 0.3,
      });
    }

    // Shading - cross-hatching for shadows
    const shadingLines = [];
    for (let i = 0; i < 5; i++) {
      shadingLines.push([
        new THREE.Vector3(-2.5 + i * 0.2, -1, 0),
        new THREE.Vector3(-1.5 + i * 0.2, -2.5, 0),
      ]);
    }
    for (let i = 0; i < 5; i++) {
      shadingLines.push([
        new THREE.Vector3(1.5 - i * 0.2, -2.5, 0),
        new THREE.Vector3(2.5 - i * 0.2, -1, 0),
      ]);
    }
    const shadingMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      opacity: 0.3,
      transparent: true,
    });
    for (let i = 0; i < shadingLines.length; i++) {
      const shadingGeometry = new THREE.BufferGeometry().setFromPoints(shadingLines[i]);
      const shadingLine = new THREE.Line(shadingGeometry, shadingMaterial.clone());
      shadingLine.visible = false;
      sketchGroup.add(shadingLine);
      sketchElements.push({
        element: shadingLine,
        geometry: shadingGeometry,
        material: shadingLine.material,
        startTime: 7.5 + i * 0.1,
      });
    }

    // Drawing pencil
    const pencilGroup = new THREE.Group();
    const pencilBodyGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 8);
    const pencilBodyMaterial = new THREE.MeshBasicMaterial({ color: 0xf0c420 });
    const pencilBody = new THREE.Mesh(pencilBodyGeometry, pencilBodyMaterial);
    pencilBody.position.y = 0.25;
    pencilGroup.add(pencilBody);
    const pencilTipGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
    const pencilTipMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const pencilTip = new THREE.Mesh(pencilTipGeometry, pencilTipMaterial);
    pencilTip.position.y = -0.5;
    pencilGroup.add(pencilTip);
    pencilGroup.rotation.x = Math.PI / 2;
    pencilGroup.position.z = 0.5;
    scene.add(pencilGroup);

    camera.position.z = 8;

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth / 2;
      const height = window.innerHeight / 2;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016; // ~60fps

      if (time > 9.5) {
        time = 0;
        sketchElements.forEach(element => {
          element.element.visible = false;
          element.material.opacity = 0.8;
        });
      }

      sketchElements.forEach(element => {
        if (time >= element.startTime && time < element.startTime + 0.5) {
          element.element.visible = true;
          element.material.opacity = ((time - element.startTime) / 0.5) * 0.8;
        } else if (time >= element.startTime + 0.5) {
          element.element.visible = true;
          element.material.opacity = 0.8;
        }
      });

      // Move the pencil to follow the current drawing point
      let currentDrawingPosition = { x: 0, y: 0, z: 0 };
      const activeLine = sketchElements.find(e => time >= e.startTime && time < e.startTime + 0.5);
      if (activeLine) {
        const progress = (time - activeLine.startTime) / 0.5;
        if (activeLine.geometry.attributes && activeLine.geometry.attributes.position) {
          const positions = activeLine.geometry.attributes.position.array;
          const pointCount = positions.length / 3;
          const pointIndex = Math.min(Math.floor(progress * pointCount), pointCount - 1);
          currentDrawingPosition.x = positions[pointIndex * 3];
          currentDrawingPosition.y = positions[pointIndex * 3 + 1];
          currentDrawingPosition.z = positions[pointIndex * 3 + 2];
        }
      } else {
        currentDrawingPosition.x = 4;
        currentDrawingPosition.y = 4;
      }

      pencilGroup.position.x = currentDrawingPosition.x;
      pencilGroup.position.y = currentDrawingPosition.y;
      pencilGroup.lookAt(0, 0, 0);
      pencilGroup.rotation.x = Math.PI / 2;
      pencilGroup.position.z = 0.5 + Math.sin(time * 10) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      sketchElements.forEach(element => {
        element.geometry.dispose();
        element.material.dispose();
      });
      pencilBodyGeometry.dispose();
      pencilBodyMaterial.dispose();
      pencilTipGeometry.dispose();
      pencilTipMaterial.dispose();
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Forensic Vision <span className="text-indigo-400"> Forensic Face Sketch
           </span> Construction and Recognition
          </h1>
          <p className="text-lg text-gray-300">
            Revolutionizing forensic investigations with AI-powered sketch-to-photo matching technology for faster suspect identification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={isAuthenticated ? '/create' : '/login'}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <PenTool className="h-5 w-5" />
              Create Sketch
            </Link>
            <Link
              to={isAuthenticated ? '/upload' : '/login'}
              className="bg-transparent border border-indigo-500 hover:bg-indigo-900 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FileCheck className="h-5 w-5" />
              Upload Sketch
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div>
              <h4 className="text-2xl font-bold text-indigo-400">90%</h4>
              <p className="text-sm text-gray-400">Match Accuracy</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-indigo-400">500+</h4>
              <p className="text-sm text-gray-400">Face Database</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-indigo-400">3s</h4>
              <p className="text-sm text-gray-400">Processing Time</p>
            </div>
          </div>
        </div>
        <div className={`flex justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="relative">
            <canvas ref={canvasRef} className="max-w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Create Sketch</h3>
            <p className="text-gray-300">
              Use our advanced sketch creation tool with drag and drop functionality to create accurate facial representations.
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Upload & Process</h3>
            <p className="text-gray-300">
              Upload the sketch for processing by our algorithm that extracts and analyzes key facial features.
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Match & Identify</h3>
            <p className="text-gray-300">
              Our system compares the sketch against database entries to find potential matches.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link to="/feature" className="group inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Explore All Features
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl p-8 lg:p-12 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to revolutionize your forensic investigations?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl">
              Join law enforcement agencies worldwide using ForensicVision to solve cases faster and more accurately.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors">
                Request Demo
              </button>
              <button className="bg-transparent border border-white hover:bg-indigo-800 px-6 py-3 rounded-md font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <Fingerprint className="h-24 w-24 text-indigo-300 opacity-75" />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
