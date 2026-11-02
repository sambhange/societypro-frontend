'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../lib/api';
 
export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
 
  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/dashboard');
    }
  }, []);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      const data = await authAPI.login(email, password);
 
      // Save to localStorage
      localStorage.setItem('token',    data.token);
      localStorage.setItem('user',     JSON.stringify(data.user));
      localStorage.setItem('userType', data.userType || 'admin');
 
      // Save to cookie for middleware
      const maxAge = 7 * 24 * 60 * 60;
      document.cookie = `token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `userType=${data.userType || 'admin'}; path=/; max-age=${maxAge}; SameSite=Lax`;
 
      router.push('/dashboard');
 
    } catch (err) {
      setError(err.message || 'Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
 
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            borderRadius: '20px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', fontSize: '32px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.3)'
          }}>🏢</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1E1B4B', margin: '0 0 4px' }}>
            SocietyPro
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '14px' }}>Society Management Portal</p>
        </div>
 
        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: '20px', padding: '36px',
          boxShadow: '0 4px 24px rgba(79,70,229,0.10)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E1B4B', margin: '0 0 4px' }}>
            Welcome back! 👋
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '28px' }}>
            Login with your society admin account
          </p>
 
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#374151', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="admin@yoursociety.com"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #E5E7EB', borderRadius: '10px',
                  fontSize: '15px', boxSizing: 'border-box', outline: 'none', color: '#1F2937'
                }}
              />
            </div>
 
            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#374151', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px',
                    border: '1.5px solid #E5E7EB', borderRadius: '10px',
                    fontSize: '15px', boxSizing: 'border-box', outline: 'none', color: '#1F2937'
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '16px'
                }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
 
            {/* Error */}
            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: '10px', padding: '12px 16px',
                color: '#DC2626', fontSize: '13px', marginBottom: '16px'
              }}>
                ❌ {error}
              </div>
            )}
 
            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#A5B4FC' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? '⏳ Logging in...' : '→ Login to Dashboard'}
            </button>
          </form>
 
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <a href="/register" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
              Register New Society →
            </a>
            <a href="/resident-login" style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none' }}>
              Resident Login
            </a>
          </div>
        </div>
 
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '24px' }}>
          Powered by SocietyPro · societyproapp.com
        </p>
      </div>
    </div>
  );
}
 
