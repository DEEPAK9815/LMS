import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { LogIn, UserPlus } from 'lucide-react';
import { hashPassword, generateSecureToken } from '../modules/User/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const isRegisteringInitial = queryParams.get('mode') === 'register';
  
  const [isRegister, setIsRegister] = useState(isRegisteringInitial);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    setIsRegister(queryParams.get('mode') === 'register');
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* --- Non-Functional Requirement: Security ---*/
    // Simulate secure transmission using Mock Data Encryption
    const hashedPassword = hashPassword(formData.password);
    console.log("Transmitting securely via encrypted password hash:", hashedPassword);

    const userRole = formData.email.includes('admin') ? 'admin' : formData.role;
    
    const mockUser = {
      id: Math.floor(Math.random() * 1000),
      name: isRegister ? formData.name : formData.email.split('@')[0],
      email: formData.email,
      role: userRole
    };
    
    // Simulate issuing JWT for authorized Session
    const mockJWT = generateSecureToken(mockUser);
    console.log("Session securely created with token (RBAC integrated):", mockJWT);
    
    login(mockUser);
    
    if (userRole === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '32px' }}>
      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px 32px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px' }}>
          {isRegister ? 'Join LuminLMS' : 'Welcome Back'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {isRegister ? 'Create an account to start learning' : 'Log in to continue your journey'}
        </p>
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="form-input" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="form-input" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="form-input" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          {isRegister && (
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            {!isRegister && <a href="#" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Forgot password?</a>}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}>
            {isRegister ? <><UserPlus size={20}/> Sign Up</> : <><LogIn size={20}/> Sign In</>}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}
            {' '}
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)} 
              style={{ color: 'var(--primary)', fontWeight: 600, background: 'none' }}
            >
              {isRegister ? 'Log in' : 'Sign up'}
            </button>
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
            *Hint: Use "admin" in email to login as Admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
