'use client';
import { useState } from 'react';
import {
  Plus, X, Search, MessageSquare, CheckCircle,
  Clock, AlertCircle, Filter, Send, Paperclip, Eye
} from 'lucide-react';

const CATEGORIES = [
  { id: 'plumbing',   label: 'Plumbing',       emoji: '🔧' },
  { id: 'electrical', label: 'Electrical',      emoji: '⚡' },
  { id: 'lift',       label: 'Lift / Elevator', emoji: '🛗' },
  { id: 'parking',    label: 'Parking',         emoji: '🚗' },
  { id: 'cleaning',   label: 'Cleaning',        emoji: '🧹' },
  { id: 'security',   label: 'Security',        emoji: '🔒' },
  { id: 'noise',      label: 'Noise',           emoji: '🔊' },
  { id: 'water',      label: 'Water Supply',    emoji: '💧' },
  { id: 'internet',   label: 'Internet / CCTV', emoji: '📡' },
  { id: 'other',      label: 'Other',           emoji: '📝' },
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const initialComplaints = [
  {
    id: 1, ticketNo: 'TKT001', flat: 'A-101', name: 'Ramesh Sharma',
    category: 'lift', title: 'Lift not working in Wing A',
    description: 'The lift in Wing A has been non-functional since yesterday evening. Elderly residents are facing difficulty climbing stairs. Please fix urgently.',
    priority: 'Urgent', status: 'Open', date: '14 Apr 2025', time: '9:30 AM',
    replies: [
      { by: 'Admin', msg: 'We have contacted the lift maintenance company. Technician will visit tomorrow morning.', time: '14 Apr, 11:00 AM' }
    ]
  },
  {
    id: 2, ticketNo: 'TKT002', flat: 'B-202', name: 'Suresh Patel',
    category: 'plumbing', title: 'Water leakage in B Wing corridor',
    description: 'There is a water pipe leakage near the staircase on 2nd floor of B wing. Water is spreading on the floor making it slippery.',
    priority: 'High', status: 'In Progress', date: '13 Apr 2025', time: '3:15 PM',
    replies: [
      { by: 'Admin', msg: 'Plumber has been assigned. Will visit today between 4–6 PM.', time: '13 Apr, 4:00 PM' },
      { by: 'Suresh Patel', msg: 'Plumber came but said he needs a special part. Coming back tomorrow.', time: '13 Apr, 6:30 PM' },
    ]
  },
  {
    id: 3, ticketNo: 'TKT003', flat: 'C-301', name: 'Neha Singh',
    category: 'cleaning', title: 'Garbage not collected from C wing',
    description: 'Garbage has not been collected from C wing entrance for 2 days. It is causing a bad smell.',
    priority: 'Medium', status: 'Resolved', date: '10 Apr 2025', time: '8:00 AM',
    replies: [
      { by: 'Admin', msg: 'Cleaning staff has been informed. Will be done by evening.', time: '10 Apr, 9:00 AM' },
      { by: 'Admin', msg: 'Garbage has been cleared. Marking as resolved.', time: '10 Apr, 6:00 PM' },
    ]
  },
  {
    id: 4, ticketNo: 'TKT004', flat: 'D-401', name: 'Meena Iyer',
    category: 'noise', title: 'Loud music from flat D-402 at night',
    description: 'Flat D-402 plays very loud music after 11 PM on weekdays. This is disturbing our sleep. Please speak to them.',
    priority: 'Medium', status: 'Open', date: '12 Apr 2025', time: '11:45 PM',
    replies: []
  },
  {
    id: 5, ticketNo: 'TKT005', flat: 'A-102', name: 'Priya Mehta',
    category: 'water', title: 'No water supply in morning',
    description: 'Water supply is very low pressure in the morning between 7–9 AM. Barely enough for daily use.',
    priority: 'High', status: 'Closed', date: '8 Apr 2025', time: '9:00 AM',
    replies: [
      { by: 'Admin', msg: 'This has been escalated to the water pump operator. Motor timing has been adjusted.', time: '8 Apr, 12:00 PM' },
      { by: 'Admin', msg: 'Issue resolved. Motor now runs from 5:30 AM. Please let us know if issue persists.', time: '9 Apr, 9:00 AM' },
    ]
  },
];

const STATUS_CONFIG = {
  Open:        { color: 'var(--red)',     badge: 'badge-red',   icon: <AlertCircle size={13}/> },
  'In Progress':{ color: 'var(--gold)',   badge: 'badge-gold',  icon: <Clock size={13}/> },
  Resolved:    { color: 'var(--accent)',  badge: 'badge-green', icon: <CheckCircle size={13}/> },
  Closed:      { color: 'var(--muted)',   badge: 'badge-gray',  icon: <CheckCircle size={13}/> },
};

const PRIORITY_COLOR = {
  Low:    'var(--muted)',
  Medium: 'var(--accent2)',
  High:   'var(--gold)',
  Urgent: 'var(--red)',
};

export default function Complaints() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selected, setSelected]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [form, setForm] = useState({
    flat: '', name: '', category: 'plumbing', title: '',
    description: '', priority: 'Medium',
  });

  const filtered = complaints.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.title.toLowerCase().includes(q) ||
      c.flat.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.ticketNo.includes(q);
    const matchStatus   = filterStatus === 'All'   || c.status === filterStatus;
    const matchCategory = filterCategory === 'All' || c.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const stats = {
    open:       complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
    total:      complaints.length,
  };

  const getCatEmoji = id => CATEGORIES.find(c => c.id === id)?.emoji || '📝';
  const getCatLabel = id => CATEGORIES.find(c => c.id === id)?.label || 'Other';

  const submitComplaint = () => {
    if (!form.flat || !form.title || !form.description) return;
    const next = complaints.length + 1;
    const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    setComplaints([{
      ...form, id: Date.now(),
      ticketNo: `TKT${String(next).padStart(3,'0')}`,
      status: 'Open', date: today,
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      replies: [],
    }, ...complaints]);
    setForm({ flat:'', name:'', category:'plumbing', title:'', description:'', priority:'Medium' });
    setShowForm(false);
  };

  const sendReply = (id) => {
    if (!replyText.trim()) return;
    setComplaints(complaints.map(c => c.id === id
      ? { ...c, replies: [...c.replies, { by: 'Admin', msg: replyText.trim(), time: 'Just now' }] }
      : c
    ));
    if (selected?.id === id) {
      setSelected(prev => ({
        ...prev,
        replies: [...prev.replies, { by: 'Admin', msg: replyText.trim(), time: 'Just now' }]
      }));
    }
    setReplyText('');
  };

  const changeStatus = (id, status) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', maxWidth:280 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search ticket, flat, name..." value={search}
            onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        {['All','Open','In Progress','Resolved','Closed'].map(s=>(
          <button key={s} className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-outline'}`}
            onClick={()=>setFilterStatus(s)}>{s}</button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}
          onClick={()=>setShowForm(!showForm)}>
          <Plus size={14}/> Raise Complaint
        </button>
      </div>

      {/* New complaint form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>🎫 Raise New Complaint</span>
            <button onClick={()=>setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={18}/></button>
          </div>
          <div className="form-grid-4" style={{ marginBottom:14 }}>
            <div className="form-row">
              <label className="field-label">Flat No.</label>
              <input placeholder="A-101" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Your Name</label>
              <input placeholder="Resident Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Priority</label>
              <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                {PRIORITIES.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-row col-span-2">
              <label className="field-label">Complaint Title</label>
              <input placeholder="Short description of the issue" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            </div>
            <div className="form-row col-span-2" style={{ gridColumn:'span 4' }}>
              <label className="field-label">Detailed Description</label>
              <textarea placeholder="Describe the problem in detail..." style={{ minHeight:80 }}
                value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-primary" onClick={submitComplaint}>🎫 Submit Complaint</button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Open',       count:stats.open,       color:'var(--red)',     icon:'🔴' },
          { label:'In Progress',count:stats.inProgress, color:'var(--gold)',    icon:'⏳' },
          { label:'Resolved',   count:stats.resolved,   color:'var(--accent)',  icon:'✅' },
          { label:'Total',      count:stats.total,      color:'var(--accent2)', icon:'🎫' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ fontSize:24, color:s.color }}>{s.count}</div>
            <div className="stat-label">{s.label} Complaints</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:18, overflowX:'auto', paddingBottom:4 }}>
        <button className={`btn btn-sm ${filterCategory==='All'?'btn-primary':'btn-outline'}`}
          onClick={()=>setFilterCategory('All')}>All Categories</button>
        {CATEGORIES.map(c=>(
          <button key={c.id}
            className={`btn btn-sm ${filterCategory===c.id?'btn-primary':''}`}
            style={filterCategory!==c.id?{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--muted)', whiteSpace:'nowrap' }:{ whiteSpace:'nowrap' }}
            onClick={()=>setFilterCategory(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Complaints list */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>🎫 All Complaints ({filtered.length})</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'50px 0', color:'var(--muted)' }}>No complaints found.</div>
        )}
        {filtered.map(c => {
          const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.Open;
          return (
            <div key={c.id} style={{
              display:'flex', alignItems:'flex-start', gap:14,
              padding:'16px 22px', borderBottom:'1px solid rgba(30,45,69,0.4)',
              cursor:'pointer', transition:'background 0.12s'
            }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              onClick={()=>setSelected(c)}>
              <div style={{ fontSize:28, flexShrink:0, marginTop:2 }}>{getCatEmoji(c.category)}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:6 }}>
                  <div>
                    <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>{c.title}</span>
                    <span style={{ fontSize:11, color:'var(--muted)', marginLeft:10 }}>{c.ticketNo}</span>
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <span className="badge" style={{ background:`${PRIORITY_COLOR[c.priority]}22`, color:PRIORITY_COLOR[c.priority] }}>{c.priority}</span>
                    <span className={`badge ${sc.badge}`}>{c.status}</span>
                  </div>
                </div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:8, lineHeight:1.5 }}>{c.description.slice(0,100)}...</div>
                <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--muted)' }}>
                  <span>🏠 {c.flat} · {c.name}</span>
                  <span>📂 {getCatLabel(c.category)}</span>
                  <span>📅 {c.date} {c.time}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><MessageSquare size={12}/> {c.replies.length} replies</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail / Reply modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>{ setSelected(null); setReplyText(''); }}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:600, maxHeight:'90vh', overflowY:'auto' }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:22 }}>{getCatEmoji(selected.category)}</span>
                  <span style={{ fontWeight:800, fontSize:17, color:'var(--white)' }}>{selected.title}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>
                  {selected.ticketNo} · {selected.flat} · {selected.name} · {selected.date}
                </div>
              </div>
              <button onClick={()=>{ setSelected(null); setReplyText(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', flexShrink:0 }}><X size={20}/></button>
            </div>

            {/* Status + Priority badges */}
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              <span className={`badge ${STATUS_CONFIG[selected.status]?.badge}`} style={{ padding:'5px 12px', fontSize:12 }}>{selected.status}</span>
              <span className="badge" style={{ padding:'5px 12px', fontSize:12, background:`${PRIORITY_COLOR[selected.priority]}22`, color:PRIORITY_COLOR[selected.priority] }}>{selected.priority} Priority</span>
              <span className="badge badge-blue" style={{ padding:'5px 12px', fontSize:12 }}>{getCatLabel(selected.category)}</span>
            </div>

            {/* Description */}
            <div style={{ background:'#F1F5F9', borderRadius:10, padding:'14px 16px', marginBottom:16, fontSize:13.5, lineHeight:1.7, color:'var(--text)' }}>
              {selected.description}
            </div>

            {/* Change status */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Update Status</div>
              <div style={{ display:'flex', gap:8 }}>
                {['Open','In Progress','Resolved','Closed'].map(s=>(
                  <button key={s} onClick={()=>changeStatus(selected.id,s)}
                    className="btn btn-sm"
                    style={{ fontSize:11.5,
                      background: selected.status===s ? STATUS_CONFIG[s]?.color : 'rgba(255,255,255,0.05)',
                      color: selected.status===s ? (s==='Closed'?'#fff':'var(--bg)') : 'var(--muted)',
                      border: `1px solid ${selected.status===s ? STATUS_CONFIG[s]?.color : 'var(--border)'}`,
                    }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Replies thread */}
            {selected.replies.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>
                  Conversation ({selected.replies.length})
                </div>
                {selected.replies.map((r, i) => (
                  <div key={i} style={{
                    display:'flex', gap:10, marginBottom:10,
                    flexDirection: r.by === 'Admin' ? 'row-reverse' : 'row'
                  }}>
                    <div style={{
                      width:32, height:32, borderRadius:'50%', flexShrink:0,
                      background: r.by==='Admin' ? 'var(--accent)' : 'var(--accent2)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:800, color:'var(--bg)'
                    }}>{r.by[0]}</div>
                    <div style={{ maxWidth:'75%' }}>
                      <div style={{
                        background: r.by==='Admin' ? 'rgba(0,198,167,0.12)' : 'rgba(59,130,246,0.12)',
                        border: `1px solid ${r.by==='Admin' ? 'rgba(0,198,167,0.25)' : 'rgba(59,130,246,0.25)'}`,
                        borderRadius: r.by==='Admin' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                        padding:'10px 14px', fontSize:13, lineHeight:1.6, color:'var(--text)'
                      }}>{r.msg}</div>
                      <div style={{ fontSize:11, color:'var(--muted)', marginTop:4, textAlign: r.by==='Admin'?'right':'left' }}>
                        {r.by} · {r.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            {selected.status !== 'Closed' && (
              <div>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Admin Reply</div>
                <div style={{ display:'flex', gap:8 }}>
                  <textarea
                    placeholder="Type your response to the resident..."
                    value={replyText}
                    onChange={e=>setReplyText(e.target.value)}
                    style={{ flex:1, minHeight:70, resize:'vertical' }}
                  />
                </div>
                <div style={{ display:'flex', gap:8, marginTop:8 }}>
                  <button className="btn btn-primary" onClick={()=>sendReply(selected.id)} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Send size={14}/> Send Reply
                  </button>
                  <button className="btn btn-sm" style={{ background:'rgba(0,198,167,0.1)', color:'var(--accent)', border:'none' }}
                    onClick={()=>{ sendReply(selected.id); changeStatus(selected.id,'Resolved'); }}>
                    <CheckCircle size={14}/> Reply & Resolve
                  </button>
                  <button className="btn btn-sm" style={{ background:'rgba(245,158,11,0.1)', color:'var(--gold)', border:'none' }}
                    onClick={()=>changeStatus(selected.id,'In Progress')}>
                    <Clock size={14}/> Mark In Progress
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
