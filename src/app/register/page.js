'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Lock, MapPin, Home, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

// ── Field component OUTSIDE main component — fixes typing bug ─────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder = '', required = false }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 11, color: '#64748B', fontWeight: 600,
      marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0',
        borderRadius: 8, fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
        background: '#F8FAFC', fontFamily: 'inherit', color: '#1E293B' }}
      onFocus={e => e.target.style.borderColor = '#2563EB'}
      onBlur={e => e.target.style.borderColor = '#E2E8F0'}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, required = false }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 11, color: '#64748B', fontWeight: 600,
      marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
    </label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0',
        borderRadius: 8, fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
        background: '#F8FAFC', fontFamily: 'inherit', color: '#1E293B' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const STEPS = ['Society Info', 'Setup', 'Admin Account', 'Choose Plan'];

const PLANS = [
  { id: 'starter',  name: 'Starter',  price: 25, flats: 'Up to 50 flats',     color: '#2563EB', features: ['All core modules', 'Email support', 'Basic reports'] },
  { id: 'standard', name: 'Standard', price: 40, flats: 'Up to 200 flats',    color: '#7C3AED', features: ['All Starter features', 'Visitor management', 'Phone support', 'Advanced reports'] },
  { id: 'premium',  name: 'Premium',  price: 60, flats: 'Unlimited flats',    color: '#D97706', features: ['All Standard features', 'White-label', 'Priority support', 'WhatsApp alerts', 'API access'] },
];

