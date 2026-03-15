import React from 'react';

/**
 * Progress Tracking Module - Progress Bar Component
 * Ensures accurate tracking UI for the student progress completion status.
 */
const ProgressBar = ({ percentage }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          marginBottom: '8px'
        }}
      >
        <span>Course Progress</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
          {percentage}%
        </span>
      </div>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;
