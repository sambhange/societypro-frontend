'use client';
import { useState } from 'react';
import {
  Plus, X, Search, Clock, CheckCircle, LogIn,
  LogOut, User, Phone, Home, Calendar, Eye,
  Car, ShoppingBag, Wrench, Users, AlertCircle
} from 'lucide-react';

const VISITOR_TYPES = [
  { id: 'guest',    label: 'Guest / Relative', emoji: '👤', color: 'var(--accent2)' },
  { id: 'delivery', label: 'Delivery',         emoji: '📦', color: 'var(--gold)' },
  { id: 'cab',      label: 'Cab / Driver',      emoji: '🚗', color: 'var(--accent)' },
  { id: 'service',  label: 'Service Person',    emoji: '🔧', color: '#a78bfa' },
  { id: 'domestic', label: 'Domestic Help',     emoji: '🧹', color: '#f472b6' },
  { id: 'other',    label: 'Other',             emoji: '🙋', color: 'var(--muted)' },
];

const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const now   = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const initialVisitors = [
  { id: 1,  name: 'Santosh Kumar',  mobile: '9758485685', flat: 'A-102', meetTo: 'Priya Mehta',    type: 'guest',    date: today, inTime: '9:05 AM',  outTime: '11:20 AM', status: 'CheckedOut', gate: 'Main', purpose: 'Personal visit', vehicleNo: '' },
  { id: 2,  name: 'Swiggy Delivery',mobile: '9000012345', flat: 'B-201', meetTo: 'Anjali Verma',   type: 'delivery', date: today, inTime: '10:30 AM', outTime: '10:45 AM', status: 'CheckedOut', gate: 'Main', purpose: 'Food delivery', vehicleNo: '' },
  { id: 3,  name: 'Ramu Kaka',      mobile: '9876500001', flat: 'C-301', meetTo: 'Neha Singh',     type: 'domestic', date: today, inTime: '8:00 AM',  outTime: null,       status: 'Inside',     gate: 'Main', purpose: 'House help', vehicleNo: '' },
  { id: 4,  name: 'Akash Plumber',  mobile: '9123456780', flat: 'D-401', meetTo: 'Meena Iyer',     type: 'service',  date: today, inTime: '11:00 AM', outTime: null,       status: 'Inside',     gate: 'Main', purpose: 'Plumbing repair', vehicleNo: '' },
  { id: 5,  name: 'Sunil Sharma',   mobile: '9988776655', flat: 'A-101', meetTo: 'Ramesh Sharma',  type: 'guest',    date: today, inTime: '2:15 PM',  outTime: null,       status: 'Inside',     gate: 'Main', purpose: 'Birthday party', vehicleNo: 'MH04-ZZ9988' },
  { id: 6,  name: 'Amazon Courier', mobile: '1800123456', flat: 'B-202', meetTo: 'Suresh Patel',   type: 'delivery', date: '16 Apr 2025', inTime: '3:30 PM', outTime: '3:45 PM', status: 'CheckedOut', gate: 'Side', purpose: 'Parcel delivery', vehicleNo: '' },
  { id: 7,  name: 'Deepa Bai',      mobile: '9765000088', flat: 'C-302', meetTo: 'Vikram Joshi',   type: 'domestic', date: '16 Apr 2025', inTime: '7:45 AM', outTime: '12:00 PM', status: 'CheckedOut', gate: 'Main', purpose: 'House help', vehicleNo: '' },
  { id: 8,  name: 'Ola Cab Driver', mobile: '9001234567', flat: 'D-402', meetTo: 'Arjun Nair',     type: 'cab',      date: '16 Apr 2025', inTime: '6:00 PM', outTime: '6:05 PM', status: 'CheckedOut', gate: 'Main', purpose: 'Pickup', vehicleNo: 'MH01-OLA123' },
];

const TYPE_MAP = Object.fromEntries(VISITOR_TYPES.map(t => [t.id, t]));

