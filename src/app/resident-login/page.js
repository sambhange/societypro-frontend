'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';

export default function ResidentLogin() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const DEMO_RESIDENTS = [
    { email:'ramesh@sunrise.in',  password:'flat101', name:'Ramesh Sharma',  flat:'A-101', wing:'A' },
    { email:'priya@sunrise.in',   password:'flat102', name:'Priya Mehta',    flat:'A-102', wing:'A' },
    { email:'anjali@sunrise.in',  password:'flat201', name:'Anjali Verma',   flat:'B-201', wing:'B' },
    { email:'suresh@sunrise.in',  password:'flat202', name:'Suresh Patel',   flat:'B-202', wing:'B' },
    { email:'neha@sunrise.in',    password:'flat301', name:'Neha Singh',     flat:'C-301', wing:'C' },
    { email:'vikram@sunrise.in',  password:'flat302', name:'Vikram Joshi',   flat:'C-302', wing:'C' },
    { email:'meena@sunrise.in',   password:'flat401', name:'Meena Iyer',     flat:'D-401', wing:'D' },
    { email:'arjun@sunrise.in',   password:'flat402', name:'Arjun Nair',     flat:'D-402', wing:'D' },
  ];

  const handleLogin = async () => {
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const resident = DEMO_RESIDENTS.find(
      r => r.email === form.email && r.password === form.password
    );
    if (resident) {
      localStorage.setItem('resident', JSON.stringify(resident));
      router.push('/resident');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F0FDF4 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, fontFamily:'DM Sans, sans-serif'
    }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:16, background:'var(--accent)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(37,99,235,0.3)' }}>
            <Building2 size={32} color="white"/>
          </div>
          <div style={{ fontWeight:800, fontSize:24, color:'#0F172A' }}>Resident Portal</div>
          <div style={{ fontSize:13, color:'#64748B', marginTop:4 }}>Sunrise Residency — Society Management</div>
        </div>

        {/* Login Card */}
        <div style={{ background:'white', borderRadius:20, padding:32,
          boxShadow:'0 4px 24px rgba(0,0,0,0.08)', border:'1px solid #E2E8F0' }}>

          <div style={{ fontWeight:700, fontSize:18, color:'#0F172A', marginBottom:6 }}>
            Welcome back! 👋
          </div>
          <div style={{ fontSize:13, color:'#64748B', marginBottom:24 }}>
            Login with your registered email to view your flat details
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, color:'#64748B', fontWeight:600,
              marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Email Address</label>
            <div style={{ position:'relative' }}>
              <Mail size={15} style={{ position:'absolute', left:13, top:'50%',
                transform:'translateY(-50%)', color:'#94A3B8' }}/>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width:'100%', padding:'10px 14px 10px 38px', border:'1.5px solid #E2E8F0',
                  borderRadius:8, fontSize:13.5, outline:'none', boxSizing:'border-box',
                  background:'#F8FAFC', fontFamily:'inherit', color:'#1E293B' }}
                onFocus={e => e.target.style.borderColor='#2563EB'}
                onBlur={e => e.target.style.borderColor='#E2E8F0'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, color:'#64748B', fontWeight:600,
              marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={15} style={{ position:'absolute', left:13, top:'50%',
                transform:'translateY(-50%)', color:'#94A3B8' }}/>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width:'100%', padding:'10px 40px 10px 38px', border:'1.5px solid #E2E8F0',
                  borderRadius:8, fontSize:13.5, outline:'none', boxSizing:'border-box',
                  background:'#F8FAFC', fontFamily:'inherit', color:'#1E293B' }}
                onFocus={e => e.target.style.borderColor='#2563EB'}
                onBlur={e => e.target.style.borderColor='#E2E8F0'}
              />
              <button onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'#94A3B8', padding:0 }}>
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)',
              borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#DC2626' }}>
              ❌ {error}
            </div>
          )}

          {/* Login button */}
          <button onClick={handleLogin} disabled={loading || !form.email || !form.password}
            style={{ width:'100%', padding:'12px 0', background:'#2563EB', color:'white',
              border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:14,
              opacity: loading || !form.email || !form.password ? 0.7 : 1, fontFamily:'inherit' }}>
            {loading ? '⏳ Signing in...' : '→ Login to My Account'}
          </button>

          {/* Demo credentials */}
          <div style={{ marginTop:16, padding:'12px 14px', background:'rgba(37,99,235,0.06)',
            border:'1px solid rgba(37,99,235,0.15)', borderRadius:10 }}>
            <div style={{ fontSize:11, color:'#2563EB', fontWeight:700, marginBottom:6 }}>
              🔑 DEMO CREDENTIALS
            </div>
            <div style={{ fontSize:12, color:'#64748B' }}>
              Email: <b style={{ color:'#1E293B' }}>ramesh@sunrise.in</b><br/>
              Password: <b style={{ color:'#1E293B' }}>flat101</b>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign:'center', marginTop:20 }}>
          <a href="/" style={{ fontSize:13, color:'#64748B', textDecoration:'none' }}>
            ← Back to Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}
