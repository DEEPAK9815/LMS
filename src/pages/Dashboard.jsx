import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { getCourses, getEnrollments } from '../data/mockDb';
import { BookOpen, UserCircle, Settings, PlusCircle, Video, Play, FileText, Compass } from 'lucide-react';

const StudentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('enrolled');

  useEffect(() => {
     const allCourses = getCourses();
     const myEnrollments = getEnrollments().filter(e => e.userId === user.id);
     
     const mappedCourses = myEnrollments.map(en => {
        const course = allCourses.find(c => c.id === en.courseId);
        return { ...course, progress: en.progress, completedCount: en.completedLessons.length };
     });
     setMyCourses(mappedCourses);
  }, [user]);

  const displayedCourses = activeTab === 'purchased' ? myCourses.filter(c => c.price > 0) : myCourses;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Learning Dashboard</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Pick up where you left off</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
              <button className={`btn ${activeTab === 'enrolled' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('enrolled')}>All Enrolled</button>
              <button className={`btn ${activeTab === 'purchased' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('purchased')}>Purchased Courses</button>
          </div>
      </div>

      {displayedCourses.length > 0 ? (
        <div className="grid grid-cols-3">
          {displayedCourses.map((course) => (
            <div key={course.id} className="glass-panel course-card" style={{ padding: '24px' }}>
               <img 
                 src={course.thumbnail} 
                 alt="Course thumbnail"
                 className="course-image"
               />
               <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                   {course.price === 0 ? (
                       <span className="badge badge-success py-1 inline-block">Free</span>
                   ) : (
                       <span className="badge badge-primary py-1 inline-block">Purchased</span>
                   )}
                   <span className="badge badge-secondary py-1 inline-block" style={{ background: 'rgba(255,255,255,0.1)' }}>{course.category}</span>
               </div>
               <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{course.title}</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                 {course.completedCount === course.modules?.length 
                    ? 'Course Completed!' 
                    : `Completed ${course.completedCount} of ${course.modules?.length} Lessons`}
               </p>
               <div style={{ marginBottom: '16px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                   <span>Progress</span>
                   <span>{course.progress}%</span>
                 </div>
                 <div className="progress-container">
                   <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
                 </div>
               </div>
               <button 
                 className="btn btn-primary" 
                 style={{ width: '100%' }}
                 onClick={() => navigate(`/course/${course.id}`)}
               >
                 <Play size={18} /> Continue Learning
               </button>
            </div>
          ))}
        </div>
      ) : (
          <div className="glass-panel text-center" style={{ padding: '48px', textAlign: 'center' }}>
              <Compass size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                  {activeTab === 'purchased' ? 'No purchased courses found' : 'No courses enrolled yet'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Discover new skills and start learning today.</p>
              <button className="btn btn-primary" onClick={() => navigate('/courses')}>Browse Catalog</button>
          </div>
      )}
    </div>
  );
};

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Instructor Hub</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your courses and content</p>
        </div>
        <button className="btn btn-primary">
          <PlusCircle size={20} /> Create New Course
        </button>
      </div>

      <div className="grid grid-cols-2">
        {[1, 2, 3].map((course) => (
          <div key={course} className="glass-panel flex-row" style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
            <img 
               src={`https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=200&h=200&random=${course}`} 
               alt="Course thumbnail"
               style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
             />
             <div style={{ flex: 1 }}>
               <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Advanced JavaScript Concepts</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                 12 Modules • 45 Students Enrolled
               </p>
               <div style={{ display: 'flex', gap: '12px' }}>
                 <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Edit Course</button>
                 <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Delete</button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { user } = useAuth();
  return (
    <div className="fade-in glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Profile Settings</h2>
      <div className="form-group">
        <label className="form-label">Name</label>
        <input type="text" className="form-input" defaultValue={user.name} />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" className="form-input" defaultValue={user.email} />
      </div>
      <div className="form-group">
         <label className="form-label">Role</label>
         <input type="text" className="form-input" value={user.role} readOnly style={{ opacity: 0.7 }} />
      </div>
      <button className="btn btn-primary" style={{ marginTop: '16px' }}>Save Changes</button>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 24px 24px 24px', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{user.name.charAt(0)}</span>
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>{user.name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user.role}</p>
            </div>
          </div>
        </div>

        <nav>
           <Link to="/dashboard" className={`sidebar-link ${currentPath === 'dashboard' ? 'active' : ''}`}>
             <BookOpen size={20} /> My Learning
           </Link>
           {user.role === 'instructor' && (
             <Link to="/dashboard/teaching" className={`sidebar-link ${currentPath === 'teaching' ? 'active' : ''}`}>
               <Video size={20} /> Instructor Hub
             </Link>
           )}
           <Link to="/dashboard/profile" className={`sidebar-link ${currentPath === 'profile' ? 'active' : ''}`}>
             <UserCircle size={20} /> Profile
           </Link>
           <Link to="/dashboard/settings" className={`sidebar-link ${currentPath === 'settings' ? 'active' : ''}`}>
             <Settings size={20} /> Settings
           </Link>
        </nav>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={user.role === 'instructor' ? <InstructorDashboard /> : <StudentDashboard user={user} />} />
          <Route path="/teaching" element={<InstructorDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<div className="glass-panel"><h3>Settings Panel</h3><p className="mt-4" style={{marginTop: '16px'}}>Manage notifications, privacy, etc.</p></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
