import React, { useState } from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

/**
 * Assessment Module - Quiz Engine
 * Handles rendering questions, selecting answers, tracking score
 * and supporting data integrity for assessments.
 */
const QuizEngine = ({ moduleData, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = selectedOption === moduleData.answer;
    const finalScore = correct ? 100 : 0;
    setScore(finalScore);
    
    if (correct) {
      // Data Integrity: accurate tracking of student progress via callback
      onComplete(finalScore);
    }
  };

  return (
    <div className="glass-panel fade-in" style={{ minHeight: '400px' }}>
      <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <HelpCircle color="var(--warning)" /> {moduleData.title}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Test your knowledge before moving on.
      </p>

      {!submitted ? (
        <>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>{moduleData.question}</h3>
          <div className="grid grid-cols-1">
            {moduleData.options.map((opt, idx) => (
              <div
                key={idx}
                className={`quiz-option ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                {opt}
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: '24px', width: '100%' }}
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit Answer
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          {score === 100 ? (
            <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 24px auto' }} />
          ) : (
            <HelpCircle size={80} color="var(--danger)" style={{ margin: '0 auto 24px auto' }} />
          )}
          <h3 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {score === 100 ? 'Excellent Work!' : 'Not quite right.'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '32px' }}>
            Your score: {score}%
          </p>
          {score !== 100 && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSubmitted(false);
                setSelectedOption(null);
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizEngine;
