'use client';
import { useState } from 'react';
import { Plus, X, Phone, Mail, Edit2, Trash2, Search, Star, Award, Shield, Users } from 'lucide-react';

const ROLES = [
  { id: 'chairman',      label: 'Chairman',           emoji: '👑', color: '#D97706', desc: 'Head of the society committee' },
  { id: 'secretary',     label: 'Secretary',          emoji: '📋', color: '#2563EB', desc: 'Manages records and communications' },
  { id: 'treasurer',     label: 'Treasurer',          emoji: '💰', color: '#16A34A', desc: 'Handles all financial matters' },
  { id: 'vice_chairman', label: 'Vice Chairman',      emoji: '🏅', color: '#7C3AED', desc: 'Assists the Chairman' },
  { id: 'joint_secretary',label:'Joint Secretary',    emoji: '📝', color: '#0891B2', desc: 'Assists the Secretary' },
  { id: 'member',        label: 'Committee Member',   emoji: '👤', color: '#64748B', desc: 'General committee member' },
];

const TENURES = ['2024–2026', '2022–2024', '2020–2022'];

const initialMembers = [
  { id: 1, name: 'Rajesh Kumar',    role: 'chairman',       flat: 'A-101', phone: '9820012345', email: 'rajesh@email.com',  tenure: '2024–2026', since: '1 Apr 2024', bio: 'Retired bank manager with 15 years of society management experience.', active: true  },
  { id: 2, name: 'Priya Sharma',    role: 'secretary',      flat: 'B-201', phone: '9876543210', email: 'priya@email.com',   tenure: '2024–2026', since: '1 Apr 2024', bio: 'IT professional, manages all society documentation and communications.', active: true  },
  { id: 3, name: 'Suresh Mehta',    role: 'treasurer',      flat: 'C-301', phone: '9765432198', email: 'suresh@email.com',  tenure: '2024–2026', since: '1 Apr 2024', bio: 'Chartered accountant handling society finances and audits.', active: true  },
  { id: 4, name: 'Anjali Verma',    role: 'vice_chairman',  flat: 'D-401', phone: '9654321987', email: 'anjali@email.com',  tenure: '2024–2026', since: '1 Apr 2024', bio: 'Actively manages society events and resident welfare.', active: true  },
  { id: 5, name: 'Vikram Joshi',    role: 'joint_secretary',flat: 'A-202', phone: '9543219876', email: 'vikram@email.com',  tenure: '2024–2026', since: '1 Apr 2024', bio: 'Handles day-to-day administrative tasks.', active: true  },
  { id: 6, name: 'Meena Iyer',      role: 'member',         flat: 'B-302', phone: '9432198765', email: 'meena@email.com',   tenure: '2024–2026', since: '1 Apr 2024', bio: 'Focuses on garden and common area maintenance.', active: true  },
  { id: 7, name: 'Arjun Nair',      role: 'member',         flat: 'C-102', phone: '9321987654', email: 'arjun@email.com',   tenure: '2024–2026', since: '1 Apr 2024', bio: 'Manages parking and security related issues.', active: true  },
  { id: 8, name: 'Deepa Patil',     role: 'member',         flat: 'D-202', phone: '9210987643', email: 'deepa@email.com',   tenure: '2024–2026', since: '1 Apr 2024', bio: 'Handles cultural events and community programmes.', active: true  },
];

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.id, r]));

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export default function Committee() {
  const [members, setMembers]       = useState(initialMembers);
  const [search, setSearch]         = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterTenure, setFilterTenure] = useState('2024–2026');
  const [showForm, setShowForm]     = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [selected, setSelected]     = useState(null);
  const [view, setView]             = useState('cards'); // cards | table
  const [form, setForm] = useState({
    name: '', role: 'member', flat: '', phone: '', email: '',
    tenure: '2024–2026', since: '', bio: '',
  });

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.name.toLowerCase().includes(q) || m.flat.toLowerCase().includes(q) || m.role.includes(q);
    const matchRole   = filterRole === 'All' || m.role === filterRole;
    const matchTenure = m.tenure === filterTenure;
    return matchSearch && matchRole && matchTenure && m.active;
  });

  // Sort by role priority
  const roleOrder = ['chairman','vice_chairman','secretary','joint_secretary','treasurer','member'];
  const sorted = [...filtered].sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

  const openForm = (item = null) => {
    if (item) { setForm({ ...item }); setEditItem(item); }
    else { setForm({ name:'', role:'member', flat:'', phone:'', email:'', tenure:'2024–2026', since:'', bio:'' }); setEditItem(null); }
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.flat) return;
    if (editItem) {
      setMembers(members.map(m => m.id === editItem.id ? { ...m, ...form } : m));
    } else {
      setMembers([...members, { ...form, id: Date.now(), active: true }]);
    }
    setShowForm(false); setEditItem(null);
  };

  const remove = (id) => {
    setMembers(members.map(m => m.id === id ? { ...m, active: false } : m));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', maxWidth:260 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search name or flat..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        <select value={filterTenure} onChange={e => setFilterTenure(e.target.value)} style={{ maxWidth:160 }}>
          {TENURES.map(t => <option key={t}>{t}</option>)}
        </select>
        <div style={{ display:'flex', gap:6 }}>
          <button className={`btn btn-sm ${view==='cards'?'btn-primary':'btn-outline'}`} onClick={() => setView('cards')}>🪪 Cards</button>
          <button className={`btn btn-sm ${view==='table'?'btn-primary':'btn-outline'}`} onClick={() => setView('table')}>📋 Table</button>
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => openForm()}>
          <Plus size={14}/> Add Member
        </button>
      </div>

      {/* Role filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        <button className={`btn btn-sm ${filterRole==='All'?'btn-primary':'btn-outline'}`} onClick={() => setFilterRole('All')}>
          All Roles
        </button>
        {ROLES.map(r => (
          <button key={r.id}
            className={`btn btn-sm ${filterRole===r.id?'btn-primary':''}`}
            style={filterRole!==r.id?{ background:'rgba(255,255,255,0.7)', border:`1.5px solid #E2E8F0`, color:'var(--muted)', whiteSpace:'nowrap' }:{ whiteSpace:'nowrap' }}
            onClick={() => setFilterRole(r.id)}>
            {r.emoji} {r.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Members',   count: members.filter(m => m.active && m.tenure === filterTenure).length,  color:'var(--accent)',  icon:'👥' },
          { label:'Current Tenure',  count: filterTenure,                                                        color:'var(--gold)',    icon:'📅' },
          { label:'Key Positions',   count: members.filter(m => m.active && ['chairman','secretary','treasurer'].includes(m.role) && m.tenure === filterTenure).length, color:'var(--accent2)', icon:'⭐' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex:1, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.count}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>{editItem ? '✏️ Edit Member' : '👤 Add Committee Member'}</span>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={18}/></button>
          </div>
          <div className="form-grid-4" style={{ marginBottom:14 }}>
            <div className="form-row col-span-2">
              <label className="field-label">Full Name</label>
              <input placeholder="Member full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Role / Position</label>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.label}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Flat No.</label>
              <input placeholder="A-101" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Phone</label>
              <input placeholder="9820012345" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Email</label>
              <input type="email" placeholder="email@domain.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Tenure</label>
              <select value={form.tenure} onChange={e=>setForm({...form,tenure:e.target.value})}>
                {TENURES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Member Since</label>
              <input placeholder="1 Apr 2024" value={form.since} onChange={e=>setForm({...form,since:e.target.value})}/>
            </div>
            <div className="form-row" style={{ gridColumn:'span 4' }}>
              <label className="field-label">Short Bio</label>
              <textarea placeholder="Brief description of this member's role and background..." style={{ minHeight:70 }}
                value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-primary" onClick={save}>
            {editItem ? '✏️ Update Member' : '➕ Add Member'}
          </button>
        </div>
      )}

      {/* CARD VIEW */}
      {view === 'cards' && (
        <div>
          {/* Top 3 key positions highlighted */}
          {filterRole === 'All' && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>Key Positions</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {sorted.filter(m => ['chairman','secretary','treasurer'].includes(m.role)).map(m => {
                  const role = ROLE_MAP[m.role];
                  return (
                    <div key={m.id} onClick={() => setSelected(m)}
                      style={{ background:'var(--card)', border:`2px solid ${role.color}30`, borderRadius:16, padding:'24px 20px', textAlign:'center', cursor:'pointer', transition:'all 0.15s', boxShadow:`0 2px 12px ${role.color}15` }}
                      onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                      {/* Avatar */}
                      <div style={{ width:68, height:68, borderRadius:'50%', background:`${role.color}18`, border:`3px solid ${role.color}40`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:22, fontWeight:800, color:role.color }}>
                        {getInitials(m.name)}
                      </div>
                      <div style={{ fontSize:18, fontWeight:800, color:'var(--white)', marginBottom:4 }}>{m.name}</div>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${role.color}15`, color:role.color, borderRadius:99, padding:'4px 12px', fontSize:12, fontWeight:700, marginBottom:10 }}>
                        <span>{role.emoji}</span> {role.label}
                      </div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12, lineHeight:1.5 }}>{m.bio?.slice(0,70)}...</div>
                      <div style={{ display:'flex', justifyContent:'center', gap:16, fontSize:12, color:'var(--muted)' }}>
                        <span>🏠 {m.flat}</span>
                        <span>📅 {m.tenure}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rest of members */}
          {(filterRole === 'All' ? sorted.filter(m => !['chairman','secretary','treasurer'].includes(m.role)) : sorted).length > 0 && (
            <div>
              {filterRole === 'All' && <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>Other Members</div>}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                {(filterRole === 'All' ? sorted.filter(m => !['chairman','secretary','treasurer'].includes(m.role)) : sorted).map(m => {
                  const role = ROLE_MAP[m.role];
                  return (
                    <div key={m.id} onClick={() => setSelected(m)}
                      style={{ background:'var(--card)', border:`1px solid #E2E8F0`, borderRadius:14, padding:'18px 16px', textAlign:'center', cursor:'pointer', transition:'all 0.15s', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=role.color; }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#E2E8F0'; }}>
                      <div style={{ width:52, height:52, borderRadius:'50%', background:`${role.color}15`, border:`2px solid ${role.color}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:16, fontWeight:800, color:role.color }}>
                        {getInitials(m.name)}
                      </div>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--white)', marginBottom:4 }}>{m.name}</div>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${role.color}12`, color:role.color, borderRadius:99, padding:'3px 10px', fontSize:11, fontWeight:700, marginBottom:8 }}>
                        {role.emoji} {role.label}
                      </div>
                      <div style={{ fontSize:12, color:'var(--muted)' }}>🏠 Flat {m.flat}</div>
                      <div style={{ display:'flex', gap:8, marginTop:10, justifyContent:'center' }}>
                        <button className="btn btn-sm" style={{ background:`${role.color}12`, color:role.color, border:'none', padding:'5px 10px', fontSize:11 }}
                          onClick={e => { e.stopPropagation(); openForm(m); }}>
                          <Edit2 size={11}/>
                        </button>
                        <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none', padding:'5px 10px', fontSize:11 }}
                          onClick={e => { e.stopPropagation(); remove(m.id); }}>
                          <Trash2 size={11}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>👥 Committee Members ({sorted.length})</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{['Name','Role','Flat','Phone','Email','Tenure','Since','Actions'].map(h=><th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {sorted.map(m => {
                  const role = ROLE_MAP[m.role];
                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', background:`${role.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:role.color, flexShrink:0 }}>
                            {getInitials(m.name)}
                          </div>
                          <span style={{ fontWeight:600 }}>{m.name}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${role.color}12`, color:role.color, borderRadius:99, padding:'3px 10px', fontSize:12, fontWeight:700 }}>
                          {role.emoji} {role.label}
                        </span>
                      </td>
                      <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{m.flat}</span></td>
                      <td style={{ fontSize:13, color:'var(--muted)' }}>{m.phone}</td>
                      <td style={{ fontSize:13, color:'var(--muted)' }}>{m.email}</td>
                      <td><span className="tag">{m.tenure}</span></td>
                      <td style={{ fontSize:13, color:'var(--muted)' }}>{m.since}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setSelected(m)}>View</button>
                          <button className="btn btn-sm" style={{ background:`${role.color}12`, color:role.color, border:'none' }} onClick={() => openForm(m)}><Edit2 size={12}/></button>
                          <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none' }} onClick={() => remove(m.id)}><Trash2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sorted.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>No committee members found.</div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:460 }}>
            {(() => {
              const role = ROLE_MAP[selected.role];
              return (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                    <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                      <div style={{ width:60, height:60, borderRadius:'50%', background:`${role.color}18`, border:`3px solid ${role.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:role.color }}>
                        {getInitials(selected.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>{selected.name}</div>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${role.color}15`, color:role.color, borderRadius:99, padding:'3px 12px', fontSize:12, fontWeight:700, marginTop:4 }}>
                          {role.emoji} {role.label}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={20}/></button>
                  </div>

                  {selected.bio && (
                    <div style={{ background:'#F8FAFC', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13.5, lineHeight:1.7, color:'var(--text)', borderLeft:`3px solid ${role.color}` }}>
                      {selected.bio}
                    </div>
                  )}

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                    {[
                      { icon:<Phone size={13}/>,  label:'Phone',       value:selected.phone },
                      { icon:<Mail size={13}/>,   label:'Email',       value:selected.email },
                      { icon:<span style={{fontSize:13}}>🏠</span>, label:'Flat', value:selected.flat },
                      { icon:<span style={{fontSize:13}}>📅</span>, label:'Tenure', value:selected.tenure },
                      { icon:<span style={{fontSize:13}}>🗓️</span>, label:'Since', value:selected.since || '—' },
                      { icon:<span style={{fontSize:13}}>ℹ️</span>,  label:'Role Desc', value:role.desc },
                    ].map(f => (
                      <div key={f.label} style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 14px', border:'1px solid var(--border)' }}>
                        <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, display:'flex', alignItems:'center', gap:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{f.icon} {f.label}</div>
                        <div style={{ fontWeight:600, fontSize:13, color:'var(--white)', wordBreak:'break-all' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:'flex', gap:10 }}>
                    <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
                      onClick={() => { openForm(selected); setSelected(null); }}>
                      <Edit2 size={14}/> Edit Details
                    </button>
                    <a href={`tel:${selected.phone}`} className="btn btn-sm" style={{ background:`${role.color}15`, color:role.color, border:'none', justifyContent:'center', padding:'9px 16px' }}>
                      <Phone size={13}/> Call
                    </a>
                    <a href={`mailto:${selected.email}`} className="btn btn-sm" style={{ background:'rgba(37,99,235,0.1)', color:'var(--accent)', border:'none', justifyContent:'center', padding:'9px 16px' }}>
                      <Mail size={13}/> Email
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
