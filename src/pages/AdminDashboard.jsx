import React, { useState } from 'react';
import { useAuth } from '../App';
import { Users, BookOpen, BarChart3, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'var(--primary)' },
    { label: 'Active Courses', value: '42', icon: BookOpen, color: 'var(--accent)' },
    { label: 'Completion Rate', value: '68%', icon: BarChart3, color: 'var(--success)' },
    { label: 'Pending Instructors', value: '5', icon: ShieldCheck, color: 'var(--warning)' }
  ];

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
             className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`} 
             onClick={() => setActiveTab('users')}
          >
             Manage Users
          </button>
          <button 
             className={`btn ${activeTab === 'instructors' ? 'btn-primary' : 'btn-secondary'}`} 
             onClick={() => setActiveTab('instructors')}
          >
             Pending Approvals <span className="badge badge-warning" style={{ marginLeft: '8px' }}>5</span>
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="fade-in">
          <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
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
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Recent Course Activity</h3>
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

      {activeTab === 'users' && (
        <div className="glass-panel fade-in">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>User Management</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead>
               <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px 8px' }}>Name</th>
                  <th style={{ padding: '16px 8px' }}>Email</th>
                  <th style={{ padding: '16px 8px' }}>Role</th>
                  <th style={{ padding: '16px 8px' }}>Status</th>
                  <th style={{ padding: '16px 8px', textAlign: 'right' }}>Actions</th>
               </tr>
             </thead>
             <tbody>
                {[
                  { name: 'Sarah Connor', email: 'sarah@example.com', role: 'Student', status: 'Active' },
                  { name: 'John Smith', email: 'john@example.com', role: 'Instructor', status: 'Active' },
                  { name: 'Alice Walker', email: 'alice@example.com', role: 'Student', status: 'Suspended' }
                ].map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <td style={{ padding: '16px 8px', fontWeight: 500 }}>{u.name}</td>
                     <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{u.email}</td>
                     <td style={{ padding: '16px 8px' }}>
                        <span className={`badge ${u.role === 'Instructor' ? 'badge-primary' : 'badge-warning'}`}>{u.role}</span>
                     </td>
                     <td style={{ padding: '16px 8px' }}>
                        <span style={{ color: u.status === 'Active' ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                           {u.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />} {u.status}
                        </span>
                     </td>
                     <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Edit</button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      )}

      {activeTab === 'instructors' && (
        <div className="glass-panel fade-in">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Instructor Approvals</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Review applications for instructor accounts to maintain platform quality.</p>
          
          <div className="grid grid-cols-2">
             {[1, 2].map((app) => (
                <div key={app} style={{ padding: '24px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                          TJ
                        </div>
                        <div>
                           <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Tom Johnson</h4>
                           <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>tom.j@example.com • Applied 2 days ago</p>
                        </div>
                      </div>
                   </div>
                   <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                     "I have 10 years of experience in Data Science and machine learning. I want to publish a comprehensive course series on Python for AI."
                   </p>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }}>Approve Application</button>
                      <button className="btn btn-danger" style={{ flex: 1 }}>Reject</button>
                   </div>
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
