import React, { useState, createContext, useContext, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard } from 'lucide-react';

/* --- Non-Functional Requirement: Performance Optimization --- */
/* Lazy loading modules to ensure "Page loading time < 3 seconds" */
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CourseView = lazy(() => import('./pages/CourseView'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null); // null means not logged in
  // user object shape: { id: 1, name: 'John Doe', role: 'student' | 'instructor' | 'admin' }

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="app-container">
          <Header />
          {/* Suspense serves fallback UI while chunks load dynamically */}
          <Suspense fallback={<div className="glass-panel" style={{ margin: 'auto', padding: '40px' }}>Loading Application Modules...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* --- Non-Functional Requirement: Security & RBAC --- */}
              {/* Role-Based Access Control enforcing specific routes based on user role */}
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/course/:courseId" 
                element={
                  <ProtectedRoute>
                    <CourseView />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-nav">
      <Link to="/" className="flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={28} color="var(--primary)" />
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>LuminLMS</h2>
      </Link>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name}</span>
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-secondary">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <button onClick={logout} className="btn btn-danger">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/login?mode=register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default App;
