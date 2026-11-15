'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://societypro-backend-production-e249.up.railway.app';

export default function SuperAdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType');
      const token    = localStorage.getItem('token');
      if (token && userType === 'super_admin') {
        router.replace('/superadmin');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }
      if (data.userType !== 'super_admin') {
        setError('Access denied. This portal is for Super Admins only.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token',    data.token);
      localStorage.setItem('user',     JSON.stringify(data.user));
      localStorage.setItem('userType', 'super_admin');

      const maxAge = 8 * 60 * 60;
      document.cookie = `token=${data.token}; path=/; max-age=${maxAge}; SameSite=Strict`;
      document.cookie = `userType=super_admin; path=/; max-age=${maxAge}; SameSite=Strict`;

      router.push('/superadmin');
    } catch (err) {
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0D1F 0%, #1a1040 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
            borderRadius: '18px', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
          }}>🔐</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Super Admin</h1>
          <p style={{ color: '#8B7FB8', margin: 0, fontSize: '13px', letterSpacing: '0.05em' }}>SOCIETYPRO CONTROL PANEL</p>
        </div>

        <div style={{
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px', padding: '10px 14px', marginBottom: '20px',
          color: '#FCA5A5', fontSize: '12px', fontWeight: '500',
        }}>
          ⚠️ Restricted access — authorised personnel only
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '32px', backdropFilter: 'blur(10px)',
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#8B7FB8', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                ADMIN EMAIL
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="superadmin@societypro.com"
                style={{
                  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#8B7FB8', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#8B7FB8', fontSize: '15px',
                }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px', padding: '10px 14px', color: '#FCA5A5',
                fontSize: '13px', marginBottom: '16px',
              }}>❌ {error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #DB2777)',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(124,58,237,0.4)',
            }}>
              {loading ? '⏳ Verifying...' : '→ Access Control Panel'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#8B7FB8', fontSize: '13px', textDecoration: 'none' }}>← Back to Society Login</a>
        </div>
      </div>
    </div>
  );
}
