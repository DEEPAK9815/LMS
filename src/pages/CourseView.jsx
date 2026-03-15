import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle } from 'lucide-react';

/* --- LMS Architectural Modules Imported --- */
import VideoPlayer from '../modules/Content/VideoPlayer';
import DocumentViewer from '../modules/Content/DocumentViewer';
import QuizEngine from '../modules/Assessment/QuizEngine';
import ProgressBar from '../modules/Progress/ProgressBar';

/**
 * Main Course View Container
 * Demonstrates: Maintainability, Modular Code, Data Integrity 
 */
const CourseView = () => {
  const { courseId } = useParams();
  const [activeLesson, setActiveLesson] = useState(0);

  // Simulated Database/State Management with 'Data Integrity'
  const [lessons, setLessons] = useState([
    { id: 0, type: 'video', title: 'Introduction to the Course', duration: '5:30', completed: true },
    { id: 1, type: 'video', title: 'Core Concepts Explained', duration: '12:45', completed: true },
    { id: 2, type: 'document', title: 'Setup Guide & Materials', duration: 'Read', completed: false, downloadable: true },
    { id: 3, type: 'video', title: 'Advanced Methods', duration: '18:20', completed: false },
    { id: 4, type: 'quiz', title: 'Module 1 Assessment', duration: '10 mins', completed: false,
      question: 'Which of the following is NOT a valid concept?',
      options: ['Abstraction', 'Encapsulation', 'Reiteration', 'Polymorphism'],
      answer: 2
    }
  ]);

  const currentModule = lessons[activeLesson];
  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercentage = Math.round((completedCount / lessons.length) * 100);

  // Track student progress securely and accurately
  const handleModuleComplete = () => {
    setLessons(prev => prev.map(
      lesson => lesson.id === currentModule.id ? { ...lesson, completed: true } : lesson
    ));
    // In a real application, make secure API call to sync Data Integrity tracking.
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="grid course-view-grid" style={{ gridTemplateColumns: '1fr 350px', alignItems: 'start', gap: '32px' }}>
        
        {/* Main Content Area - Renders Specific Module Based on Type */}
        <div className="fade-in">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Web Development Masterclass</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
             Learn everything you need to know about building robust applications.
          </p>
          
          {/* Content Module (Video) */}
          {currentModule.type === 'video' && (
             <VideoPlayer activeLesson={activeLesson} onComplete={handleModuleComplete} />
          )}

          {/* Content Module (Document via DocumentViewer) */}
          {currentModule.type === 'document' && (
             <DocumentViewer moduleData={currentModule} onComplete={handleModuleComplete} />
          )}

          {/* Assessment Module */}
          {currentModule.type === 'quiz' && (
             <QuizEngine moduleData={currentModule} onComplete={handleModuleComplete} />
          )}

          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Discussion Community</h3>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--glass-border)' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', flexShrink: 0 }}></div>
                 <div>
                   <p style={{ fontWeight: 600 }}>Alex Smith <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>• 2 days ago</span></p>
                   <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>This module was incredibly helpful!</p>
                 </div>
              </div>
              <textarea 
                className="form-input" 
                placeholder="Ask a question or share your thoughts..." 
                style={{ height: '100px', resize: 'none', marginBottom: '12px' }}
              />
              <button className="btn btn-primary">Post Comment</button>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Index & Progress Tracker Module */}
        <div className="glass-panel" style={{ position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            Course Content
          </h3>
          
          <div style={{ marginBottom: '24px' }}>
             <ProgressBar percentage={progressPercentage} />
          </div>

          <div className="lesson-list">
            {lessons.map((lesson, idx) => (
              <div 
                key={idx} 
                className={`lesson-item ${activeLesson === idx ? 'active' : ''}`}
                onClick={() => setActiveLesson(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {lesson.completed ? (
                    <CheckCircle size={18} color="var(--success)" />
                  ) : lesson.type === 'video' ? (
                    <PlayCircle size={18} color="var(--text-secondary)" />
                  ) : lesson.type === 'quiz' ? (
                    <HelpCircle size={18} color="var(--warning)" />
                  ) : (
                    <FileText size={18} color="var(--text-secondary)" />
                  )}
                  <span style={{ fontSize: '0.9rem', color: activeLesson === idx ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {idx + 1}. {lesson.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lesson.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
