'use client';
import { useState } from 'react';
import {
  Send, Bell, CheckCircle, Clock, X,
  MessageSquare, Search, RefreshCw,
  ToggleLeft, ToggleRight
} from 'lucide-react';

const SMS_TEMPLATES = [
  { id:'maintenance_due',   title:'Maintenance Due Reminder',  emoji:'💰', category:'billing',       autoTrigger:'1st of every month' },
  { id:'payment_received',  title:'Payment Confirmation',       emoji:'✅', category:'billing',       autoTrigger:'On payment received' },
  { id:'overdue_warning',   title:'Overdue Payment Warning',    emoji:'⚠️', category:'billing',       autoTrigger:'After 10th of month' },
  { id:'announcement',      title:'New Announcement',           emoji:'📢', category:'communication', autoTrigger:'On post' },
  { id:'meeting_invite',    title:'Meeting Invitation',         emoji:'📅', category:'communication', autoTrigger:'On schedule' },
  { id:'complaint_update',  title:'Complaint Status Update',    emoji:'🎫', category:'support',       autoTrigger:'On status change' },
  { id:'visitor_alert',     title:'Visitor Arrival Alert',      emoji:'🔐', category:'security',      autoTrigger:'On check-in' },
  { id:'booking_confirmed', title:'Facility Booking Confirmed', emoji:'🏢', category:'facilities',    autoTrigger:'On approval' },
  { id:'custom',            title:'Custom Message',             emoji:'✏️', category:'custom',        autoTrigger:'Manual only' },
];

const TENANTS = [
  { flat:'A-101', name:'Ramesh Sharma',  phone:'9823456710' },
  { flat:'A-102', name:'Priya Mehta',    phone:'9876543210' },
  { flat:'B-201', name:'Anjali Verma',   phone:'9765432198' },
  { flat:'B-202', name:'Suresh Patel',   phone:'9654321987' },
  { flat:'C-301', name:'Neha Singh',     phone:'9543219876' },
  { flat:'C-302', name:'Vikram Joshi',   phone:'9432198765' },
  { flat:'D-401', name:'Meena Iyer',     phone:'9321987654' },
  { flat:'D-402', name:'Arjun Nair',     phone:'9210987643' },
];

const initialLogs = [
  { id:1, type:'maintenance_due',  to:'9823456710', flat:'A-101', name:'Ramesh Sharma', message:'Dear Ramesh, Your maintenance of ₹2500 for April 2025 is pending...', status:'Delivered', date:'1 Apr 2025', time:'9:00 AM' },
  { id:2, type:'payment_received', to:'9823456710', flat:'A-101', name:'Ramesh Sharma', message:'Dear Ramesh, ₹2500 received for April 2025. Txn: TXN001', status:'Delivered', date:'2 Apr 2025', time:'10:30 AM' },
  { id:3, type:'announcement',     to:'ALL',        flat:'All',   name:'All Residents', message:'NOTICE: Water supply will be off on 30th Apr from 9AM–1PM.', status:'Delivered', date:'28 Apr 2025', time:'8:00 AM' },
  { id:4, type:'visitor_alert',    to:'9765432198', flat:'B-201', name:'Anjali Verma',  message:'Dear Anjali, Your visitor has arrived at Main gate.', status:'Delivered', date:'17 Apr 2025', time:'8:00 AM' },
  { id:5, type:'meeting_invite',   to:'ALL',        flat:'All',   name:'All Owners',    message:'AGM on 5 May 2025 at 6:30 PM, Community Hall. Please attend.', status:'Delivered', date:'25 Apr 2025', time:'10:00 AM' },
  { id:6, type:'overdue_warning',  to:'9654321987', flat:'B-202', name:'Suresh Patel',  message:'REMINDER: Flat B-202 has ₹7500 overdue. Late fee may apply.', status:'Failed',    date:'10 Apr 2025', time:'10:00 AM' },
];

const STATUS_BADGE = { Delivered:'badge-green', Failed:'badge-red', Pending:'badge-gold' };

