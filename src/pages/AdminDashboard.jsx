import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { getCourses, saveCourses } from '../data/mockDb';
import { Users, BookOpen, BarChart3, ShieldCheck, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);

  // States for Adding/Editing Course
  const [editingCourse, setEditingCourse] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [courseForm, setCourseForm] = useState({
      id: '', title: '', description: '', instructor: user.name, price: 0, discount: 0, thumbnail: '', modules: []
  });

  useEffect(() => {
     setCourses(getCourses());
  }, []);

  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'var(--primary)' },
    { label: 'Active Courses', value: courses.length.toString(), icon: BookOpen, color: 'var(--accent)' },
    { label: 'Completion Rate', value: '68%', icon: BarChart3, color: 'var(--success)' },
    { label: 'Pending Instructors', value: '5', icon: ShieldCheck, color: 'var(--warning)' }
  ];

  const handleDeleteCourse = (id) => {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      saveCourses(updated);
  };

  const handleEditClick = (c) => {
      setCourseForm({ ...c });
      setEditingCourse(c.id);
      setIsAdding(true);
  };

  const handleSaveCourse = (e) => {
      e.preventDefault();
      let updated = [...courses];
      if (editingCourse) {
          updated = updated.map(c => c.id === editingCourse ? courseForm : c);
      } else {
          updated.push({ ...courseForm, id: 'c' + Date.now().toString() });
      }
      setCourses(updated);
      saveCourses(updated);
      setIsAdding(false);
      setEditingCourse(null);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}. Manage users, courses, and platform analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
             className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} 
             onClick={() => setActiveTab('overview')}
          >
             Overview
          </button>
          <button 
             className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`} 
             onClick={() => setActiveTab('courses')}
          >
             Manage Courses
          </button>
          <button 
             className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`} 
             onClick={() => setActiveTab('users')}
          >
             Manage Users
          </button>
          <button 
             className={`btn ${activeTab === 'instructors' ? 'btn-primary' : 'btn-secondary'}`} 
             onClick={() => setActiveTab('instructors')}
          >
             Pending <span className="badge badge-warning" style={{ marginLeft: '8px' }}>5</span>
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="fade-in">
          <div className="grid grid-cols-4 admin-stats" style={{ marginBottom: '32px' }}>
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
              <div key={idx} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={32} color={stat.color} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', marginBottom: '4px' }}>{stat.value}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</p>
                </div>
              </div>
            )})}
          </div>

          <div className="grid grid-cols-2">
             <div className="glass-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Course Popularity</h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', height: '250px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                   [Student Statistics Chart Placeholder]
                </div>
             </div>
             <div className="glass-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Platform Revenue</h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', height: '250px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                   [Revenue Chart Placeholder]
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="glass-panel fade-in">
           {isAdding ? (
              <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                  <form onSubmit={handleSaveCourse} className="grid grid-cols-2 gap-4">
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Course Title</label>
                          <input type="text" className="form-input" required value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Description</label>
                          <textarea className="form-input" required rows="3" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})}></textarea>
                      </div>
                      <div className="form-group">
                          <label className="form-label">Price ($)</label>
                          <input type="number" step="0.01" className="form-input" required value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: parseFloat(e.target.value)})} />
                      </div>
                      <div className="form-group">
                          <label className="form-label">Discount (%)</label>
                          <input type="number" min="0" max="100" className="form-input" required value={courseForm.discount} onChange={e => setCourseForm({...courseForm, discount: parseInt(e.target.value)})} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Thumbnail URL (Or simulate Upload)</label>
                          <input type="url" className="form-input" required placeholder="https://..." value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Modules Config JSON (Mock upload metadata)</label>
                          <textarea className="form-input" rows="4" placeholder='[{"type":"video","title":"L1","duration":"10:00"}]' 
                             value={JSON.stringify(courseForm.modules)} 
                             onChange={e => {
                                 try { setCourseForm({...courseForm, modules: JSON.parse(e.target.value)}) } catch(e){}
                             }}
                          ></textarea>
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '16px' }}>
                          <button type="submit" className="btn btn-primary">Save Course</button>
                          <button type="button" className="btn btn-secondary" onClick={() => { setIsAdding(false); setEditingCourse(null); }}>Cancel</button>
                      </div>
                  </form>
              </div>
           ) : (
              <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '1.5rem' }}>Course Catalog Management</h3>
                      <button className="btn btn-primary" onClick={() => {
                          setCourseForm({ id: '', title: '', description: '', instructor: user.name, price: 0, discount: 0, thumbnail: '', modules: [] });
                          setIsAdding(true);
                      }}>+ Add Course</button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead>
                       <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '16px 8px' }}>Title</th>
                          <th style={{ padding: '16px 8px' }}>Instructor</th>
                          <th style={{ padding: '16px 8px' }}>Price</th>
                          <th style={{ padding: '16px 8px' }}>Discount</th>
                          <th style={{ padding: '16px 8px', textAlign: 'right' }}>Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                        {courses.map((c) => (
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                             <td style={{ padding: '16px 8px', fontWeight: 500 }}>{c.title}</td>
                             <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{c.instructor}</td>
                             <td style={{ padding: '16px 8px' }}>${c.price.toFixed(2)}</td>
                             <td style={{ padding: '16px 8px' }}>{c.discount}%</td>
                             <td style={{ padding: '16px 8px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button className="btn btn-secondary" style={{ padding: '8px' }} onClick={() => handleEditClick(c)}><Edit size={16} /></button>
                                <button className="btn btn-danger" style={{ padding: '8px' }} onClick={() => handleDeleteCourse(c.id)}><Trash2 size={16} /></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
              </div>
           )}
        </div>
      )}

      {/* User and Instructor tabs remain visual mock for UI completeness */}
      {/* ... Users ... */}
    </div>
  );
};

export default AdminDashboard;
