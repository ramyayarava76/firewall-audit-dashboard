import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function DashboardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  // Track uploaded files
  useEffect(() => {
    if (state?.result?.filename) {
      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      if (!uploadedFiles.includes(state.result.filename)) {
        uploadedFiles.push(state.result.filename);
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
      }
      setUploadedFilesCount(uploadedFiles.length);
    }
  }, [state]);

  if (!state?.result) {
    return (
      <div className="dashboard-empty">
        <p>No audit data found.</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          Go to Upload
        </button>
      </div>
    );
  }

  const { filename, summary, entries } = state.result;
  const columns = entries.length > 0 ? Object.keys(entries[0]) : [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Audit Results</h2>
        <p className="dashboard-filename">File: <strong>{filename}</strong></p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Upload Another
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-total">
          <span className="card-label">Total Entries</span>
          <span className="card-value">{summary.total}</span>
        </div>
        <div className="card card-allowed">
          <span className="card-label">Allowed</span>
          <span className="card-value">{summary.allowed}</span>
        </div>
        <div className="card card-blocked">
          <span className="card-label">Blocked / Denied</span>
          <span className="card-value">{summary.blocked}</span>
        </div>
        <div className="card card-other">
          <span className="card-label">Other</span>
          <span className="card-value">{summary.other}</span>
        </div>
        <div className="card card-rules">
          <span className="card-label">Total Rules</span>
          <span className="card-value">{summary.totalRules}</span>
        </div>
        <div className="card card-files">
          <span className="card-label">Uploaded Files</span>
          <span className="card-value">{uploadedFilesCount}</span>
        </div>
        <div className="card card-risk">
          <span className="card-label">Risk Count</span>
          <span className="card-value">{summary.riskCount}</span>
        </div>
      </div>

      {/* Entries Table */}
      {entries.length > 0 ? (
        <div className="table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((row, i) => (
                <tr key={i} className={getRowClass(row)}>
                  {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-entries">No entries found in the file.</p>
      )}
    </div>
  );
}

function getRowClass(row) {
  const action = String(row.action || row.Action || '').toUpperCase();
  if (action === 'BLOCK' || action === 'DENY') return 'row-blocked';
  if (action === 'ALLOW' || action === 'PERMIT') return 'row-allowed';
  return '';
}

export default DashboardPage;
