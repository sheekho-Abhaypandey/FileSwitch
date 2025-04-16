import React, { useState } from "react";
import {
  FaFileWord,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFileExcel,
  FaEye,
  FaDownload,
  FaRedo
} from "react-icons/fa";
import axios from "axios";

const fileIcon = {
  docx: <FaFileWord className="text-3xl mr-3 text-blue-600" />,
  pdf: <FaFilePdf className="text-3xl mr-3 text-red-600" />,
  jpg: <FaFileImage className="text-3xl mr-3 text-purple-600" />,
  png: <FaFileImage className="text-3xl mr-3 text-green-600" />,
  txt: <FaFileAlt className="text-3xl mr-3 text-gray-600" />,
  xlsx: <FaFileExcel className="text-3xl mr-3 text-green-700" />
  
};

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionFormat, setConversionFormat] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Conversion state
  const [isConverted, setIsConverted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [convertedBlob, setConvertedBlob] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      resetConversionState();
    }
  };

  const handleConvertFormat = (e) => {
    setConversionFormat(e.target.value);
    resetConversionState();
  };

  const resetConversionState = () => {
    setIsConverted(false);
    setPreviewUrl("");
    setConvertedBlob(null);
    setMessage("");
    setError("");
  };

  const defaultFileIcon = (file) => {
    if (!file) return null;
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return fileIcon[fileExtension] || <FaFileAlt className="text-3xl mr-3" />;
  };

  const conversionMap = {
    docx: { pdf: "docx-to-pdf", jpg: "docx-to-jpg", png: "docx-to-png" },
    pdf: { docx: "pdf-to-docx", jpg: "pdf-to-jpg", png: "pdf-to-png" },
    jpg: { docx: "jpg-to-docx", pdf: "jpg-to-pdf", png: "jpg-to-png" },
    png: { docx: "png-to-docx", pdf: "png-to-pdf", jpg: "png-to-jpg" }
  };

  const handleConversion = async () => {
    if (!selectedFile || !conversionFormat) return;

    const inputFormat = selectedFile.name.split(".").pop().toLowerCase();
    const conversionPath = conversionMap[inputFormat]?.[conversionFormat];

    if (!conversionPath) {
      setError("Invalid file conversion selected.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `/convertFile/${conversionPath}`,
        formData,
        { responseType: "blob" }
      );
      
      // Store the blob for later download
      setConvertedBlob(response.data);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(response.data);   //checking the diffference two previewUrl one is state hook and the other one is varable
      setPreviewUrl(previewUrl);
      
      setIsConverted(true);
      setMessage("File converted successfully! You can preview or download it.");
    } catch (error) {
      console.error("Conversion Error:", error);
      setError(error.response?.data?.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };


  //debug the below code line-by-line
  const handleDownload = () => {
    if (!convertedBlob) return;
    
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.name.replace(/\.[^/.]+$/, `.${conversionFormat}`) //debug this line 
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    
    setMessage("File downloaded successfully!");
  };

  const resetAll = () => {
    setSelectedFile(null);
    setConversionFormat("");
    resetConversionState();
  };

  // Determine what preview component to show based on format
  const renderPreview = () => {
    if (!previewUrl) return null;

    switch (conversionFormat) {
      case 'pdf':
        return (
          <div className="mt-4 w-full">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <iframe 
              src={previewUrl} 
              className="w-full h-96 border border-gray-300 rounded"
              title="PDF Preview"
            />
          </div>
        );
      case 'jpg':
      case 'png':
        return (
          <div className="mt-4 w-full">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <img 
              src={previewUrl} 
              alt="Image Preview" 
              className="max-w-full max-h-96 border border-gray-300 rounded mx-auto"
            />
          </div>
        );
      case 'docx':
        return (
          <div className="mt-4 w-full">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <div className="bg-gray-100 p-4 border border-gray-300 rounded">
              <p className="text-gray-500">DOCX preview not available. Please download to view the document.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 dark:text-white dark:bg-gray-900">
        <div className="flex min-h-screen items-center justify-center pt-16 pb-8">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-4">
              File Converter Online
            </h1>
            <p className="text-sm text-center mb-5">
              Easily convert files to any format online, without having
              to install any software.
            </p>

            <div className="flex flex-col items-center space-y-4">
              {!isConverted ? (
                <>
                  <input
                    type="file"
                    accept=".doc,.docx,.jpg,.pdf,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="FileInput"
                  />
                  <label
                    htmlFor="FileInput"
                    className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
                  >
                    {defaultFileIcon(selectedFile)}
                    <span className="text-xl">
                      {selectedFile ? selectedFile.name : "Choose File"}
                    </span>
                  </label>

                  <select
                    className="w-full py-2 border-2 border-gray-300 rounded-lg px-2"
                    value={conversionFormat}
                    onChange={handleConvertFormat}
                  >
                    <option value="" disabled>
                      Select output format
                    </option>
                    <option value="docx" disabled={selectedFile?.name?.split('.').pop().toLowerCase() === "docx"}>
                      DOCX
                    </option>
                    <option value="pdf" disabled={selectedFile?.name?.split('.').pop().toLowerCase() === "pdf"}>
                      PDF
                    </option>
                    <option value="jpg" disabled={selectedFile?.name?.split('.').pop().toLowerCase() === "jpg"}>
                      JPG
                    </option>
                    <option value="png" disabled={selectedFile?.name?.split('.').pop().toLowerCase() === "png"}>
                      PNG
                    </option>
                  </select>

                  <button
                    onClick={handleConversion}
                    disabled={!selectedFile || !conversionFormat || loading}
                    className="w-full flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-4 py-2 rounded-lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Converting...
                      </>
                    ) : (
                      "Convert File"
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      {defaultFileIcon({ name: `file.${conversionFormat}` })}
                      <span className="font-semibold">
                        {selectedFile.name.replace(/\.[^/.]+$/, `.${conversionFormat}`)} 
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mb-3">Conversion completed successfully!</p>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center text-white bg-green-500 hover:bg-green-700 font-bold px-4 py-2 rounded-lg"
                      >
                        <FaDownload className="mr-2" /> Download
                      </button>
                      
                      <button
                        onClick={resetAll}
                        className="flex items-center justify-center text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-bold px-4 py-2 rounded-lg"
                      >
                        <FaRedo className="mr-2" /> New Conversion
                      </button>
                    </div>
                  </div>
                  
                  {renderPreview()}
                </div>
              )}
              
              {message && !isConverted && (
                <div className="text-green-500 text-center">{message}</div>
              )}
              
              {error && (
                <div className="text-red-500 text-center">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;