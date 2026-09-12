'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://societypro-backend-production-e249.up.railway.app';

export default function Login() {
  const router = useRouter();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('token',   data.token);
        localStorage.setItem('user',    JSON.stringify(data.user    || {}));
        localStorage.setItem('society', JSON.stringify(data.society || {}));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch(err) {
      setError('Cannot connect to server. Please check your internet connection.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#EFF6FF 0%,#F8FAFC 50%,#F0FDF4 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, fontFamily:'DM Sans,sans-serif'
    }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        {/* Logo — SocietyPro branding, NOT society name */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:68, height:68, borderRadius:18,
            background:'linear-gradient(135deg,#2563EB,#7C3AED)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(37,99,235,0.35)'
          }}>
            <Building2 size={34} color="white"/>
          </div>
          <div style={{ fontWeight:800, fontSize:28, color:'#0F172A', letterSpacing:'-0.5px' }}>
            SocietyPro
          </div>
          <div style={{ fontSize:13, color:'#64748B', marginTop:4 }}>
            Society Management Portal
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background:'white', borderRadius:20, padding:32,
          boxShadow:'0 4px 24px rgba(0,0,0,0.08)', border:'1px solid #E2E8F0'
        }}>
          <div style={{ fontWeight:700, fontSize:18, color:'#0F172A', marginBottom:6 }}>
            Welcome back! 👋
          </div>
          <div style={{ fontSize:13, color:'#64748B', marginBottom:24 }}>
            Login with your society admin account
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, color:'#64748B', fontWeight:600,
              marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>
              Email Address
            </label>
            <div style={{ position:'relative' }}>
              <Mail size={15} style={{ position:'absolute', left:13, top:'50%',
                transform:'translateY(-50%)', color:'#94A3B8' }}/>
              <input type="email" placeholder="admin@yoursociety.com"
                value={form.email}
                onChange={e => setForm({...form, email:e.target.value})}
                onKeyDown={e => e.key==='Enter' && handleLogin()}
                style={{ width:'100%', padding:'11px 14px 11px 38px',
                  border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13.5,
                  outline:'none', boxSizing:'border-box', background:'#F8FAFC',
                  fontFamily:'inherit', color:'#1E293B' }}
                onFocus={e=>e.target.style.borderColor='#2563EB'}
                onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, color:'#64748B', fontWeight:600,
              marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>
              Password
            </label>
            <div style={{ position:'relative' }}>
              <Lock size={15} style={{ position:'absolute', left:13, top:'50%',
                transform:'translateY(-50%)', color:'#94A3B8' }}/>
              <input type={showPw?'text':'password'} placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({...form, password:e.target.value})}
                onKeyDown={e => e.key==='Enter' && handleLogin()}
                style={{ width:'100%', padding:'11px 40px 11px 38px',
                  border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13.5,
                  outline:'none', boxSizing:'border-box', background:'#F8FAFC',
                  fontFamily:'inherit', color:'#1E293B' }}
                onFocus={e=>e.target.style.borderColor='#2563EB'}
                onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
              <button onClick={()=>setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%',
                  transform:'translateY(-50%)', background:'none',
                  border:'none', cursor:'pointer', color:'#94A3B8', padding:0 }}>
                {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)',
              borderRadius:8, padding:'10px 14px', marginBottom:14,
              fontSize:13, color:'#DC2626', display:'flex', alignItems:'flex-start', gap:8 }}>
              ❌ {error}
            </div>
          )}

          {/* Login Button */}
          <button onClick={handleLogin}
            disabled={loading||!form.email||!form.password}
            style={{ width:'100%', padding:'12px 0',
              background: loading||!form.email||!form.password?'#94A3B8':'#2563EB',
              color:'white', border:'none', borderRadius:10, fontWeight:700,
              cursor: loading||!form.email||!form.password?'not-allowed':'pointer',
              fontSize:14, fontFamily:'inherit', transition:'background 0.15s' }}>
            {loading?'⏳ Signing in...':'→ Login to Dashboard'}
          </button>

          {/* Links */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:16, fontSize:12.5 }}>
            <a href="/register" style={{ color:'#2563EB', fontWeight:600, textDecoration:'none' }}>
              Register New Society →
            </a>
            <a href="/resident-login" style={{ color:'#64748B', textDecoration:'none' }}>
              Resident Login
            </a>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:16, fontSize:12, color:'#94A3B8' }}>
          Powered by SocietyPro · societyproapp.com
        </div>
      </div>
    </div>
  );
}
