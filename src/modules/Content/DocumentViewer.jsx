import React from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';

/**
 * Content Module - Document Viewer
 * Helps students view reading materials, setup guides, and download documents
 * Secure storage implied by secure presigned URLs in real implementation.
 */
const DocumentViewer = ({ moduleData, onComplete }) => {
  return (
    <div
      className="glass-panel fade-in"
      style={{
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FileText size={64} color="var(--accent)" style={{ marginBottom: '24px' }} />
      <h2>{moduleData.title}</h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          marginTop: '8px',
          maxWidth: '500px',
          textAlign: 'center'
        }}
      >
        Review the course materials and ensure your environment is set up according to
        the instructions before proceeding.
      </p>

      {moduleData.downloadable && (
        <button
          className="btn btn-primary"
          style={{ marginTop: '24px' }}
          onClick={() => {
            // Trigger download then complete
            if (onComplete) onComplete();
          }}
        >
          <Download size={18} /> Download Summary PDF
        </button>
      )}
      
      {!moduleData.downloadable && (
         <button className="btn btn-secondary" style={{ marginTop: '24px' }} onClick={onComplete}>
           Mark as Read <CheckCircle size={18} />
         </button>
      )}
    </div>
  );
};

export default DocumentViewer;
