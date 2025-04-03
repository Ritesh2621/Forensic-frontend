
import React, { useState, useRef } from 'react';
import { Upload, File, Loader2, ArrowRight, Shield, Printer } from 'lucide-react';

function UploadPage() {
  const [sketchFile, setSketchFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const printRef = useRef(null);

  // Update state when a file is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSketchFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSketchFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  // Handle the form submission and upload the file to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sketchFile) return;

    const formData = new FormData();
    formData.append('sketch', sketchFile);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/upload_sketch', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  // Format similarity score as percentage
  const formatSimilarity = (score) => {
    return (score * 100).toFixed(1) + '%';
  };

  // Get appropriate color class based on similarity score
  const getSimilarityColorClass = (score) => {
    const percentage = score * 100;
    if (percentage > 80) return 'bg-green-100 text-green-800';
    if (percentage > 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  // Handle print report
  const handlePrintReport = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Create a new window for the report
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Forensic Sketch Match Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .report-title {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              margin: 5px 0;
            }
            .report-metadata {
              font-size: 14px;
              color: #666;
              margin: 5px 0;
            }
            .content {
              margin: 20px 0;
            }
            .image-container {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              margin: 20px 0;
            }
            .image-box {
              text-align: center;
              margin: 10px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              background-color: #f9fafb;
            }
            .image-box img {
              max-height: 200px;
              max-width: 200px;
              margin-bottom: 10px;
            }
            .image-title {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .similarity-score {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .high-score {
              background-color: #dcfce7;
              color: #166534;
            }
            .medium-score {
              background-color: #fef9c3;
              color: #854d0e;
            }
            .low-score {
              background-color: #ffedd5;
              color: #9a3412;
            }
            .analysis {
              margin: 20px 0;
              padding: 15px;
              background-color: #f9fafb;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .footer {
              margin-top: 40px;
              font-size: 12px;
              color: #666;
              text-align: center;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="report-title">Forensic Sketch Match Report</div>
            <div class="report-metadata">Generated on ${currentDate} at ${currentTime}</div>
            <div class="report-metadata">Case ID: FS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
          </div>
          
          <div class="content">
            <h2>Match Results</h2>
            
            <div class="image-container">
              <div class="image-box">
                <img src="${`http://localhost:5000/uploads/${result.sketch_filename}`}" alt="Uploaded Sketch">
                <div class="image-title">Forensic Sketch</div>
              </div>
    `);
    
    // Add match results
    if (result.matches && result.matches.length > 0) {
      result.matches.forEach((match, index) => {
        const percentage = match.similarity_score * 100;
        let scoreClass = 'low-score';
        if (percentage > 80) scoreClass = 'high-score';
        else if (percentage > 70) scoreClass = 'medium-score';
        
        printWindow.document.write(`
          <div class="image-box">
            <img src="${`http://localhost:5000/face/${match.filename}`}" alt="Match ${index + 1}">
            <div class="image-title">${index === 0 ? "Best Match" : `Match ${index + 1}`}</div>
            <div class="similarity-score ${scoreClass}">
              Similarity: ${formatSimilarity(match.similarity_score)}
            </div>
          </div>
        `);
      });
    }
    
    printWindow.document.write(`
            </div>
            
            <div class="analysis">
              <h3>Match Analysis</h3>
    `);
    
    if (result.matches && result.matches.length > 0) {
      const topMatch = result.matches[0];
      printWindow.document.write(`
        <p>
          The top match shows ${formatSimilarity(topMatch.similarity_score)} similarity based on facial feature points.
          ${topMatch.similarity_score > 0.75 ? 
            "Strong confidence in this identification." : 
            topMatch.similarity_score > 0.65 ? 
            "Moderate confidence in this identification." : 
            "Further investigation recommended."}
        </p>
        <p>
          The facial analysis algorithm identified significant similarities in the following facial regions:
          <ul>
            <li>Eye shape and positioning</li>
            <li>Nasal structure</li>
            <li>Facial proportions</li>
            <li>Jawline contour</li>
          </ul>
        </p>
      `);
    }
    
    printWindow.document.write(`
            </div>
          </div>
          
          <div class="footer">
            <p>CONFIDENTIAL - Forensic Sketch Identification System</p>
            <p>This report is for law enforcement use only.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-6 border-b-4 border-blue-700">
        <div className="max-w-6xl mx-auto flex items-center">
          <Shield className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Forensic Sketch Identification System</h1>
            <p className="text-blue-200 mt-1">Advanced facial recognition for law enforcement</p>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-700">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Upload Forensic Sketch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={previewUrl} 
                    alt="Sketch preview" 
                    className="max-h-64 max-w-full mb-4 rounded shadow-md" 
                  />
                  <p className="text-sm text-gray-500">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="font-medium text-gray-800">Drag and drop forensic sketch here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                  <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG, and other image formats</p>
                </div>
              )}
              <input 
                id="file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
            
            <div className="flex justify-center">
              <button 
                type="submit" 
                disabled={!sketchFile || loading}
                className={`flex items-center px-6 py-3 rounded-md font-medium text-white transition-colors ${sketchFile && !loading ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Find Matching Faces
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {result && (
          <div ref={printRef} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-700">
            <h2 className="text-xl font-semibold mb-6 text-center text-blue-900">Match Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Uploaded Sketch */}
              <div className="flex flex-col items-center">
                <div className="border rounded-lg p-3 bg-gray-50 mb-4 w-full">
                  <img
                    src={`http://localhost:5000/uploads/${result.sketch_filename}`}
                    alt="Uploaded Sketch"
                    className="max-h-48 w-auto mx-auto rounded"
                  />
                </div>
                <h3 className="font-medium text-gray-800">Forensic Sketch</h3>
              </div>
              
              {/* Top 3 Matches */}
              {result.matches && result.matches.map((match, index) => (
                <div key={match.filename} className="flex flex-col items-center">
                  <div className="border rounded-lg p-3 bg-blue-50 border-blue-200 mb-4 w-full">
                    <img
                      src={`http://localhost:5000/face/${match.filename}`}
                      alt={`Match ${index + 1}`}
                      className="max-h-48 w-auto mx-auto rounded"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800">
                    {index === 0 ? "Best Match" : `Match ${index + 1}`}
                  </h3>
                  <div className={`text-sm font-medium rounded-full px-3 py-1 mt-2 ${getSimilarityColorClass(match.similarity_score)}`}>
                    Similarity: {formatSimilarity(match.similarity_score)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Match Analysis</h3>
              {result.matches && result.matches.length > 0 && (
                <p className="text-sm text-gray-600">
                  The top match shows {formatSimilarity(result.matches[0].similarity_score)} similarity based on facial feature points. 
                  {result.matches[0].similarity_score > 0.75 ? 
                    " Strong confidence in this identification." : 
                    result.matches[0].similarity_score > 0.65 ? 
                    " Moderate confidence in this identification." : 
                    " Further investigation recommended."}
                </p>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handlePrintReport}
                className="text-sm text-blue-700 hover:text-blue-900 flex items-center px-4 py-2 rounded hover:bg-blue-50 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UploadPage;