export default function Visitors() {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus]   = useState('All');
  const [filterType, setFilterType]       = useState('All');
  const [filterDate, setFilterDate]       = useState('Today');
  const [showForm, setShowForm]   = useState(false);
  const [selected, setSelected]   = useState(null);
  const [form, setForm] = useState({
    name: '', mobile: '', flat: '', meetTo: '', type: 'guest',
    purpose: '', vehicleNo: '', gate: 'Main',
  });

  const todayVisitors = visitors.filter(v => v.date === today);
  const insideNow     = visitors.filter(v => v.status === 'Inside');

  const displayVisitors = visitors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      v.name.toLowerCase().includes(q) || v.flat.toLowerCase().includes(q) ||
      v.mobile.includes(q) || v.meetTo.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    const matchType   = filterType === 'All'   || v.type === filterType;
    const matchDate   = filterDate === 'All'   || (filterDate === 'Today' && v.date === today) ||
                        (filterDate === 'Yesterday' && v.date !== today);
    return matchSearch && matchStatus && matchType && matchDate;
  });

  const checkIn = () => {
    if (!form.name || !form.flat || !form.mobile) return;
    setVisitors([{
      ...form, id: Date.now(), date: today,
      inTime: now(), outTime: null, status: 'Inside',
    }, ...visitors]);
    setForm({ name:'', mobile:'', flat:'', meetTo:'', type:'guest', purpose:'', vehicleNo:'', gate:'Main' });
    setShowForm(false);
  };

  const checkOut = (id) => {
    setVisitors(visitors.map(v =>
      v.id === id ? { ...v, outTime: now(), status: 'CheckedOut' } : v
    ));
    if (selected?.id === id) setSelected(prev => ({ ...prev, outTime: now(), status: 'CheckedOut' }));
  };

  const getDuration = (inTime, outTime) => {
    if (!outTime) return null;
    try {
      const toMins = t => {
        const [time, meridiem] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (meridiem === 'PM' && h !== 12) h += 12;
        if (meridiem === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      const diff = toMins(outTime) - toMins(inTime);
      if (diff <= 0) return null;
      const hrs = Math.floor(diff / 60);
      const mins = diff % 60;
      return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    } catch { return null; }
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', maxWidth:280 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search name, flat, mobile..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        {['Today','Yesterday','All'].map(d => (
          <button key={d} className={`btn btn-sm ${filterDate===d?'btn-primary':'btn-outline'}`}
            onClick={() => setFilterDate(d)}>{d}</button>
        ))}
        {['All','Inside','CheckedOut'].map(s => (
          <button key={s} className={`btn btn-sm ${filterStatus===s?'btn-blue':'btn-outline'}`}
            onClick={() => setFilterStatus(s)}>
            {s === 'Inside' ? '🟢 Inside' : s === 'CheckedOut' ? '🔴 Checked Out' : 'All Status'}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => setShowForm(!showForm)}>
          <Plus size={14}/> Log Visitor
        </button>
      </div>

      {/* Check-in form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>🔐 Log New Visitor</span>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={18}/></button>
          </div>

          {/* Visitor type selector */}
          <div style={{ marginBottom:16 }}>
            <label className="field-label">Visitor Type</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:6 }}>
              {VISITOR_TYPES.map(t => (
                <button key={t.id} onClick={() => setForm({...form, type:t.id})}
                  className="btn btn-sm"
                  style={{
                    background: form.type===t.id ? `${t.color}25` : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${form.type===t.id ? t.color : 'var(--border)'}`,
                    color: form.type===t.id ? t.color : 'var(--muted)',
                    fontWeight: form.type===t.id ? 700 : 400,
                  }}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid-4" style={{ marginBottom:14 }}>
            <div className="form-row">
              <label className="field-label">Visitor Name</label>
              <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Mobile Number</label>
              <input placeholder="9800012345" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Visiting Flat</label>
              <input placeholder="A-101" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Meeting Person</label>
              <input placeholder="Resident name" value={form.meetTo} onChange={e=>setForm({...form,meetTo:e.target.value})}/>
            </div>
            <div className="form-row col-span-2">
              <label className="field-label">Purpose of Visit</label>
              <input placeholder="e.g. Delivery, Meeting, Repair..." value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Vehicle No. (if any)</label>
              <input placeholder="MH04-AB1234" value={form.vehicleNo} onChange={e=>setForm({...form,vehicleNo:e.target.value.toUpperCase()})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Gate</label>
              <select value={form.gate} onChange={e=>setForm({...form,gate:e.target.value})}>
                <option>Main</option>
                <option>Side</option>
                <option>Back</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={checkIn}>
            <LogIn size={15}/> Check In Visitor
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom:20 }}>
        {[
          { label:"Today's Visitors",  value: todayVisitors.length,            color:'var(--accent2)', icon:'📅' },
          { label:'Currently Inside',  value: insideNow.length,                color:'var(--accent)',  icon:'🟢' },
          { label:"Today's Checkouts", value: todayVisitors.filter(v=>v.status==='CheckedOut').length, color:'var(--muted)', icon:'🔴' },
          { label:'Total This Week',   value: visitors.length,                 color:'var(--gold)',    icon:'📊' },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ fontSize:24, color:s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Currently inside alert */}
      {insideNow.length > 0 && (
        <div style={{ background:'rgba(0,198,167,0.08)', border:'1.5px solid rgba(0,198,167,0.25)', borderRadius:12, padding:'14px 18px', marginBottom:18 }}>
          <div style={{ fontWeight:700, fontSize:13.5, color:'var(--accent)', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)', display:'inline-block', animation:'pulse 1.5s infinite' }}/>
            {insideNow.length} visitor{insideNow.length>1?'s':''} currently inside the society
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {insideNow.map(v => (
              <div key={v.id} style={{ background:'#F1F5F9', borderRadius:8, padding:'8px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:18 }}>{TYPE_MAP[v.type]?.emoji}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:'var(--white)' }}>{v.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>Flat {v.flat} · In at {v.inTime}</div>
                </div>
                <button className="btn btn-sm" style={{ background:'rgba(239,68,68,0.15)', color:'var(--red)', border:'none', marginLeft:6 }}
                  onClick={() => checkOut(v.id)}>
                  <LogOut size={12}/> Out
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
        <button className={`btn btn-sm ${filterType==='All'?'btn-primary':'btn-outline'}`}
          onClick={() => setFilterType('All')}>All Types</button>
        {VISITOR_TYPES.map(t => (
          <button key={t.id}
            className={`btn btn-sm ${filterType===t.id?'btn-primary':''}`}
            style={filterType!==t.id?{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--muted)', whiteSpace:'nowrap' }:{ whiteSpace:'nowrap' }}
            onClick={() => setFilterType(t.id)}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Visitor log table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>🔐 Visitor Log ({displayVisitors.length})</span>
          <button className="btn btn-sm btn-outline" style={{ fontSize:12 }}>📤 Export</button>
        </div>

        {displayVisitors.length === 0 && (
          <div style={{ textAlign:'center', padding:'50px 0', color:'var(--muted)' }}>No visitor records found.</div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Type','Visitor Name','Mobile','Visiting Flat','Meet To','Purpose','In Time','Out Time','Duration','Gate','Status','Action'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayVisitors.map(v => {
                const vt = TYPE_MAP[v.type] || TYPE_MAP.other;
                const duration = getDuration(v.inTime, v.outTime);
                return (
                  <tr key={v.id}>
                    <td>
                      <span title={vt.label} style={{ fontSize:20 }}>{vt.emoji}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:13.5 }}>{v.name}</div>
                      {v.vehicleNo && <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'monospace' }}>{v.vehicleNo}</div>}
                    </td>
                    <td style={{ color:'var(--muted)', fontSize:13 }}>{v.mobile}</td>
                    <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{v.flat}</span></td>
                    <td style={{ fontSize:13 }}>{v.meetTo || '—'}</td>
                    <td style={{ color:'var(--muted)', fontSize:12, maxWidth:140 }}>{v.purpose || '—'}</td>
                    <td>
                      <span style={{ fontSize:13, color:'var(--accent)', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                        <LogIn size={12}/>{v.inTime}
                      </span>
                    </td>
                    <td>
                      {v.outTime
                        ? <span style={{ fontSize:13, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}><LogOut size={12}/>{v.outTime}</span>
                        : <span style={{ fontSize:12, color:'var(--accent)', fontWeight:600 }}>Still inside</span>}
                    </td>
                    <td style={{ fontSize:12, color:'var(--muted)' }}>{duration || '—'}</td>
                    <td style={{ fontSize:12, color:'var(--muted)' }}>{v.gate} Gate</td>
                    <td>
                      <span className={`badge ${v.status==='Inside'?'badge-green':'badge-gray'}`}>
                        {v.status === 'Inside' ? '🟢 Inside' : '✓ Out'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelected(v)}>
                          <Eye size={12}/>
                        </button>
                        {v.status === 'Inside' && (
                          <button className="btn btn-sm" style={{ background:'rgba(239,68,68,0.15)', color:'var(--red)', border:'none' }}
                            onClick={() => checkOut(v.id)}>
                            <LogOut size={12}/> Out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:460 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${TYPE_MAP[selected.type]?.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
                  {TYPE_MAP[selected.type]?.emoji}
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>{selected.name}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{TYPE_MAP[selected.type]?.label}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={20}/></button>
            </div>

            {/* Status badge */}
            <div style={{ marginBottom:16 }}>
              <span className={`badge ${selected.status==='Inside'?'badge-green':'badge-gray'}`} style={{ padding:'6px 14px', fontSize:13 }}>
                {selected.status === 'Inside' ? '🟢 Currently Inside' : '✓ Checked Out'}
              </span>
            </div>

            {/* Details grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
              {[
                { icon:<Phone size={13}/>,    label:'Mobile',         value:selected.mobile },
                { icon:<Home size={13}/>,     label:'Visiting Flat',  value:selected.flat },
                { icon:<User size={13}/>,     label:'Meeting',        value:selected.meetTo || '—' },
                { icon:<Calendar size={13}/>, label:'Date',           value:selected.date },
                { icon:<LogIn size={13}/>,    label:'Check In',       value:selected.inTime },
                { icon:<LogOut size={13}/>,   label:'Check Out',      value:selected.outTime || 'Still inside' },
                { icon:<Clock size={13}/>,    label:'Duration',       value:getDuration(selected.inTime, selected.outTime) || '—' },
                { icon:<Home size={13}/>,     label:'Gate',           value:`${selected.gate} Gate` },
              ].map(f => (
                <div key={f.label} style={{ background:'#F1F5F9', borderRadius:8, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, display:'flex', alignItems:'center', gap:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                    {f.icon} {f.label}
                  </div>
                  <div style={{ fontWeight:600, fontSize:13.5, color:'var(--white)' }}>{f.value}</div>
                </div>
              ))}
            </div>

            {selected.purpose && (
              <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
                <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' }}>Purpose</div>
                <div style={{ fontSize:13.5, color:'var(--text)' }}>{selected.purpose}</div>
              </div>
            )}

            {selected.vehicleNo && (
              <div style={{ background:'#FFF', borderRadius:8, padding:'8px 16px', marginBottom:16, textAlign:'center', border:'3px solid #003580' }}>
                <div style={{ fontSize:9, color:'#003580', fontWeight:700, letterSpacing:'2px' }}>INDIA 🇮🇳</div>
                <div style={{ fontSize:18, fontWeight:900, color:'#000', letterSpacing:'3px', fontFamily:'monospace' }}>{selected.vehicleNo}</div>
              </div>
            )}

            {selected.status === 'Inside' && (
              <button className="btn btn-red" style={{ width:'100%', justifyContent:'center' }}
                onClick={() => checkOut(selected.id)}>
                <LogOut size={14}/> Check Out Now
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
