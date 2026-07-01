import React, { useState } from 'react';
import '../styles/main.css';
import { uploadFile } from '../utils/api';

function Upload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusType, setStatusType] = useState(''); // 'success', 'error', 'info'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadStatus('File size exceeds 50MB limit.');
        setStatusType('error');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadStatus('');
      setStatusType('');
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file before uploading.');
      setStatusType('error');
      return;
    }

    setIsLoading(true);
    setUploadStatus(`Uploading "${selectedFile.name}"...`);
    setStatusType('info');

    const { data, error } = await uploadFile(selectedFile);

    setIsLoading(false);

    if (error) {
      setUploadStatus(`Upload failed: ${error}`);
      setStatusType('error');
    } else {
      const username = data?.username || data?.uploadedBy || 'User';
      const statusMsg = `${data?.message || `"${selectedFile.name}" uploaded successfully.`} (Uploaded by: ${username})`;
      setUploadStatus(statusMsg);
      setStatusType('success');
      if (onUploadSuccess) onUploadSuccess(data);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus('');
    setStatusType('');
  };

  return (
    <div className="upload-container">
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <h1 className="upload-title">Upload Firewall Logs</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          Upload your firewall audit logs for analysis and compliance reporting
        </p>

        <div className="upload-box">
          <label htmlFor="file-input" className="file-label">
            <span>📁 Choose File</span>
          </label>
          <input
            id="file-input"
            type="file"
            className="file-input"
            onChange={handleFileChange}
            accept=".log,.txt,.csv,.json"
            disabled={isLoading}
            aria-label="Upload firewall log file"
          />

          {selectedFile && (
            <div className="file-info">
              <p className="file-name">✓ {selectedFile.name}</p>
              <p className="file-size">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          <div className="upload-actions">
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              aria-label="Upload file"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Uploading…
                </>
              ) : (
                <>📤 Upload</>
              )}
            </button>

            {selectedFile && (
              <button
                className="upload-btn-secondary"
                onClick={handleReset}
                disabled={isLoading}
                aria-label="Clear selection"
              >
                Clear
              </button>
            )}
          </div>

          {uploadStatus && (
            <div className={`upload-status upload-status-${statusType}`}>
              <p>
                {statusType === 'success' && '✓ '}
                {statusType === 'error' && '✗ '}
                {statusType === 'info' && '⏳ '}
                {uploadStatus}
              </p>
            </div>
          )}
        </div>

        <div className="upload-hints">
          <p>💡 <strong>Supported formats:</strong> .log, .txt, .csv, .json</p>
          <p>📦 <strong>Maximum file size:</strong> 50 MB</p>
        </div>
      </div>
    </div>
  );
}

export default Upload;
