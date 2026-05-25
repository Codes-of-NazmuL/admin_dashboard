import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield } from 'lucide-react';
import { fetchAPI } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@campusconnect.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://127.0.0.1:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Verify Admin or other authorized roles
      const profileRes = await fetch('http://127.0.0.1:3000/api/users/me', {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      
      // Check if not JSON (e.g. 404 HTML)
      if (!profileRes.headers.get('content-type')?.includes('application/json')) {
         throw new Error(`Invalid response from server (Status: ${profileRes.status})`);
      }
      
      const profile = await profileRes.json();
      
      if (!['ADMIN', 'PRINCIPAL', 'EXAM_CONTROLLER'].includes(profile.role)) {
        throw new Error('Unauthorized. Staff access required.');
      }
      
      localStorage.setItem('admin_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: 'var(--bg-color)' }}>
      {/* Left side branding */}
      <div style={{ flex: 1, background: 'url(/images/Slider_one.jpg) center/cover', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)' }}></div>
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', height: '100%', color: 'white' }}>
          <img src="/images/tpi.png" alt="TPI Logo" style={{ width: '80px', height: '80px', marginBottom: '24px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.02em' }}>Tangail Polytechnic Institute</h1>
          <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '400px', lineHeight: '1.6' }}>
            Enterprise administration portal. Manage users, monitor system metrics, and control platform settings securely.
          </p>
        </div>
      </div>
      
      {/* Right side login form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '32px' }} className="animate-fade-in">
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter your credentials to access the admin portal.</p>
          
          {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '14px', borderLeft: '4px solid var(--danger-color)' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group with-icon">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail className="icon" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="input-field" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '36px' }} />
              </div>
            </div>
            <div className="input-group with-icon" style={{ marginBottom: '24px' }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock className="icon" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" className="input-field" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '36px' }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? <div className="loader"></div> : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
