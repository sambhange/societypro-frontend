'use client';
import { useState } from 'react';
import {
  Building2, User, Lock, Bell, CreditCard,
  Save, Eye, EyeOff, CheckCircle, Phone, Mail,
  MapPin, Users, Shield, Smartphone
} from 'lucide-react';

const TABS = [
  { id: 'society',   label: 'Society Profile',  icon: Building2  },
  { id: 'account',   label: 'My Account',        icon: User       },
  { id: 'password',  label: 'Change Password',   icon: Lock       },
  { id: 'notifications', label: 'Notifications', icon: Bell       },
  { id: 'billing',   label: 'Plan & Billing',    icon: CreditCard },
];

export default function Settings() {
  const [tab, setTab]         = useState('society');
  const [saved, setSaved]     = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [society, setSociety] = useState({
    name:        'Sunrise Residency',
    address:     'Plot 12, Sector 7, Andheri West',
    city:        'Mumbai',
    state:       'Maharashtra',
    pincode:     '400053',
    total_flats: 48,
    wings:       'A, B, C, D',
    reg_number:  'MH/MUM/CHS/12345',
    established: '2015',
  });

  const [account, setAccount] = useState({
    name:   'Rajesh Kumar',
    email:  'admin@sunrise.in',
    phone:  '9820012345',
    role:   'Society Secretary',
    flat:   'A-101',
  });

  const [password, setPassword] = useState({
    current: '',
    newPw:   '',
    confirm: '',
  });

  const [notifs, setNotifs] = useState({
    maintenance_due:    true,
    payment_received:   true,
    new_complaint:      true,
    visitor_alert:      true,
    announcement:       true,
    meeting_reminder:   true,
    email_notifs:       true,
    sms_notifs:         false,
    whatsapp_notifs:    false,
  });

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ToggleSwitch = ({ on, onChange, label, desc }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight:600, fontSize:13.5, color:'var(--white)' }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{desc}</div>}
      </div>
      <div onClick={onChange}
        style={{ width:44, height:24, borderRadius:99, background: on?'var(--accent)':'var(--border)',
          cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
        <div style={{ width:18, height:18, borderRadius:'50%', background:'white',
          position:'absolute', top:3, left: on?23:3, transition:'left 0.2s',
          boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
      </div>
    </div>
  );

  const Field = ({ label, value, onChange, type='text', placeholder='' }) => (
    <div className="form-row">
      <label className="field-label">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20 }}>

      {/* Left sidebar tabs */}
      <div className="card" style={{ padding:'10px 0', height:'fit-content', marginBottom:0 }}>
        <div style={{ padding:'8px 16px 10px', fontSize:11, color:'var(--muted)', fontWeight:600,
          textTransform:'uppercase', letterSpacing:'0.8px' }}>Settings</div>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <div key={t.id} onClick={()=>setTab(t.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px',
                cursor:'pointer', borderRadius:8, margin:'1px 6px',
                background: tab===t.id?'rgba(37,99,235,0.08)':'transparent',
                borderLeft:`3px solid ${tab===t.id?'var(--accent)':'transparent'}`,
                color: tab===t.id?'var(--accent)':'var(--muted)',
                fontWeight: tab===t.id?700:400, fontSize:13, transition:'all 0.12s' }}
              onMouseEnter={e=>{ if(tab!==t.id) e.currentTarget.style.background='#F8FAFC'; }}
              onMouseLeave={e=>{ if(tab!==t.id) e.currentTarget.style.background='transparent'; }}>
              <Icon size={15}/>
              {t.label}
            </div>
          );
        })}
      </div>

      {/* Right content */}
      <div>

        {/* Saved banner */}
        {saved && (
          <div style={{ background:'rgba(22,163,74,0.1)', border:'1px solid rgba(22,163,74,0.3)',
            borderRadius:10, padding:'12px 16px', marginBottom:16,
            display:'flex', alignItems:'center', gap:10 }}>
            <CheckCircle size={18} style={{ color:'var(--accent)' }}/>
            <span style={{ fontWeight:700, color:'var(--accent)', fontSize:13.5 }}>
              Changes saved successfully!
            </span>
          </div>
        )}

        {/* ── SOCIETY PROFILE ── */}
        {tab==='society' && (
          <div className="card">
            <div className="card-title">🏢 Society Profile</div>
            <div className="form-grid-2">
              <div className="form-row col-span-2">
                <label className="field-label">Society / Building Name</label>
                <input value={society.name} onChange={e=>setSociety({...society,name:e.target.value})}/>
              </div>
              <Field label="City"            value={society.city}        onChange={v=>setSociety({...society,city:v})}/>
              <Field label="State"           value={society.state}       onChange={v=>setSociety({...society,state:v})}/>
              <Field label="Pincode"         value={society.pincode}     onChange={v=>setSociety({...society,pincode:v})}/>
              <Field label="Total Flats"     value={society.total_flats} onChange={v=>setSociety({...society,total_flats:v})} type="number"/>
              <Field label="Wings / Blocks"  value={society.wings}       onChange={v=>setSociety({...society,wings:v})} placeholder="A, B, C"/>
              <Field label="Registration No" value={society.reg_number}  onChange={v=>setSociety({...society,reg_number:v})}/>
              <div className="form-row col-span-2">
                <label className="field-label">Full Address</label>
                <input value={society.address} onChange={e=>setSociety({...society,address:e.target.value})}/>
              </div>
            </div>
            <button className="btn btn-primary" onClick={showSaved}>
              <Save size={14}/> Save Society Details
            </button>
          </div>
        )}

        {/* ── MY ACCOUNT ── */}
        {tab==='account' && (
          <div className="card">
            <div className="card-title">👤 My Account</div>

            {/* Avatar */}
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24,
              padding:'16px', background:'#F8FAFC', borderRadius:12, border:'1px solid var(--border)' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--accent)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:22, fontWeight:800, color:'white', flexShrink:0 }}>
                {account.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div>
                <div style={{ fontWeight:800, fontSize:17, color:'var(--white)' }}>{account.name}</div>
                <div style={{ fontSize:13, color:'var(--muted)', marginTop:3 }}>{account.role}</div>
                <div style={{ fontSize:12, color:'var(--accent)', marginTop:2 }}>Flat {account.flat}</div>
              </div>
            </div>

            <div className="form-grid-2">
              <Field label="Full Name"    value={account.name}  onChange={v=>setAccount({...account,name:v})}/>
              <Field label="Flat No."     value={account.flat}  onChange={v=>setAccount({...account,flat:v})}/>
              <Field label="Email Address" value={account.email} onChange={v=>setAccount({...account,email:v})} type="email"/>
              <Field label="Phone Number" value={account.phone} onChange={v=>setAccount({...account,phone:v})}/>
              <div className="form-row">
                <label className="field-label">Role</label>
                <input value={account.role} disabled style={{ opacity:0.6, cursor:'not-allowed' }}/>
              </div>
            </div>
            <button className="btn btn-primary" onClick={showSaved}>
              <Save size={14}/> Save Account Details
            </button>
          </div>
        )}

        {/* ── CHANGE PASSWORD ── */}
        {tab==='password' && (
          <div className="card">
            <div className="card-title">🔒 Change Password</div>
            <div style={{ maxWidth:420 }}>
              <div className="form-row">
                <label className="field-label">Current Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPw?'text':'password'} value={password.current}
                    onChange={e=>setPassword({...password,current:e.target.value})}
                    placeholder="Enter current password"/>
                  <button onClick={()=>setShowPw(!showPw)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
                    {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </div>
              <div className="form-row">
                <label className="field-label">New Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showNew?'text':'password'} value={password.newPw}
                    onChange={e=>setPassword({...password,newPw:e.target.value})}
                    placeholder="Min. 8 characters"/>
                  <button onClick={()=>setShowNew(!showNew)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
                    {showNew?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </div>
              <div className="form-row">
                <label className="field-label">Confirm New Password</label>
                <input type="password" value={password.confirm}
                  onChange={e=>setPassword({...password,confirm:e.target.value})}
                  placeholder="Re-enter new password"/>
              </div>

              {password.newPw && password.confirm && password.newPw !== password.confirm && (
                <div style={{ fontSize:12, color:'var(--red)', marginBottom:12 }}>
                  ❌ Passwords do not match
                </div>
              )}
              {password.newPw && password.confirm && password.newPw === password.confirm && (
                <div style={{ fontSize:12, color:'var(--accent)', marginBottom:12 }}>
                  ✅ Passwords match
                </div>
              )}

              <div style={{ background:'#F8FAFC', borderRadius:10, padding:'12px 14px',
                marginBottom:16, border:'1px solid var(--border)', fontSize:12, color:'var(--muted)' }}>
                Password must be at least 8 characters with numbers and letters.
              </div>
              <button className="btn btn-primary"
                disabled={!password.current || !password.newPw || password.newPw !== password.confirm}
                onClick={showSaved}>
                <Lock size={14}/> Update Password
              </button>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {tab==='notifications' && (
          <div className="card">
            <div className="card-title">🔔 Notification Preferences</div>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600,
                textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10 }}>
                Alert Types
              </div>
              <ToggleSwitch on={notifs.maintenance_due}  onChange={()=>setNotifs({...notifs,maintenance_due:!notifs.maintenance_due})}   label="💰 Maintenance Due Reminder"  desc="Alert when maintenance is pending"/>
              <ToggleSwitch on={notifs.payment_received} onChange={()=>setNotifs({...notifs,payment_received:!notifs.payment_received})} label="✅ Payment Received"           desc="Confirm when payment is collected"/>
              <ToggleSwitch on={notifs.new_complaint}    onChange={()=>setNotifs({...notifs,new_complaint:!notifs.new_complaint})}       label="🎫 New Complaint Filed"        desc="Alert when resident files complaint"/>
              <ToggleSwitch on={notifs.visitor_alert}    onChange={()=>setNotifs({...notifs,visitor_alert:!notifs.visitor_alert})}       label="🔐 Visitor Arrival Alert"      desc="Alert when visitor checks in"/>
              <ToggleSwitch on={notifs.announcement}     onChange={()=>setNotifs({...notifs,announcement:!notifs.announcement})}         label="📢 New Announcements"          desc="Alert when admin posts notice"/>
              <ToggleSwitch on={notifs.meeting_reminder} onChange={()=>setNotifs({...notifs,meeting_reminder:!notifs.meeting_reminder})} label="📅 Meeting Reminders"          desc="Remind before scheduled meetings"/>
            </div>

            <div>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600,
                textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10 }}>
                Notification Channels
              </div>
              <ToggleSwitch on={notifs.email_notifs}    onChange={()=>setNotifs({...notifs,email_notifs:!notifs.email_notifs})}       label="📧 Email Notifications"   desc="Receive alerts by email"/>
              <ToggleSwitch on={notifs.sms_notifs}      onChange={()=>setNotifs({...notifs,sms_notifs:!notifs.sms_notifs})}           label="📱 SMS Notifications"     desc="Receive alerts by SMS (charges apply)"/>
              <ToggleSwitch on={notifs.whatsapp_notifs} onChange={()=>setNotifs({...notifs,whatsapp_notifs:!notifs.whatsapp_notifs})} label="💬 WhatsApp Notifications" desc="Receive alerts on WhatsApp"/>
            </div>
            <div style={{ marginTop:16 }}>
              <button className="btn btn-primary" onClick={showSaved}>
                <Save size={14}/> Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* ── BILLING ── */}
        {tab==='billing' && (
          <div>
            {/* Current plan */}
            <div className="card" style={{ marginBottom:16 }}>
              <div className="card-title">💳 Current Plan</div>
              <div style={{ display:'flex', gap:16, alignItems:'center',
                background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)',
                borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:'var(--accent)' }}>Standard Plan</div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>
                    ₹40 per flat per month · 48 flats · ₹1,920/month
                  </div>
                  <div style={{ fontSize:12, color:'var(--accent)', fontWeight:600, marginTop:4 }}>
                    🟢 Active — Trial ends in 28 days
                  </div>
                </div>
                <div style={{ marginLeft:'auto', textAlign:'right' }}>
                  <div style={{ fontSize:28, fontWeight:800, color:'var(--accent)' }}>₹1,920</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>/month</div>
                </div>
              </div>

              {/* Plan features */}
              {[
                '✅ Dashboard + Analytics',
                '✅ Tenant + Maintenance + Payments',
                '✅ Announcements + Meetings',
                '✅ SMS Alerts (100 free/month)',
                '✅ Visitor Management',
                '✅ Complaints + Parking',
                '✅ Forum + Polls + Committee',
                '✅ File Repository + Facility Booking',
              ].map(f => (
                <div key={f} style={{ fontSize:13, color:'var(--muted)', padding:'4px 0' }}>{f}</div>
              ))}

              <div style={{ marginTop:16, display:'flex', gap:10 }}>
                <button className="btn btn-primary">⬆️ Upgrade to Premium</button>
                <button className="btn btn-outline">📅 Switch to Yearly (Save 16%)</button>
              </div>
            </div>

            {/* Billing history */}
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>
                  🧾 Billing History
                </span>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Invoice','Date','Amount','Status','Download'].map(h=>(
                      <th key={h} style={{ textAlign:'left', fontSize:11, color:'var(--muted)',
                        fontWeight:600, padding:'8px 16px', background:'#F8FAFC',
                        borderBottom:'1px solid var(--border)', textTransform:'uppercase',
                        letterSpacing:'0.8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} style={{ padding:'30px 0', textAlign:'center',
                      color:'var(--muted)', fontSize:13 }}>
                      No invoices yet — your 30-day free trial is active 🎉
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