const ToggleSwitch = ({ on, onChange, label, desc }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
    <div>
      <div style={{ fontWeight:600, fontSize:13.5, color:'var(--white)' }}>{label}</div>
      {desc && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{desc}</div>}
    </div>
    <button onClick={onChange} style={{ background:'none', border:'none', cursor:'pointer', color:on?'var(--accent)':'var(--muted)', padding:0 }}>
      {on ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
    </button>
  </div>
);

export default function Notifications() {
  const [tab, setTab]             = useState('send');
  const [logs, setLogs]           = useState(initialLogs);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch]       = useState('');
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(SMS_TEMPLATES[0]);
  const [recipients, setRecipients] = useState('all');
  const [selectedFlats, setSelectedFlats] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [customPhone, setCustomPhone]     = useState('');

  const [settings, setSettings] = useState({
    maintenance_reminder: true,
    payment_confirm:      true,
    overdue_alert:        true,
    announcement:         true,
    meeting_invite:       true,
    complaint_update:     true,
    visitor_alert:        true,
    booking_confirm:      true,
    whatsapp:             false,
    sms:                  true,
  });

  const simulateSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    const now     = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
    const dateStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    const toList  = recipients === 'all' ? TENANTS
      : recipients === 'flat' ? TENANTS.filter(t => selectedFlats.includes(t.flat))
      : [{ flat:'Custom', name:'Custom', phone: customPhone }];
    const newLogs = toList.map((t, i) => ({
      id: Date.now() + i, type: selectedTemplate.id,
      to: t.phone, flat: t.flat, name: t.name,
      message: selectedTemplate.id === 'custom' ? customMessage : selectedTemplate.title + ' sent to ' + t.name,
      status: 'Delivered', date: dateStr, time: timeStr,
    }));
    setLogs([...newLogs, ...logs]);
    setSending(false); setSent(true);
    setTimeout(() => setSent(false), 3000);
    setTab('logs');
  };

  const filteredLogs = logs.filter(l => {
    const matchSearch = !search || l.flat.toLowerCase().includes(search.toLowerCase()) || l.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:     logs.length,
    delivered: logs.filter(l => l.status === 'Delivered').length,
    failed:    logs.filter(l => l.status === 'Failed').length,
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        {[
          { id:'send',      label:'📤 Send SMS'    },
          { id:'templates', label:'📋 Templates'   },
          { id:'logs',      label:'📊 Sent Log'    },
          { id:'settings',  label:'⚙️ Settings'   },
        ].map(t => (
          <button key={t.id} className={`btn ${tab===t.id?'btn-primary':'btn-outline'}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}

        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          {[
            { label:'Total Sent', value:stats.total,     color:'var(--accent2)' },
            { label:'Delivered',  value:stats.delivered, color:'var(--accent)'  },
            { label:'Failed',     value:stats.failed,    color:'var(--red)'     },
          ].map(s => (
            <div key={s.label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 14px', textAlign:'center' }}>
              <div style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEND TAB ── */}
      {tab === 'send' && (
        <div className="grid-2">
          {/* Template selector */}
          <div className="card">
            <div className="card-title"><span>📋 Select Template</span></div>
            {SMS_TEMPLATES.map(t => (
              <div key={t.id} onClick={() => setSelectedTemplate(t)}
                style={{ display:'flex', gap:12, padding:'10px 14px', borderRadius:10,
                  cursor:'pointer', marginBottom:4,
                  background: selectedTemplate.id===t.id ? 'rgba(37,99,235,0.08)' : '#F8FAFC',
                  border:`1.5px solid ${selectedTemplate.id===t.id?'var(--accent)':'var(--border)'}` }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{t.emoji}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:13.5, color:'var(--white)' }}>{t.title}</div>
                  <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:2 }}>Auto: {t.autoTrigger}</div>
                </div>
                {selectedTemplate.id===t.id && <CheckCircle size={16} style={{ color:'var(--accent)', marginLeft:'auto', flexShrink:0 }}/>}
              </div>
            ))}
          </div>

          {/* Compose */}
          <div className="card">
            <div className="card-title"><span>✍️ Compose & Send</span></div>

            {/* Template preview */}
            <div style={{ background:'#F8FAFC', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
              <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
                {selectedTemplate.emoji} {selectedTemplate.title}
              </div>
              {selectedTemplate.id === 'custom' ? (
                <textarea placeholder="Type your custom message..." style={{ minHeight:80, background:'transparent', border:'none', outline:'none', width:'100%', fontSize:13.5, color:'var(--text)', resize:'vertical', padding:0, fontFamily:'inherit' }}
                  value={customMessage} onChange={e => setCustomMessage(e.target.value)}/>
              ) : (
                <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6 }}>
                  This template will be automatically personalized for each recipient with their name, flat number, and relevant details.
                </div>
              )}
            </div>

            {/* Recipients */}
            <div style={{ marginBottom:16 }}>
              <label className="field-label">Send To</label>
              <div style={{ display:'flex', gap:8, marginTop:6, marginBottom:10 }}>
                {[
                  { id:'all',    label:'👥 All Residents' },
                  { id:'flat',   label:'🏠 Select Flats'  },
                  { id:'custom', label:'📞 Custom Number' },
                ].map(r => (
                  <button key={r.id} className={`btn btn-sm ${recipients===r.id?'btn-primary':'btn-outline'}`}
                    onClick={() => setRecipients(r.id)}>{r.label}</button>
                ))}
              </div>

              {recipients === 'flat' && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {TENANTS.map(t => (
                    <label key={t.flat} style={{ display:'flex', alignItems:'center', gap:6,
                      background: selectedFlats.includes(t.flat)?'rgba(37,99,235,0.08)':'#F8FAFC',
                      border:`1px solid ${selectedFlats.includes(t.flat)?'var(--accent)':'var(--border)'}`,
                      borderRadius:8, padding:'8px 10px', cursor:'pointer' }}>
                      <input type="checkbox" checked={selectedFlats.includes(t.flat)}
                        onChange={e => setSelectedFlats(e.target.checked ? [...selectedFlats,t.flat] : selectedFlats.filter(f=>f!==t.flat))}
                        style={{ width:'auto', margin:0 }}/>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:'var(--white)' }}>{t.flat}</div>
                        <div style={{ fontSize:10, color:'var(--muted)' }}>{t.name.split(' ')[0]}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {recipients === 'custom' && (
                <input placeholder="Enter phone number e.g. 9820012345" value={customPhone}
                  onChange={e => setCustomPhone(e.target.value)} style={{ maxWidth:280 }}/>
              )}
            </div>

            {/* Summary */}
            <div style={{ background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:13.5, color:'var(--white)' }}>
                  {recipients==='all' ? `${TENANTS.length} Residents` : recipients==='flat' ? `${selectedFlats.length} Flats Selected` : customPhone ? '1 Number' : '0 Numbers'}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
                  Est. cost: {recipients==='all' ? `₹${(TENANTS.length * 0.15).toFixed(2)}` : '₹0.15'} via Twilio
                </div>
              </div>
              <MessageSquare size={22} style={{ color:'var(--accent)', opacity:0.6 }}/>
            </div>

            {sent && (
              <div style={{ background:'rgba(37,99,235,0.08)', border:'1px solid rgba(37,99,235,0.25)', borderRadius:10, padding:'12px 16px', marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
                <CheckCircle size={18} style={{ color:'var(--accent)' }}/>
                <span style={{ fontWeight:700, color:'var(--accent)', fontSize:13.5 }}>SMS sent! Check Sent Log tab →</span>
              </div>
            )}

            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
              onClick={simulateSend} disabled={sending}>
              {sending ? <><RefreshCw size={14} style={{ animation:'spin 1s linear infinite' }}/> Sending...</> : <><Send size={14}/> Send SMS Now</>}
            </button>

            <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:8, fontSize:12, color:'var(--muted)' }}>
              💡 Connect your <b>Twilio</b> account in Settings to send real SMS.
              Current mode: <span style={{ color:'var(--gold)', fontWeight:700 }}>Demo</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TEMPLATES TAB ── */}
      {tab === 'templates' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {SMS_TEMPLATES.filter(t => t.id !== 'custom').map(t => (
            <div key={t.id} className="card" style={{ marginBottom:0 }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:28 }}>{t.emoji}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>{t.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Auto: {t.autoTrigger}</div>
                </div>
              </div>
              <button className="btn btn-sm btn-primary" style={{ width:'100%', justifyContent:'center' }}
                onClick={() => { setSelectedTemplate(t); setTab('send'); }}>
                <Send size={12}/> Use Template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── LOGS TAB ── */}
      {tab === 'logs' && (
        <div>
          <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ position:'relative', maxWidth:280 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
              <input placeholder="Search flat, name..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
            </div>
            {['All','Delivered','Failed','Pending'].map(s => (
              <button key={s} className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-outline'}`}
                onClick={() => setFilterStatus(s)}>{s}</button>
            ))}
          </div>

          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:14.5, color:'var(--white)' }}>
              📊 SMS Log ({filteredLogs.length})
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>{['Type','Recipient','Flat','Message','Date & Time','Status'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredLogs.map(l => {
                    const tmpl = SMS_TEMPLATES.find(t => t.id === l.type) || { emoji:'📱', title:'SMS' };
                    return (
                      <tr key={l.id}>
                        <td><span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ fontSize:18 }}>{tmpl.emoji}</span><span style={{ fontWeight:600 }}>{tmpl.title}</span></span></td>
                        <td><div style={{ fontWeight:600 }}>{l.name}</div><div style={{ fontSize:12, color:'var(--muted)' }}>{l.to}</div></td>
                        <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{l.flat}</span></td>
                        <td style={{ maxWidth:240 }}><div style={{ fontSize:12.5, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.message}</div></td>
                        <td style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap' }}>{l.date}<br/>{l.time}</td>
                        <td><span className={`badge ${STATUS_BADGE[l.status]||'badge-gray'}`} style={{ display:'flex', alignItems:'center', gap:4, width:'fit-content' }}>
                          {l.status==='Delivered'?<CheckCircle size={11}/>:l.status==='Failed'?<X size={11}/>:<Clock size={11}/>} {l.status}
                        </span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)' }}>No messages found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {tab === 'settings' && (
        <div className="grid-2">
          {/* Twilio config */}
          <div className="card">
            <div className="card-title"><span>⚙️ Twilio Configuration</span></div>
            <div style={{ padding:'12px 14px', background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:10, marginBottom:16, fontSize:13 }}>
              <div style={{ fontWeight:700, color:'var(--accent)', marginBottom:6 }}>🔧 How to connect Twilio</div>
              <div style={{ color:'var(--muted)', lineHeight:1.7 }}>
                1. Go to <b style={{ color:'var(--accent)' }}>twilio.com</b> → create free account<br/>
                2. Get your <b>Account SID</b> and <b>Auth Token</b><br/>
                3. Buy a phone number (₹200/month)<br/>
                4. Add to Railway environment variables
              </div>
            </div>
            <div className="form-row"><label className="field-label">Twilio Account SID</label><input placeholder="ACxxxxxxxxxxxxxxxx" type="password"/></div>
            <div className="form-row"><label className="field-label">Twilio Auth Token</label><input placeholder="Your auth token" type="password"/></div>
            <div className="form-row"><label className="field-label">From Phone Number</label><input placeholder="+1415xxxxxxx"/></div>
            <div className="form-row"><label className="field-label">Sender ID (India)</label><input placeholder="SRSIDE"/></div>
            <button className="btn btn-primary">Save Configuration</button>
          </div>

          {/* Auto-triggers */}
          <div className="card">
            <div className="card-title"><span>🔔 Auto-send Triggers</span></div>
            <ToggleSwitch on={settings.maintenance_reminder} onChange={() => setSettings({...settings,maintenance_reminder:!settings.maintenance_reminder})} label="💰 Maintenance Reminder" desc="Send on 1st of every month"/>
            <ToggleSwitch on={settings.payment_confirm}      onChange={() => setSettings({...settings,payment_confirm:!settings.payment_confirm})}           label="✅ Payment Confirmation"  desc="Send when payment is received"/>
            <ToggleSwitch on={settings.overdue_alert}        onChange={() => setSettings({...settings,overdue_alert:!settings.overdue_alert})}               label="⚠️ Overdue Warning"       desc="Send after 10th if unpaid"/>
            <ToggleSwitch on={settings.announcement}         onChange={() => setSettings({...settings,announcement:!settings.announcement})}                 label="📢 New Announcement"      desc="Send when admin posts notice"/>
            <ToggleSwitch on={settings.meeting_invite}       onChange={() => setSettings({...settings,meeting_invite:!settings.meeting_invite})}             label="📅 Meeting Invitation"    desc="Send when meeting is scheduled"/>
            <ToggleSwitch on={settings.complaint_update}     onChange={() => setSettings({...settings,complaint_update:!settings.complaint_update})}         label="🎫 Complaint Update"      desc="Send when complaint status changes"/>
            <ToggleSwitch on={settings.visitor_alert}        onChange={() => setSettings({...settings,visitor_alert:!settings.visitor_alert})}               label="🔐 Visitor Alert"          desc="Send when visitor checks in"/>
            <ToggleSwitch on={settings.booking_confirm}      onChange={() => setSettings({...settings,booking_confirm:!settings.booking_confirm})}           label="🏢 Booking Confirmed"     desc="Send when facility booking approved"/>
            <div style={{ marginTop:14 }}>
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>💾 Save Settings</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
