import React, { useState } from 'react';
import '../styles/main.css';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setUploadStatus('');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file before uploading.');
      return;
    }
    // Simulate upload
    setUploadStatus(`Uploading "${selectedFile.name}"...`);
    setTimeout(() => {
      setUploadStatus(`"${selectedFile.name}" uploaded successfully.`);
    }, 1500);
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Firewall Log</h2>
      <div className="upload-box">
        <label htmlFor="file-input" className="file-label">
          Choose File
        </label>
        <input
          id="file-input"
          type="file"
          className="file-input"
          onChange={handleFileChange}
          accept=".log,.txt,.csv,.json"
        />
        {selectedFile && (
          <p className="file-name">{selectedFile.name}</p>
        )}
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload
        </button>
        {uploadStatus && (
          <p className="upload-status">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
}

export default Upload;