export default function Register() {
  const router  = useRouter();
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const [society, setSociety] = useState({
    name: '', address: '', city: '', state: '', pincode: '', reg_number: '', established: '',
  });

  const [setup, setSetup] = useState({
    total_flats: '', wings: '', maintenance_amount: '',
  });

  const [admin, setAdmin] = useState({
    name: '', email: '', phone: '', password: '', confirm_password: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#EFF6FF,#F8FAFC)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans,sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(22,163,74,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="#16A34A"/>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            🎉 Society Registered!
          </div>
          <div style={{ fontSize: 14, color: '#64748B', marginBottom: 8, lineHeight: 1.6 }}>
            <b style={{ color: '#0F172A' }}>{society.name}</b> has been successfully registered on SocietyPro.
          </div>
          <div style={{ background: 'white', borderRadius: 14, padding: 20, margin: '20px 0',
            border: '1px solid #E2E8F0', textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 10 }}>
              Your Login Credentials:
            </div>
            {[
              { label: 'Login URL',  value: 'societypro-frontend.vercel.app' },
              { label: 'Email',      value: admin.email     },
              { label: 'Password',   value: admin.password  },
              { label: 'Plan',       value: selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/')}
            style={{ background: '#2563EB', color: 'white', border: 'none', borderRadius: 10,
              padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            → Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#EFF6FF,#F8FAFC)',
      fontFamily: 'DM Sans,sans-serif', padding: '24px 16px' }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 6px 20px rgba(37,99,235,0.3)' }}>
            <Building2 size={28} color="white"/>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>Register Your Society</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
            30-day free trial · No credit card required
          </div>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i < step ? '#16A34A' : i === step ? '#2563EB' : '#E2E8F0',
                  color: i <= step ? 'white' : '#94A3B8' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 10, color: i === step ? '#2563EB' : '#94A3B8',
                  fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 60, height: 2, background: i < step ? '#16A34A' : '#E2E8F0',
                  margin: '0 4px', marginBottom: 18 }}/>
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>

          {/* STEP 0 — Society Info */}
          {step === 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0F172A', marginBottom: 4 }}>
                🏢 Society Information
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                Tell us about your housing society
              </div>
              <Field label="Society / Building Name" value={society.name}
                onChange={v => setSociety({ ...society, name: v })}
                placeholder="e.g. Sunrise Residency CHS" required/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="City" value={society.city}
                  onChange={v => setSociety({ ...society, city: v })} placeholder="Mumbai" required/>
                <Field label="State" value={society.state}
                  onChange={v => setSociety({ ...society, state: v })} placeholder="Maharashtra" required/>
                <Field label="Pincode" value={society.pincode}
                  onChange={v => setSociety({ ...society, pincode: v })} placeholder="400053"/>
                <Field label="Year Established" value={society.established}
                  onChange={v => setSociety({ ...society, established: v })} placeholder="2015"/>
              </div>
              <Field label="Full Address" value={society.address}
                onChange={v => setSociety({ ...society, address: v })}
                placeholder="Plot No, Street, Area" required/>
              <Field label="Registration Number (Optional)" value={society.reg_number}
                onChange={v => setSociety({ ...society, reg_number: v })}
                placeholder="MH/MUM/CHS/12345"/>
            </div>
          )}

          {/* STEP 1 — Setup */}
          {step === 1 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0F172A', marginBottom: 4 }}>
                🏠 Society Setup
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                Configure your society structure
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Total Number of Flats" value={setup.total_flats}
                  onChange={v => setSetup({ ...setup, total_flats: v })}
                  type="number" placeholder="48" required/>
                <Field label="Wings / Blocks" value={setup.wings}
                  onChange={v => setSetup({ ...setup, wings: v })}
                  placeholder="A, B, C, D"/>
              </div>
              <Field label="Monthly Maintenance per Flat (₹)" value={setup.maintenance_amount}
                onChange={v => setSetup({ ...setup, maintenance_amount: v })}
                type="number" placeholder="2500" required/>

              <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '14px 16px',
                border: '1px solid #BFDBFE', marginTop: 8 }}>
                <div style={{ fontSize: 12, color: '#2563EB', fontWeight: 700, marginBottom: 4 }}>
                  💡 Estimated Monthly Collection
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>
                  ₹{((+setup.total_flats || 0) * (+setup.maintenance_amount || 0)).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop:2 }}>
                  {setup.total_flats || 0} flats × ₹{setup.maintenance_amount || 0}/month
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Admin Account */}
          {step === 2 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0F172A', marginBottom: 4 }}>
                👤 Admin Account
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                Create the secretary login account
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Secretary Full Name" value={admin.name}
                  onChange={v => setAdmin({ ...admin, name: v })}
                  placeholder="Rajesh Kumar" required/>
                <Field label="Mobile Number" value={admin.phone}
                  onChange={v => setAdmin({ ...admin, phone: v })}
                  placeholder="9820012345" type="tel"/>
              </div>
              <Field label="Email Address (Login ID)" value={admin.email}
                onChange={v => setAdmin({ ...admin, email: v })}
                placeholder="secretary@yoursociety.in" type="email" required/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Password" value={admin.password}
                  onChange={v => setAdmin({ ...admin, password: v })}
                  type="password" placeholder="Min 8 characters" required/>
                <Field label="Confirm Password" value={admin.confirm_password}
                  onChange={v => setAdmin({ ...admin, confirm_password: v })}
                  type="password" placeholder="Re-enter password" required/>
              </div>
              {admin.password && admin.confirm_password && (
                <div style={{ fontSize: 12, marginTop: -8, marginBottom: 8,
                  color: admin.password === admin.confirm_password ? '#16A34A' : '#DC2626' }}>
                  {admin.password === admin.confirm_password ? '✅ Passwords match' : '❌ Passwords do not match'}
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Choose Plan */}
          {step === 3 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0F172A', marginBottom: 4 }}>
                💳 Choose Your Plan
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                All plans include a 30-day free trial
              </div>
              {PLANS.map(plan => (
                <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                  style={{ border: `2px solid ${selectedPlan === plan.id ? plan.color : '#E2E8F0'}`,
                    borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer',
                    background: selectedPlan === plan.id ? `${plan.color}08` : 'white',
                    transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: plan.color }}>{plan.name}</div>
                        {plan.id === 'standard' && (
                          <span style={{ background: plan.color, color: 'white', fontSize: 10,
                            padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>POPULAR</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{plan.flats}</div>
                      {plan.features.map(f => (
                        <div key={f} style={{ fontSize: 12, color: '#64748B', marginBottom: 3 }}>
                          ✓ {f}
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: plan.color }}>₹{plan.price}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>per flat/month</div>
                      {setup.total_flats && (
                        <div style={{ fontSize: 12, fontWeight: 700, color: plan.color, marginTop: 4 }}>
                          ₹{(plan.price * +setup.total_flats).toLocaleString('en-IN')}/mo
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '12px 14px',
                border: '1px solid rgba(22,163,74,0.2)', fontSize: 13, color: '#16A34A', fontWeight: 600 }}>
                🎁 30-day FREE trial · No credit card · Cancel anytime
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 10,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748B', fontFamily: 'inherit' }}>
                <ChevronLeft size={16}/> Back
              </button>
            ) : (
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 10,
                fontSize: 13, fontWeight: 600, color: '#64748B', textDecoration: 'none' }}>
                ← Login
              </a>
            )}

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                  background: '#2563EB', border: 'none', borderRadius: 10,
                  cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'inherit' }}>
                Next <ChevronRight size={16}/>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                  background: loading ? '#94A3B8' : '#16A34A', border: 'none', borderRadius: 10,
                  cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13,
                  fontWeight: 700, color: 'white', fontFamily: 'inherit' }}>
                {loading ? '⏳ Registering...' : '🎉 Complete Registration'}
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#94A3B8' }}>
          Already registered? <a href="/" style={{ color: '#2563EB', fontWeight: 600 }}>Login here</a>
        </div>
      </div>
    </div>
  );
}
