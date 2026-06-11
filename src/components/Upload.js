import React, { useState } from 'react';
import '../styles/main.css';
import { uploadFile } from '../utils/api';

function Upload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file before uploading.');
      return;
    }

    setIsLoading(true);
    setUploadStatus(`Uploading "${selectedFile.name}"...`);

    const { data, error } = await uploadFile(selectedFile);

    setIsLoading(false);

    if (error) {
      setUploadStatus(`Upload failed: ${error}`);
    } else {
      const username = data?.username || data?.uploadedBy || 'User';
      const statusMsg = `${data?.message || `"${selectedFile.name}" uploaded successfully.`} (Uploaded by: ${username})`;
      setUploadStatus(statusMsg);
      if (onUploadSuccess) onUploadSuccess(data);
    }
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
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Uploading…' : 'Upload'}
        </button>
        {uploadStatus && (
          <p className="upload-status">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
}

export default Upload;
