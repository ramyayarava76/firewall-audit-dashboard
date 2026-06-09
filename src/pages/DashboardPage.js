import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import RulesTable from '../components/RulesTable';
import RiskSummary from '../components/RiskSummary';

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

  const { filename, summary = {}, entries = [] } = state.result || {};

  // Fallback values if data is missing
  const safeSummary = {
    total: summary.total || 0,
    allowed: summary.allowed || 0,
    blocked: summary.blocked || 0,
    other: summary.other || 0,
    totalRules: summary.totalRules || 0,
    riskCount: summary.riskCount || 0,
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Audit Results</h2>
        <p className="dashboard-filename">File: <strong>{filename || 'Unknown'}</strong></p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Upload Another
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-total">
          <span className="card-label">Total Entries</span>
          <span className="card-value">{safeSummary.total}</span>
        </div>
        <div className="card card-allowed">
          <span className="card-label">Allowed</span>
          <span className="card-value">{safeSummary.allowed}</span>
        </div>
        <div className="card card-blocked">
          <span className="card-label">Blocked / Denied</span>
          <span className="card-value">{safeSummary.blocked}</span>
        </div>
        <div className="card card-other">
          <span className="card-label">Other</span>
          <span className="card-value">{safeSummary.other}</span>
        </div>
        <div className="card card-rules">
          <span className="card-label">Total Rules</span>
          <span className="card-value">{safeSummary.totalRules}</span>
        </div>
        <div className="card card-files">
          <span className="card-label">Uploaded Files</span>
          <span className="card-value">{uploadedFilesCount}</span>
        </div>
        <div className="card card-risk">
          <span className="card-label">Risk Count</span>
          <span className="card-value">{safeSummary.riskCount}</span>
        </div>
      </div>

      <RiskSummary summary={safeSummary} />

      {/* Rules Table */}
      <h3 className="section-title">Firewall Rules</h3>
      <RulesTable entries={entries} />
    </div>
  );
}

export default DashboardPage;
