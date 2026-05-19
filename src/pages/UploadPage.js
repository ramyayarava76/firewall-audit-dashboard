import React from 'react';
import Upload from '../components/Upload';

function UploadPage({ onUploadSuccess }) {
  return <Upload onUploadSuccess={onUploadSuccess} />;
}

export default UploadPage;
