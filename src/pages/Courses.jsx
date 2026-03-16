import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../data/mockDb';
import { Search, BookOpen, User, Tag, Clock } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Java Programming',
  'Python Programming',
  'Data Structures & Algorithms',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Database Systems',
  'Cybersecurity',
  'Software Testing'
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Course Catalog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover top courses from industry experts and take your skills to the next level.
        </p>
      </div>

      {/* Discovery / Search Bar */}
      <div className="fade-in form-group" style={{ maxWidth: '600px', margin: '0 auto 24px auto', position: 'relative' }}>
         <Search size={20} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
         <input 
           type="text" 
           className="form-input" 
           style={{ paddingLeft: '48px', fontSize: '1.1rem' }} 
           placeholder="Search for courses, skills, or instructors..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* Category Filters */}
      <div className="fade-in" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
         {CATEGORIES.map(cat => (
             <button 
                 key={cat} 
                 className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                 style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem' }}
                 onClick={() => setSelectedCategory(cat)}
             >
                 {cat}
             </button>
         ))}
      </div>

      <div className="grid grid-cols-3 fade-in">
        {filteredCourses.length > 0 ? filteredCourses.map((course) => (
          <div key={course.id} className="glass-panel course-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="course-image" 
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary py-1 inline-block">{course.category}</span>
                {course.price === 0 ? (
                    <span className="badge badge-success py-1 inline-block">Free Course</span>
                ) : course.discount > 0 && (
                    <span className="badge badge-warning py-1 inline-block">{course.discount}% OFF</span>
                )}
            </div>
            
            <h4 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{course.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>
              {course.description.length > 80 ? course.description.substring(0, 80) + '...' : course.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <User size={14} /> {course.instructor}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Clock size={14} /> {course.duration}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
              <div>
                {course.price === 0 ? (
                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--success)' }}>Free</span>
                ) : (
                    <>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                            ${(course.price - (course.price * (course.discount || 0)/100)).toFixed(2)}
                        </span>
                        {course.discount > 0 && (
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '8px' }}>
                                ${course.price.toFixed(2)}
                            </span>
                        )}
                    </>
                )}
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate(`/course/${course.id}/details`)}
              >
                Enroll
              </button>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              <h3>No courses found matching "{searchTerm}"</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
