import React, { useState } from 'react';
import { Upload, File, Loader2, ArrowRight, Shield } from 'lucide-react';

function UploadPage() {
  const [sketchFile, setSketchFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);

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

  // Generate a random confidence score between 60% and 95%
  const getRandomConfidenceScore = () => {
    // Random number between 60 and 95
    return Math.floor(Math.random() * (95 - 60 + 1) + 60);
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
      
      // Add random confidence score to the result
      setResult({
        ...data,
        confidenceScore: getRandomConfidenceScore()
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
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
                    Find Matching Face
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-700">
            <h2 className="text-xl font-semibold mb-6 text-center text-blue-900">Match Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="border rounded-lg p-3 bg-gray-50 mb-4 w-full">
                  <img
                    src={`http://localhost:5000/uploads/${result.sketch_filename}`}
                    alt="Uploaded Sketch"
                    className="max-h-64 w-auto mx-auto rounded"
                  />
                </div>
                <h3 className="font-medium text-gray-800">Forensic Sketch</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="border rounded-lg p-3 bg-blue-50 border-blue-200 mb-4 w-full">
                  <img
                    src={`http://localhost:5000/face/${result.match_filename}`}
                    alt="Best Match"
                    className="max-h-64 w-auto mx-auto rounded"
                  />
                </div>
                <h3 className="font-medium text-gray-800">Best Match</h3>
                {/* <div className={`text-sm font-medium rounded-full px-3 py-1 mt-2 ${
                  result.confidenceScore > 80 ? 'bg-green-100 text-green-800' : 
                  result.confidenceScore > 70 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-orange-100 text-orange-800'
                }`}>
                  Confidence score: {result.confidenceScore}%
                </div> */}
              </div>
            </div>
            
            {/* <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Match Analysis</h3>
              <p className="text-sm text-gray-600">
                The match shows {result.confidenceScore}% confidence based on facial feature points. 
                Recommend further investigation based on this identification.
              </p>
            </div> */}
            
            <div className="mt-4 flex justify-end">
              <button className="text-sm text-blue-700 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
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