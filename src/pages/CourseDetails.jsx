import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourses, getUserEnrollment } from '../data/mockDb';
import { useAuth } from '../App';
import { PlayCircle, FileText, Award, Clock, ArrowLeft, Tag, Users } from 'lucide-react';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const allCourses = getCourses();
    const current = allCourses.find(c => c.id === courseId);
    setCourse(current);
    
    // Pick first 2 related courses, ignoring self
    setRelated(allCourses.filter(c => c.id !== courseId).slice(0, 2));

    if (user && current) {
      const enrollment = getUserEnrollment(user.id, current.id);
      if (enrollment) setIsEnrolled(true);
    }
  }, [courseId, user]);

  if (!course) return <div className="p-8 text-center" style={{ padding: '64px', textAlign: 'center' }}>Loading course...</div>;

  const finalPrice = course.price - (course.price * (course.discount || 0)/100);

  return (
    <div className="fade-in" style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 350px', alignItems: 'start', gap: '40px' }}>
        {/* Left Side: Information & Modules */}
        <div>
           <img 
             src={course.thumbnail} 
             alt="Course Thumbnail"
             style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px' }}
           />
           <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{course.title}</h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '32px' }}>
             {course.description}
           </p>

           <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '32px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Users size={24} color="var(--primary)" />
                 <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Instructor</p><p style={{ fontWeight: 600 }}>{course.instructor}</p></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Clock size={24} color="var(--accent)" />
                 <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Modules</p><p style={{ fontWeight: 600 }}>{course.modules.length}</p></div>
              </div>
           </div>

           <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Course Syllabus</h3>
           <div className="glass-panel">
               {course.modules.length > 0 ? course.modules.map((m, idx) => (
                  <div key={idx} style={{ 
                      padding: '16px', borderBottom: idx !== course.modules.length - 1 ? '1px solid var(--glass-border)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         {m.type === 'video' ? <PlayCircle color="var(--primary)" size={18} /> : <FileText color="var(--accent)" size={18} />}
                         <p style={{ fontWeight: 500 }}>Module {idx + 1}: {m.title}</p>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {m.type === 'video' ? m.duration : 'Reading / PDF'}
                      </span>
                  </div>
               )) : <p>No modules available</p>}
           </div>

           {/* Discovery / Related Courses */}
           {related.length > 0 && (
             <div style={{ marginTop: '64px' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Related Courses</h3>
                <div className="grid grid-cols-2">
                   {related.map(rCourse => (
                      <div key={rCourse.id} className="glass-panel flex-row" style={{ display: 'flex', gap: '20px', cursor: 'pointer', transition: '0.3s' }} onClick={() => navigate(`/course/${rCourse.id}/details`)}>
                         <img src={rCourse.thumbnail} style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                         <div style={{ flex: 1 }}>
                           <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{rCourse.title}</h4>
                           <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${(rCourse.price - rCourse.price * (rCourse.discount||0)/100).toFixed(2)}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Right Sidebar: Purchasing logic */}
        <div className="glass-panel fade-in" style={{ position: 'sticky', top: '90px' }}>
           <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 700 }}>
                ${finalPrice.toFixed(2)}
              </h2>
              {course.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                          ${course.price.toFixed(2)}
                      </span>
                      <span className="badge badge-warning py-1">{course.discount}% OFF</span>
                  </div>
              )}
           </div>
           
           {isEnrolled ? (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', marginBottom: '16px' }}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                 Continue Learning
              </button>
           ) : (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', marginBottom: '16px' }}
                onClick={() => {
                   if (!user) navigate('/login?mode=register');
                   else navigate(`/payment/${course.id}`);
                }}
              >
                 Buy Course
              </button>
           )}

           <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '24px' }}>
             <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Award size={16} color="var(--success)"/> Certificate of completion</p>
             <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><PlayCircle size={16} /> Full lifetime access</p>
             <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={16} /> Secure payment checkout</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
