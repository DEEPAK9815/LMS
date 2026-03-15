import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Target, Users, BookOpen, Award } from 'lucide-react';
import { getCourses } from '../data/mockDb';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
     setFeatured(getCourses().slice(0, 3));
  }, []);
  return (
    <div style={{ padding: '64px 32px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="fade-in" style={{ marginBottom: '80px', marginTop: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '24px', lineHeight: 1.1 }}>
          Unlock Your Future with Next-Gen Learning
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          An intelligent learning management system designed to elevate your skills with immersive content, expert instructors, and a thriving community.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/login?mode=register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Start Learning Now
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            View Courses
          </Link>
        </div>
      </header>
      
      <div className="grid grid-cols-3 fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glass-panel" style={{ textAlign: 'left' }}>
          <Target size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Interactive Content</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Engage with high-quality video lectures, rich text documents, and interactive quizzes to solidify your understanding.
          </p>
        </div>
        
        <div className="glass-panel" style={{ textAlign: 'left' }}>
          <Award size={40} color="var(--accent)" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Track Progress</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitor your growth with our intuitive progress tracking and analytics dashboard.
          </p>
        </div>
        
        <div className="glass-panel" style={{ textAlign: 'left' }}>
          <Users size={40} color="var(--success)" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Expert Community</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Learn alongside peers and connect with instructors who are industry leaders in their respective fields.
          </p>
        </div>
      </div>
      
      <section style={{ marginTop: '100px', padding: '60px 0', borderTop: '1px solid var(--glass-border)' }}>
         <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Featured Recommended Courses</h2>
         <div className="grid grid-cols-3 text-left">
            {featured.map((course) => (
              <div key={course.id} className="glass-panel course-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => navigate(`/course/${course.id}/details`)}>
                <img 
                  src={course.thumbnail} 
                  alt="Course Thumbnail" 
                  className="course-image" 
                />
                {course.discount > 0 && (
                   <span className="badge badge-warning py-1 mb-2 inline-block" style={{ marginBottom: '12px' }}>{course.discount}% OFF</span>
                )}
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{course.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {course.description.length > 70 ? course.description.substring(0, 70) + '...' : course.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>${(course.price - course.price * (course.discount||0)/100).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <BookOpen size={16} /> {course.modules.length} Lessons
                  </div>
                </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Home;
