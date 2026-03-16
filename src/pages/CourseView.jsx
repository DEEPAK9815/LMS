import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle } from 'lucide-react';

/* --- LMS Architectural Modules Imported --- */
import VideoPlayer from '../modules/Content/VideoPlayer';
import DocumentViewer from '../modules/Content/DocumentViewer';
import QuizEngine from '../modules/Assessment/QuizEngine';
import ProgressBar from '../modules/Progress/ProgressBar';
import { getCourses, getUserEnrollment, updateProgress } from '../data/mockDb';
import { useAuth } from '../App';

/**
 * Main Course View Container
 */
const CourseView = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  useEffect(() => {
    const allCourses = getCourses();
    const currCourse = allCourses.find(c => c.id === courseId);
    setCourse(currCourse);
    if(currCourse && user) {
        const enrolDb = getUserEnrollment(user.id, currCourse.id);
        setEnrollment(enrolDb);
        if (enrolDb && enrolDb.completedLessons.length > 0) {
            // Find first uncompleted
            let firstUncompleted = 0;
            while (firstUncompleted < currCourse.modules.length && enrolDb.completedLessons.includes(firstUncompleted)) {
               firstUncompleted++;
            }
            if (firstUncompleted < currCourse.modules.length) {
               setActiveLessonIndex(firstUncompleted);
            } else {
               setActiveLessonIndex(currCourse.modules.length - 1); // all completed
            }
        }
    }
  }, [courseId, user]);

  if (!course) return <div style={{ padding: '64px', textAlign: 'center' }}>Loading Course...</div>;
  if (!enrollment) return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't purchased this course yet.</p>
          <Link to={`/course/${course.id}/details`} className="btn btn-primary">Go to Course Details</Link>
      </div>
  );

  const currentModule = course.modules[activeLessonIndex];
  const progressPercentage = enrollment.progress || 0;

  // Track student progress securely and accurately
  const handleModuleComplete = () => {
      updateProgress(user.id, course.id, activeLessonIndex);
      setEnrollment(getUserEnrollment(user.id, course.id)); // refresh local state
      
      // Auto move to next lesson after marking as completed
      if (activeLessonIndex < course.modules.length - 1) {
          setActiveLessonIndex(activeLessonIndex + 1);
      }
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
             Module {activeLessonIndex + 1}: {currentModule?.title}
          </p>
          
          {/* Content Module (Video) */}
          {currentModule?.type === 'video' && (
             <VideoPlayer activeLesson={activeLessonIndex} onComplete={handleModuleComplete} videoUrl={currentModule?.videoUrl} />
          )}

          {/* Content Module (Document via DocumentViewer) */}
          {currentModule?.type === 'document' && (
             <DocumentViewer moduleData={currentModule} onComplete={handleModuleComplete} />
          )}

          {/* Assessment Module */}
          {currentModule?.type === 'quiz' && (
             <QuizEngine moduleData={currentModule} onComplete={handleModuleComplete} />
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveLessonIndex(Math.max(0, activeLessonIndex - 1))}
              disabled={activeLessonIndex === 0}
              style={{ padding: '12px 24px', opacity: activeLessonIndex === 0 ? 0.5 : 1, cursor: activeLessonIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous Lesson
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveLessonIndex(Math.min(course.modules.length - 1, activeLessonIndex + 1))}
              disabled={activeLessonIndex === course.modules.length - 1}
              style={{ padding: '12px 24px', opacity: activeLessonIndex === course.modules.length - 1 ? 0.5 : 1, cursor: activeLessonIndex === course.modules.length - 1 ? 'not-allowed' : 'pointer' }}
            >
              Next Lesson
            </button>
          </div>

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
            {course.modules.map((lesson, idx) => {
              const isCompleted = enrollment.completedLessons.includes(idx);
              return (
              <div 
                key={idx} 
                className={`lesson-item ${activeLessonIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveLessonIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isCompleted ? (
                    <CheckCircle size={18} color="var(--success)" />
                  ) : lesson.type === 'video' ? (
                    <PlayCircle size={18} color="var(--text-secondary)" />
                  ) : lesson.type === 'quiz' ? (
                    <HelpCircle size={18} color="var(--warning)" />
                  ) : (
                    <FileText size={18} color="var(--text-secondary)" />
                  )}
                  <span style={{ fontSize: '0.9rem', color: activeLessonIndex === idx ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {idx + 1}. {lesson.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lesson.duration || 'Read'}</span>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
