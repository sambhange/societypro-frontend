'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Eye, EyeOff, Building2, Users, MapPin, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

const STEPS = ['Society Details', 'Admin Setup', 'Choose Plan', 'Confirm'];

export default function Register() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan  = searchParams.get('plan') || 'standard';

  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm]     = useState({
    name: '', address: '', city: '', state: 'Maharashtra', pincode: '', total_flats: 50, wings: 'A,B,C',
    secretary_name: '', secretary_email: '', secretary_phone: '', password: '', confirm_password: '',
    plan: defaultPlan, billing_cycle: 'monthly',
  });

  const PLANS = [
    { slug:'starter',  name:'Starter',  price:25, color:'#2563EB', desc:'Up to 50 flats' },
    { slug:'standard', name:'Standard', price:40, color:'#7C3AED', desc:'Up to 200 flats', popular:true },
    { slug:'premium',  name:'Premium',  price:60, color:'#D97706', desc:'Unlimited flats' },
  ];

  const monthly = PLANS.find(p=>p.slug===form.plan)?.price * form.total_flats;
  const total   = form.billing_cycle === 'yearly' ? monthly * 10 : monthly;

  const nextStep = () => {
    setError('');
    if (step === 0 && (!form.name || !form.city || !form.total_flats)) { setError('Please fill all required fields.'); return; }
    if (step === 1 && (!form.secretary_name || !form.secretary_email || !form.password)) { setError('Please fill all required fields.'); return; }
    if (step === 1 && form.password !== form.confirm_password) { setError('Passwords do not match.'); return; }
    if (step === 1 && form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setStep(step + 1);
  };

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/saas/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, wings: form.wings.split(',').map(w=>w.trim()) }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); setLoading(false); return; }
      localStorage.setItem('token',   data.token);
      localStorage.setItem('society', JSON.stringify(data.society));
      router.push('/onboarding');
    } catch (err) {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  const F = ({ label, icon, children, required }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:12, color:'#64748B', fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>
        {label} {required && <span style={{ color:'#DC2626' }}>*</span>}
      </label>
      <div style={{ position:'relative' }}>
        {icon && <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }}>{icon}</span>}
        {children}
      </div>
    </div>
  );

  const inp = (key, props={}) => (
    <input {...props} value={form[key]} onChange={e=>setForm({...form,[key]:props.type==='number'?+e.target.value:e.target.value})}
      style={{ width:'100%', background:'#F8FAFC', border:'1.5px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:13.5, padding:'9px 14px', paddingLeft:props.pl||14, outline:'none', boxSizing:'border-box', fontFamily:'inherit', ...props.style }}
      onFocus={e=>e.target.style.borderColor='#2563EB'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}
    />
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:580 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#2563EB', marginBottom:4 }}>🏢 SocietyPro</div>
          <div style={{ fontSize:13, color:'#64748B' }}>Start your 30-day free trial — no credit card needed</div>
        </div>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:0, marginBottom:28 }}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:i<=step?'#2563EB':'#E2E8F0', color:i<=step?'#fff':'#94A3B8', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 6px', fontSize:13, fontWeight:700, transition:'all 0.2s' }}>
                {i<step?<CheckCircle size={16}/>:i+1}
              </div>
              <div style={{ fontSize:11, color:i===step?'#2563EB':i<step?'#16A34A':'#94A3B8', fontWeight:i===step?700:400 }}>{s}</div>
              {i<STEPS.length-1&&<div style={{ position:'absolute' }}/>}
            </div>
          ))}
        </div>

        <div style={{ background:'#fff', borderRadius:16, padding:32, boxShadow:'0 4px 20px rgba(0,0,0,0.08)', border:'1px solid #E2E8F0' }}>

          {/* Step 0 — Society Details */}
          {step===0 && (
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:'#0F172A', marginBottom:20 }}>Tell us about your society</div>
              <F label="Society / Building Name" icon={<Building2 size={15}/>} required>
                {inp('name', { placeholder:'e.g. Sunrise Residency', pl:'38px' })}
              </F>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <F label="City" icon={<MapPin size={15}/>} required>
                  {inp('city', { placeholder:'Mumbai', pl:'38px' })}
                </F>
                <F label="State" required>
                  {inp('state', { placeholder:'Maharashtra' })}
                </F>
                <F label="Total Flats" icon={<Users size={15}/>} required>
                  {inp('total_flats', { type:'number', placeholder:'50', pl:'38px' })}
                </F>
                <F label="Pincode">
                  {inp('pincode', { placeholder:'400001' })}
                </F>
              </div>
              <F label="Wings / Blocks (comma separated)">
                {inp('wings', { placeholder:'A, B, C, D' })}
              </F>
              <F label="Full Address">
                {inp('address', { placeholder:'Street, Landmark...' })}
              </F>
            </div>
          )}

          {/* Step 1 — Admin Setup */}
          {step===1 && (
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:'#0F172A', marginBottom:20 }}>Create your admin account</div>
              <F label="Secretary / Admin Name" required>
                {inp('secretary_name', { placeholder:'Your full name' })}
              </F>
              <F label="Email Address" icon={<Mail size={15}/>} required>
                {inp('secretary_email', { type:'email', placeholder:'secretary@yoursociety.in', pl:'38px' })}
              </F>
              <F label="Phone Number" icon={<Phone size={15}/>}>
                {inp('secretary_phone', { placeholder:'9820012345', pl:'38px' })}
              </F>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <F label="Password" icon={<Lock size={15}/>} required>
                  <div style={{ position:'relative' }}>
                    {inp('password', { type:showPw?'text':'password', placeholder:'Min. 8 characters', pl:'38px' })}
                    <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', padding:0 }}>
                      {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                    </button>
                  </div>
                </F>
                <F label="Confirm Password" required>
                  {inp('confirm_password', { type:'password', placeholder:'Re-enter password' })}
                </F>
              </div>
            </div>
          )}

          {/* Step 2 — Choose Plan */}
          {step===2 && (
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:'#0F172A', marginBottom:6 }}>Choose your plan</div>
              <div style={{ fontSize:13, color:'#64748B', marginBottom:20 }}>You can change or upgrade anytime. 30-day free trial on all plans.</div>

              <div style={{ display:'flex', background:'#F1F5F9', borderRadius:99, padding:3, marginBottom:20 }}>
                {['monthly','yearly'].map(c=>(
                  <button key={c} onClick={()=>setForm({...form,billing_cycle:c})}
                    style={{ flex:1, padding:'7px 0', borderRadius:99, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:form.billing_cycle===c?'#2563EB':'transparent', color:form.billing_cycle===c?'#fff':'#64748B' }}>
                    {c==='monthly'?'Monthly':'Yearly (2 months free)'}
                  </button>
                ))}
              </div>

              {PLANS.map(p=>(
                <div key={p.slug} onClick={()=>setForm({...form,plan:p.slug})}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderRadius:12, border:`2px solid ${form.plan===p.slug?p.color:'#E2E8F0'}`, marginBottom:10, cursor:'pointer', background:form.plan===p.slug?`${p.color}08`:'#F8FAFC', transition:'all 0.12s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${p.color}`, background:form.plan===p.slug?p.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {form.plan===p.slug&&<div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }}/>}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', display:'flex', alignItems:'center', gap:8 }}>
                        {p.name} {p.popular&&<span style={{ fontSize:10, background:p.color, color:'#fff', padding:'1px 7px', borderRadius:99 }}>Popular</span>}
                      </div>
                      <div style={{ fontSize:12, color:'#64748B' }}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:800, fontSize:16, color:p.color }}>
                      ₹{form.billing_cycle==='yearly'?p.price*form.total_flats*10:p.price*form.total_flats}/{form.billing_cycle==='yearly'?'yr':'mo'}
                    </div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>₹{p.price}/flat/mo</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step===3 && (
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:'#0F172A', marginBottom:20 }}>Confirm your details</div>
              {[
                { label:'Society',        value:form.name },
                { label:'Location',       value:`${form.city}, ${form.state}` },
                { label:'Total Flats',    value:form.total_flats },
                { label:'Admin',          value:`${form.secretary_name} (${form.secretary_email})` },
                { label:'Plan',           value:`${form.plan.charAt(0).toUpperCase()+form.plan.slice(1)} — ₹${PLANS.find(p=>p.slug===form.plan)?.price}/flat/month` },
                { label:'Billing',        value:form.billing_cycle==='yearly'?'Yearly (2 months free)':'Monthly' },
              ].map(r=>(
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <span style={{ fontSize:13, color:'#64748B' }}>{r.label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ marginTop:16, padding:'14px 16px', background:'rgba(37,99,235,0.06)', borderRadius:10, border:'1px solid rgba(37,99,235,0.2)' }}>
                <div style={{ fontWeight:700, color:'#2563EB', fontSize:14 }}>🎉 30-Day Free Trial</div>
                <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>No payment required now. After trial, ₹{total}/month. Cancel anytime.</div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:8, padding:'10px 14px', marginTop:14, fontSize:13, color:'#DC2626' }}>
              {error}
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginTop:22 }}>
            {step>0 && (
              <button onClick={()=>setStep(step-1)} style={{ padding:'11px 20px', borderRadius:8, border:'1px solid #E2E8F0', background:'#fff', color:'#64748B', fontWeight:600, cursor:'pointer', fontSize:14 }}>
                ← Back
              </button>
            )}
            <button onClick={step<3?nextStep:submit} disabled={loading}
              style={{ flex:1, padding:'11px 20px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {loading ? 'Creating account...' : step<3 ? <>Continue <ArrowRight size={16}/></> : '🚀 Start Free Trial'}
            </button>
          </div>

          <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#94A3B8' }}>
            Already have an account? <a href="/" style={{ color:'#2563EB', fontWeight:600 }}>Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
}
