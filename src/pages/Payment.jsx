import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourses, enrollUser } from '../data/mockDb';
import { useAuth } from '../App';
import { CreditCard, Smartphone, Building, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const allCourses = getCourses();
    setCourse(allCourses.find(c => c.id === courseId));
    if (!user) navigate('/login');
  }, [courseId, user, navigate]);

  if (!course) return null;

  const finalPrice = course.price - (course.price * (course.discount || 0)/100);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing time
    setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        enrollUser(user.id, course.id); // Unlock course videos and materials securely
        
        // Redirect to course after showing success
        setTimeout(() => {
            navigate(`/course/${course.id}`);
        }, 2000);
    }, 1500);
  };

  if (isSuccess) {
      return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
              <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Payment Successful!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>You are now enrolled in <strong>{course.title}</strong></p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '24px' }}>Redirecting to course content...</p>
          </div>
      );
  }

  return (
    <div className="fade-in" style={{ padding: '40px 32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link to={`/course/${course.id}/details`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Course
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 350px', alignItems: 'start', gap: '40px' }}>
        {/* Left Side: Payment Form */}
        <div className="glass-panel">
            <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Checkout Securely</h2>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600 }}>1. Select Payment Method</p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
               <button 
                  className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '16px' }}
               >
                   <CreditCard size={20} /> Card
               </button>
               <button 
                  className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => setPaymentMethod('upi')} style={{ flex: 1, padding: '16px' }}
               >
                   <Smartphone size={20} /> UPI
               </button>
               <button 
                  className={`btn ${paymentMethod === 'netbanking' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => setPaymentMethod('netbanking')} style={{ flex: 1, padding: '16px' }}
               >
                   <Building size={20} /> Net Banking
               </button>
            </div>

            <form onSubmit={handlePayment}>
                {paymentMethod === 'card' && (
                    <div className="fade-in">
                       <div className="form-group">
                           <label className="form-label">Card Number</label>
                           <input type="text" className="form-input" placeholder="0000 0000 0000 0000" required />
                       </div>
                       <div style={{ display: 'flex', gap: '16px' }}>
                           <div className="form-group" style={{ flex: 1 }}>
                               <label className="form-label">Expiry Date</label>
                               <input type="text" className="form-input" placeholder="MM/YY" required />
                           </div>
                           <div className="form-group" style={{ flex: 1 }}>
                               <label className="form-label">CVV</label>
                               <input type="password" className="form-input" placeholder="123" required />
                           </div>
                       </div>
                       <div className="form-group">
                           <label className="form-label">Cardholder Name</label>
                           <input type="text" className="form-input" placeholder="John Doe" required />
                       </div>
                    </div>
                )}
                {paymentMethod === 'upi' && (
                    <div className="fade-in">
                       <div className="form-group">
                           <label className="form-label">UPI ID</label>
                           <input type="text" className="form-input" placeholder="username@bank" required />
                       </div>
                    </div>
                )}
                {paymentMethod === 'netbanking' && (
                    <div className="fade-in">
                       <div className="form-group">
                           <label className="form-label">Select Bank</label>
                           <select className="form-input" required>
                               <option value="">Choose Bank</option>
                               <option value="sbi">State Bank of India</option>
                               <option value="hdfc">HDFC Bank</option>
                               <option value="icici">ICICI Bank</option>
                           </select>
                       </div>
                    </div>
                )}

                <button 
                   type="submit" 
                   className="btn btn-primary" 
                   style={{ width: '100%', padding: '16px', fontSize: '1.2rem', marginTop: '24px' }}
                   disabled={isProcessing}
                >
                   {isProcessing ? 'Processing Securely...' : `Pay $${finalPrice.toFixed(2)}`}
                </button>
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> Payments are encrypted and secure
                </p>
            </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="glass-panel" style={{ position: 'sticky', top: '90px' }}>
           <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
               Order Summary
           </h3>
           <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
               <img src={course.thumbnail} style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
               <div>
                   <h4 style={{ fontSize: '1rem', lineHeight: 1.2 }}>{course.title}</h4>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>By {course.instructor}</p>
               </div>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
               <span>Original Price:</span>
               <span>${course.price.toFixed(2)}</span>
           </div>
           {course.discount > 0 && (
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--warning)' }}>
                   <span>Discount ({course.discount}%):</span>
                   <span>-${(course.price * course.discount/100).toFixed(2)}</span>
               </div>
           )}
           <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px', fontSize: '1.2rem', fontWeight: 700 }}>
               <span>Total:</span>
               <span>${finalPrice.toFixed(2)}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
