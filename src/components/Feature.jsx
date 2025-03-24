import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Fingerprint, FileCheck, PenTool, Activity, Search, Save } from 'lucide-react';
import * as THREE from 'three';

const Feature = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const [animationState, setAnimationState] = useState('drawing'); // 'drawing', 'processing', 'matching'

  useEffect(() => {
    // Set up the Three.js scene
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

    // Control panel
    const controlPanelGeometry = new THREE.PlaneGeometry(10, 2);
    const controlPanelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333344, 
      transparent: true,
      opacity: 0.8
    });
    const controlPanel = new THREE.Mesh(controlPanelGeometry, controlPanelMaterial);
    controlPanel.position.set(0, -5, 0);
    scene.add(controlPanel);

    // Control buttons
    const buttonGeometry = new THREE.CircleGeometry(0.4, 32);
    
    // Draw button
    const drawButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x4444FF });
    const drawButton = new THREE.Mesh(buttonGeometry, drawButtonMaterial);
    drawButton.position.set(-3.5, -5, 0.1);
    scene.add(drawButton);
    
    // Process button
    const processButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6644 });
    const processButton = new THREE.Mesh(buttonGeometry, processButtonMaterial);
    processButton.position.set(0, -5, 0.1);
    scene.add(processButton);
    
    // Match button
    const matchButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x44CC44 });
    const matchButton = new THREE.Mesh(buttonGeometry, matchButtonMaterial);
    matchButton.position.set(3.5, -5, 0.1);
    scene.add(matchButton);

    // Left side for sketch
    const sketchPanelGeometry = new THREE.PlaneGeometry(6, 8);
    const sketchPanelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF, 
      transparent: true,
      opacity: 0.9
    });
    const sketchPanel = new THREE.Mesh(sketchPanelGeometry, sketchPanelMaterial);
    sketchPanel.position.set(-3, 0, 0);
    scene.add(sketchPanel);

    // Right side for matching
    const matchPanelGeometry = new THREE.PlaneGeometry(6, 8);
    const matchPanelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF, 
      transparent: true,
      opacity: 0.9
    });
    const matchPanel = new THREE.Mesh(matchPanelGeometry, matchPanelMaterial);
    matchPanel.position.set(3, 0, 0);
    scene.add(matchPanel);

    // Sketch facial features
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });

    // Face outline
    const faceCurve = new THREE.EllipseCurve(
      -3, 0,          // center
      2, 3,           // x,y radius
      0, 2 * Math.PI, // start angle, end angle
      true            // clockwise
    );
    const facePoints = faceCurve.getPoints(50);
    const faceGeometry = new THREE.BufferGeometry().setFromPoints(facePoints);
    const face = new THREE.Line(faceGeometry, lineMaterial);
    face.position.z = 0.1;
    face.visible = false;
    scene.add(face);

    // Left eye
    const leftEyeCurve = new THREE.EllipseCurve(
      -3.8, 0.8,      // center
      0.5, 0.3,       // x,y radius
      0, 2 * Math.PI, // start angle, end angle
      true            // clockwise
    );
    const leftEyePoints = leftEyeCurve.getPoints(30);
    const leftEyeGeometry = new THREE.BufferGeometry().setFromPoints(leftEyePoints);
    const leftEye = new THREE.Line(leftEyeGeometry, lineMaterial);
    leftEye.position.z = 0.1;
    leftEye.visible = false;
    scene.add(leftEye);

    // Right eye
    const rightEyeCurve = new THREE.EllipseCurve(
      -2.2, 0.8,      // center
      0.5, 0.3,       // x,y radius
      0, 2 * Math.PI, // start angle, end angle
      true            // clockwise
    );
    const rightEyePoints = rightEyeCurve.getPoints(30);
    const rightEyeGeometry = new THREE.BufferGeometry().setFromPoints(rightEyePoints);
    const rightEye = new THREE.Line(rightEyeGeometry, lineMaterial);
    rightEye.position.z = 0.1;
    rightEye.visible = false;
    scene.add(rightEye);

    // Nose
    const nosePoints = [
      new THREE.Vector3(-3, 0.5, 0.1),
      new THREE.Vector3(-3, 0, 0.1),
      new THREE.Vector3(-3.3, -0.7, 0.1),
      new THREE.Vector3(-3, -0.5, 0.1),
      new THREE.Vector3(-2.7, -0.7, 0.1)
    ];
    const noseGeometry = new THREE.BufferGeometry().setFromPoints(nosePoints);
    const nose = new THREE.Line(noseGeometry, lineMaterial);
    nose.visible = false;
    scene.add(nose);

    // Mouth
    const mouthCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-4, -1.5, 0.1),
      new THREE.Vector3(-3.5, -1.8, 0.1),
      new THREE.Vector3(-2.5, -1.8, 0.1),
      new THREE.Vector3(-2, -1.5, 0.1)
    );
    const mouthPoints = mouthCurve.getPoints(30);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouth = new THREE.Line(mouthGeometry, lineMaterial);
    mouth.visible = false;
    scene.add(mouth);

    // Hair
    const hairPoints = [
      new THREE.Vector3(-4.5, 1, 0.1),
      new THREE.Vector3(-4.8, 1.8, 0.1),
      new THREE.Vector3(-4.5, 2.5, 0.1),
      new THREE.Vector3(-3, 3, 0.1),
      new THREE.Vector3(-1.5, 2.5, 0.1),
      new THREE.Vector3(-1.2, 1.8, 0.1),
      new THREE.Vector3(-1.5, 1, 0.1)
    ];
    const hairGeometry = new THREE.BufferGeometry().setFromPoints(hairPoints);
    const hair = new THREE.Line(hairGeometry, lineMaterial);
    hair.visible = false;
    scene.add(hair);

    // Eyebrows
    const leftEyebrowPoints = [
      new THREE.Vector3(-4.2, 1.3, 0.1),
      new THREE.Vector3(-3.8, 1.4, 0.1),
      new THREE.Vector3(-3.4, 1.2, 0.1)
    ];
    const leftEyebrowGeometry = new THREE.BufferGeometry().setFromPoints(leftEyebrowPoints);
    const leftEyebrow = new THREE.Line(leftEyebrowGeometry, lineMaterial);
    leftEyebrow.visible = false;
    scene.add(leftEyebrow);

    const rightEyebrowPoints = [
      new THREE.Vector3(-2.6, 1.2, 0.1),
      new THREE.Vector3(-2.2, 1.4, 0.1),
      new THREE.Vector3(-1.8, 1.3, 0.1)
    ];
    const rightEyebrowGeometry = new THREE.BufferGeometry().setFromPoints(rightEyebrowPoints);
    const rightEyebrow = new THREE.Line(rightEyebrowGeometry, lineMaterial);
    rightEyebrow.visible = false;
    scene.add(rightEyebrow);

    // Sketch lines with their reveal timing
    const sketchElements = [
      { element: face, startTime: 0.5 },
      { element: leftEyebrow, startTime: 1.5 },
      { element: rightEyebrow, startTime: 2.0 },
      { element: leftEye, startTime: 2.5 },
      { element: rightEye, startTime: 3.0 },
      { element: nose, startTime: 3.5 },
      { element: mouth, startTime: 4.0 },
      { element: hair, startTime: 4.5 }
    ];

    // Pencil for drawing
    const pencilGroup = new THREE.Group();
    const pencilBodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    const pencilBodyMaterial = new THREE.MeshBasicMaterial({ color: 0xf0c420 });
    const pencilBody = new THREE.Mesh(pencilBodyGeometry, pencilBodyMaterial);
    pencilBody.rotation.x = Math.PI/2;
    pencilBody.position.y = 0;
    pencilGroup.add(pencilBody);

    const pencilTipGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const pencilTipMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const pencilTip = new THREE.Mesh(pencilTipGeometry, pencilTipMaterial);
    pencilTip.rotation.x = Math.PI/2;
    pencilTip.position.z = -0.75;
    pencilGroup.add(pencilTip);

    pencilGroup.rotation.y = Math.PI/4;
    pencilGroup.visible = false;
    scene.add(pencilGroup);

    // Processing animation elements
    const processingGroup = new THREE.Group();
    const progressBarGeometry = new THREE.PlaneGeometry(4, 0.4);
    const progressBarBgMaterial = new THREE.MeshBasicMaterial({ color: 0xDDDDDD });
    const progressBarBg = new THREE.Mesh(progressBarGeometry, progressBarBgMaterial);
    processingGroup.add(progressBarBg);

    const progressBarFillGeometry = new THREE.PlaneGeometry(0.1, 0.3);
    const progressBarFillMaterial = new THREE.MeshBasicMaterial({ color: 0x4444FF });
    const progressBarFill = new THREE.Mesh(progressBarFillGeometry, progressBarFillMaterial);
    progressBarFill.position.z = 0.1;
    progressBarFill.position.x = -1.95; // Start at the left edge
    processingGroup.add(progressBarFill);

    const processingTextGeometry = new THREE.PlaneGeometry(4, 0.6);
    const processingTextTexture = new THREE.CanvasTexture(createTextCanvas("Processing..."));
    const processingTextMaterial = new THREE.MeshBasicMaterial({ 
      map: processingTextTexture,
      transparent: true
    });
    const processingText = new THREE.Mesh(processingTextGeometry, processingTextMaterial);
    processingText.position.y = 0.7;
    processingGroup.add(processingText);

    processingGroup.visible = false;
    processingGroup.position.set(0, 0, 0.5);
    scene.add(processingGroup);

    // Match results animation
    // Create a circular scanning effect
    const scannerGeometry = new THREE.RingGeometry(2.5, 2.6, 32);
    const scannerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x44FF44,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
    scanner.position.set(3, 0, 0.2);
    scanner.scale.set(0.1, 0.1, 0.1);
    scanner.visible = false;
    scene.add(scanner);

    // Match results
    const resultImages = [1, 2, 3, 4];
    const resultGroups = [];
    
    resultImages.forEach((val, index) => {
      const resultGroup = new THREE.Group();
      
      // Background for the match result
      const resultBgGeometry = new THREE.PlaneGeometry(1.2, 1.2);
      const resultBgMaterial = new THREE.MeshBasicMaterial({ 
        color: index === 0 ? 0xDDFFDD : 0xEEEEEE
      });
      const resultBg = new THREE.Mesh(resultBgGeometry, resultBgMaterial);
      resultGroup.add(resultBg);
      
      // Create a text label for the match percentage
      const matchPercent = index === 0 ? '92%' : `${80 - index * 12}%`;
      const resultLabelGeometry = new THREE.PlaneGeometry(1, 0.3);
      const resultLabelTexture = new THREE.CanvasTexture(createTextCanvas(matchPercent));
      const resultLabelMaterial = new THREE.MeshBasicMaterial({ 
        map: resultLabelTexture,
        transparent: true
      });
      const resultLabel = new THREE.Mesh(resultLabelGeometry, resultLabelMaterial);
      resultLabel.position.y = -0.5;
      resultLabel.position.z = 0.1;
      resultGroup.add(resultLabel);
      
      // Create a simple face drawing for each result
      const faceOutlineGeometry = new THREE.CircleGeometry(0.4, 32);
      const faceOutlineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        wireframe: true
      });
      const faceOutline = new THREE.Mesh(faceOutlineGeometry, faceOutlineMaterial);
      faceOutline.position.z = 0.1;
      resultGroup.add(faceOutline);
      
      // Position in a grid
      const row = Math.floor(index / 2);
      const col = index % 2;
      resultGroup.position.set(
        2.2 + col * 1.6,
        1.2 - row * 1.6,
        0.3
      );
      
      resultGroup.visible = false;
      resultGroups.push(resultGroup);
      scene.add(resultGroup);
    });
    
    // Helper function to create text textures
    function createTextCanvas(text) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      context.fillStyle = '#000000';
      context.font = 'Bold 24px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 128, 32);
      return canvas;
    }

    camera.position.z = 10;

    const handleResize = () => {
      const width = window.innerWidth / 2;
      const height = window.innerHeight / 2;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Use clock for animation timing
    const clock = new THREE.Clock();
    let totalTime = 0;
    let progressValue = 0;
    let currentState = 'drawing';
    
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      totalTime += delta;

      // Loop the animation every 15 seconds
      if (totalTime > 15) {
        totalTime = 0;
        currentState = 'drawing';
        setAnimationState('drawing');
        
        // Reset sketch elements
        sketchElements.forEach(el => {
          el.element.visible = false;
        });
        
        // Hide processing and results
        processingGroup.visible = false;
        scanner.visible = false;
        resultGroups.forEach(group => {
          group.visible = false;
        });
        
        progressValue = 0;
        progressBarFill.scale.x = progressValue;
        scanner.scale.set(0.1, 0.1, 0.1);
      }

      // State machine for animation
      if (currentState === 'drawing') {
        // Show pencil and animate drawing
        pencilGroup.visible = true;
        processingGroup.visible = false;
        
        // Animate sketch elements appearing
        sketchElements.forEach(el => {
          if (totalTime >= el.startTime && !el.element.visible) {
            el.element.visible = true;
            
            // Get the position data to move the pencil
            if (el.element.geometry.attributes && el.element.geometry.attributes.position) {
              const positions = el.element.geometry.attributes.position.array;
              const idx = Math.min(
                Math.floor((totalTime - el.startTime) * 10) * 3,
                positions.length - 3
              );
              pencilGroup.position.set(
                positions[idx],
                positions[idx + 1],
                positions[idx + 2] + 0.2
              );
            }
          }
        });
        
        // Transition to processing state
        if (totalTime > 5.5) {
          currentState = 'processing';
          setAnimationState('processing');
          pencilGroup.visible = false;
          processingGroup.visible = true;
        }
        
      } else if (currentState === 'processing') {
        // Animation for processing state
        progressValue = Math.min(1, progressValue + delta * 0.5);
        progressBarFill.scale.x = progressValue * 40; // Fill the progress bar
        progressBarFill.position.x = -2 + progressValue * 2; // Move along x axis
        
        // Transition to matching state
        if (progressValue >= 1 && totalTime > 7.5) {
          currentState = 'matching';
          setAnimationState('matching');
          processingGroup.visible = false;
          scanner.visible = true;
        }
        
      } else if (currentState === 'matching') {
        // Animation for matching state
        scanner.scale.x = Math.min(1, scanner.scale.x + delta * 0.5);
        scanner.scale.y = scanner.scale.x;
        scanner.rotation.z += delta * 2;
        
        // Show the match results sequentially
        if (totalTime > 9) {
          resultGroups[0].visible = true;
        }
        if (totalTime > 9.5) {
          resultGroups[1].visible = true;
        }
        if (totalTime > 10) {
          resultGroups[2].visible = true;
        }
        if (totalTime > 10.5) {
          resultGroups[3].visible = true;
        }
        
        // Highlight the best match
        if (totalTime > 11) {
          scanner.visible = false;
          resultGroups[0].scale.x = 1 + Math.sin(totalTime * 5) * 0.05;
          resultGroups[0].scale.y = resultGroups[0].scale.x;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div
          className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Forensic <span className="text-indigo-400">Face-Sketch Matching</span> & Analysis
          </h1>
          <p className="text-lg text-gray-300">
            Create, process, and match forensic sketches with our AI-powered platform. Instantly identify potential matches from databases of millions of faces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors">
              <PenTool className="h-5 w-5" />
              Start Sketching
            </button>
            {/* <button className="bg-transparent border border-indigo-500 hover:bg-indigo-900 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors">
              <Search className="h-5 w-5" />
              Try Demo
            </button> */}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div>
              <h4 className="text-2xl font-bold text-indigo-400">90%</h4>
              <p className="text-sm text-gray-400">Match Accuracy</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-indigo-400">500+</h4>
              <p className="text-sm text-gray-400">Database Records</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-indigo-400">3s</h4>
              <p className="text-sm text-gray-400">Average Match Time</p>
            </div>
          </div>
        </div>
        <div
          className={`flex justify-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          <div className="relative">
            <canvas ref={canvasRef} className="max-w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-gray-800 bg-opacity-80 text-sm px-4 py-2 rounded-full">
                {animationState === 'drawing' && (
                  <span className="flex items-center"><PenTool className="h-4 w-4 mr-2" /> Creating Sketch</span>
                )}
                {animationState === 'processing' && (
                  <span className="flex items-center"><Activity className="h-4 w-4 mr-2" /> Processing Features</span>
                )}
                {animationState === 'matching' && (
                  <span className="flex items-center"><Search className="h-4 w-4 mr-2" /> Finding Matches</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Forensic Vision Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Intuitive Sketch Creation</h3>
            <p className="text-gray-300">
              Use our advanced digital sketching tools for creating forensic facial composites.
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Feature Extraction</h3>
            <p className="text-gray-300">
              Our advanced algorithms extract key facial features from sketches and convert them to searchable biometric markers.
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rapid Database Matching</h3>
            <p className="text-gray-300">
              Find potential matches in minutes across database with side-by-side comparison.
            </p>
          </div>
        </div>

        {/* Additional Features */}
        {showMoreFeatures && (
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Save className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Access & Authentication</h3>
              <p className="text-gray-300">
              Successfully implemented login functionality with OTP verification, ensuring secure and authenticated access for investigators and forensic professionals.
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Intuitive Navigation</h3>
              <p className="text-gray-300">
              Developed key web pages, including Home, About, and Features, providing seamless navigation and a structured user experience.
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sketch Upload & Processing</h3>
              <p className="text-gray-300">
              Completed the upload sketch feature, allowing users to submit hand-drawn sketches for analysis, enhancing forensic investigation capabilities.
              </p>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowMoreFeatures(!showMoreFeatures)}
            className="group inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {showMoreFeatures ? 'Hide Additional Features' : 'Show More Features'}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl p-8 lg:p-12 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Transform Your Forensic Investigations</h2>
            <p className="text-gray-300 mb-6 max-w-2xl">
              Discover how our comprehensive forensic tools streamline investigations and deliver rapid, actionable insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors">
                Get Started
              </button>
              <button className="bg-transparent border border-white hover:bg-indigo-800 px-6 py-3 rounded-md font-medium transition-colors">
                Contact Us
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <FileCheck className="h-24 w-24 text-indigo-300 opacity-75" />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Feature;
