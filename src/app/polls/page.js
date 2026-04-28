'use client';
import { useState } from 'react';
import { Plus, X, Search, CheckCircle, Clock, BarChart2, Users, Lock, Unlock, Trash2, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'maintenance', label: 'Maintenance',   emoji: '🔧' },
  { id: 'security',    label: 'Security',       emoji: '🔒' },
  { id: 'events',      label: 'Events',         emoji: '🎉' },
  { id: 'rules',       label: 'Society Rules',  emoji: '📜' },
  { id: 'facility',    label: 'Facility',       emoji: '🏢' },
  { id: 'general',     label: 'General',        emoji: '📋' },
];

const initialPolls = [
  {
    id: 1,
    title: 'Should we install CCTV cameras at all entry points?',
    description: 'The security committee has proposed installing 8 CCTV cameras at main gate, side gate, lift lobbies and parking area. Monthly maintenance cost will be ₹500 per flat.',
    category: 'security',
    options: [
      { id: 'a', label: 'Yes, install immediately',   votes: 28 },
      { id: 'b', label: 'Yes, but only at main gate', votes: 8  },
      { id: 'c', label: 'No, not required',           votes: 4  },
      { id: 'd', label: 'Need more information',      votes: 4  },
    ],
    totalVotes: 44,
    status: 'Active',
    createdBy: 'Society Secretary',
    startDate: '10 Apr 2025',
    endDate: '30 Apr 2025',
    category_id: 'security',
    userVoted: null,
  },
  {
    id: 2,
    title: 'Which day should we hold the Annual Sports Day 2025?',
    description: 'Please vote for your preferred date for the Annual Sports Day. The event will be held in the society compound from 8 AM to 6 PM.',
    category: 'events',
    options: [
      { id: 'a', label: 'Saturday, 10 May',  votes: 18 },
      { id: 'b', label: 'Sunday, 11 May',    votes: 22 },
      { id: 'c', label: 'Saturday, 17 May',  votes: 6  },
      { id: 'd', label: 'Sunday, 18 May',    votes: 2  },
    ],
    totalVotes: 48,
    status: 'Active',
    createdBy: 'Events Committee',
    startDate: '12 Apr 2025',
    endDate: '20 Apr 2025',
    category_id: 'events',
    userVoted: 'b',
  },
  {
    id: 3,
    title: 'Should maintenance charges be increased for FY 2025–26?',
    description: 'Due to rising costs of electricity, water, security, and housekeeping, the committee proposes revising maintenance from ₹2,500 to ₹3,000 per month.',
    category: 'maintenance',
    options: [
      { id: 'a', label: 'Yes, approve ₹3,000',        votes: 30 },
      { id: 'b', label: 'Yes, but only ₹2,750',       votes: 10 },
      { id: 'c', label: 'No, keep it at ₹2,500',      votes: 6  },
      { id: 'd', label: 'Discuss in AGM first',        votes: 2  },
    ],
    totalVotes: 48,
    status: 'Closed',
    createdBy: 'Treasurer',
    startDate: '1 Mar 2025',
    endDate: '31 Mar 2025',
    category_id: 'maintenance',
    userVoted: 'a',
    winner: 'a',
  },
  {
    id: 4,
    title: 'Should pets be allowed in the lift?',
    description: 'Some residents have raised concerns about pets in lifts. Please share your opinion on this matter.',
    category: 'rules',
    options: [
      { id: 'a', label: 'Yes, allowed anytime',              votes: 12 },
      { id: 'b', label: 'Yes, but must be in a carrier',    votes: 20 },
      { id: 'c', label: 'No, pets should use stairs',       votes: 14 },
    ],
    totalVotes: 46,
    status: 'Closed',
    createdBy: 'Society Admin',
    startDate: '1 Feb 2025',
    endDate: '14 Feb 2025',
    category_id: 'rules',
    userVoted: 'b',
    winner: 'b',
  },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

const getPercent = (votes, total) => total === 0 ? 0 : Math.round((votes / total) * 100);

const BAR_COLORS = ['var(--accent)', 'var(--accent2)', 'var(--gold)', 'var(--red)'];

export default function Polls() {
  const [polls, setPolls]           = useState(initialPolls);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat]   = useState('All');
  const [showForm, setShowForm]     = useState(false);
  const [selected, setSelected]     = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', category_id: 'general',
    endDate: '', options: ['', '', ''],
    createdBy: 'Society Admin',
  });

  const filtered = polls.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.title.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchCat    = filterCat === 'All'    || p.category_id === filterCat;
    return matchSearch && matchStatus && matchCat;
  });

  const castVote = (pollId, optionId) => {
    setPolls(polls.map(p => {
      if (p.id !== pollId || p.userVoted || p.status !== 'Active') return p;
      const updatedOptions = p.options.map(o =>
        o.id === optionId ? { ...o, votes: o.votes + 1 } : o
      );
      return { ...p, options: updatedOptions, totalVotes: p.totalVotes + 1, userVoted: optionId };
    }));
    if (selected?.id === pollId) {
      setSelected(prev => {
        const updatedOptions = prev.options.map(o =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        return { ...prev, options: updatedOptions, totalVotes: prev.totalVotes + 1, userVoted: optionId };
      });
    }
  };

  const closePoll = (id) => {
    setPolls(polls.map(p => {
      if (p.id !== id) return p;
      const winner = [...p.options].sort((a, b) => b.votes - a.votes)[0].id;
      return { ...p, status: 'Closed', winner };
    }));
  };

  const createPoll = () => {
    const validOpts = form.options.filter(o => o.trim());
    if (!form.title || validOpts.length < 2) return;
    const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    const newPoll = {
      ...form,
      id: Date.now(),
      options: validOpts.map((label, i) => ({ id: String.fromCharCode(97 + i), label, votes: 0 })),
      totalVotes: 0,
      status: 'Active',
      startDate: today,
      userVoted: null,
      category: form.category_id,
    };
    setPolls([newPoll, ...polls]);
    setForm({ title:'', description:'', category_id:'general', endDate:'', options:['','',''], createdBy:'Society Admin' });
    setShowForm(false);
  };

  const deletePoll = (id) => {
    setPolls(polls.filter(p => p.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const stats = {
    active: polls.filter(p => p.status === 'Active').length,
    closed: polls.filter(p => p.status === 'Closed').length,
    totalVotes: polls.reduce((s, p) => s + p.totalVotes, 0),
  };

  const PollCard = ({ poll, compact = false }) => {
    const cat     = CAT_MAP[poll.category_id] || CAT_MAP.general;
    const leading = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
    const isActive = poll.status === 'Active';

    return (
      <div className="card" style={{ marginBottom:0, cursor:'pointer', transition:'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.transform='translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; }}
        onClick={() => setSelected(poll)}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:20 }}>{cat.emoji}</span>
            <span className="badge" style={{ background:`rgba(37,99,235,0.1)`, color:'var(--accent)', fontSize:11 }}>{cat.label}</span>
          </div>
          <span className={`badge ${isActive ? 'badge-green' : 'badge-gray'}`}>
            {isActive ? '🟢 Active' : '🔒 Closed'}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontWeight:700, fontSize:14.5, color:'var(--white)', marginBottom:6, lineHeight:1.4 }}>{poll.title}</div>

        {/* Options with bars */}
        <div style={{ marginBottom:12 }}>
          {poll.options.map((opt, i) => {
            const pct     = getPercent(opt.votes, poll.totalVotes);
            const isWinner = poll.winner === opt.id;
            const isVoted  = poll.userVoted === opt.id;
            return (
              <div key={opt.id} style={{ marginBottom:7 }}
                onClick={e => { e.stopPropagation(); if (isActive && !poll.userVoted) castVote(poll.id, opt.id); }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3, fontSize:12.5,
                  color: isWinner ? BAR_COLORS[i % 4] : isVoted ? 'var(--text)' : 'var(--muted)',
                  fontWeight: isWinner || isVoted ? 700 : 400, cursor: isActive && !poll.userVoted ? 'pointer' : 'default',
                }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {isWinner && <span style={{ fontSize:12 }}>🏆</span>}
                    {isVoted && !isWinner && <span style={{ fontSize:12 }}>✓</span>}
                    {opt.label}
                  </span>
                  <span style={{ fontWeight:700 }}>{pct}%</span>
                </div>
                <div style={{ height:7, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', width:`${pct}%`, borderRadius:99,
                    background: isWinner ? BAR_COLORS[i % 4] : isVoted ? BAR_COLORS[i % 4] : '#CBD5E1',
                    transition:'width 0.5s ease', opacity: isWinner || isVoted ? 1 : 0.6,
                  }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid var(--border)', fontSize:12, color:'var(--muted)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><Users size={12}/>{poll.totalVotes} votes</span>
          {isActive && !poll.userVoted && (
            <span style={{ color:'var(--accent)', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              Tap option to vote <ChevronRight size={12}/>
            </span>
          )}
          {poll.userVoted && <span style={{ color:'var(--accent)', fontWeight:600 }}>✓ You voted</span>}
          {!isActive && <span style={{ color:'var(--muted)' }}>Ended {poll.endDate}</span>}
        </div>

        {isActive && !poll.userVoted && (
          <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(37,99,235,0.06)', borderRadius:8, fontSize:12, color:'var(--accent)' }}>
            📢 Click any option above to cast your vote
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', maxWidth:280 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search polls..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        {['All','Active','Closed'].map(s => (
          <button key={s} className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-outline'}`}
            onClick={() => setFilterStatus(s)}>
            {s === 'Active' ? '🟢 Active' : s === 'Closed' ? '🔒 Closed' : 'All'}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => setShowForm(!showForm)}>
          <Plus size={14}/> Create Poll
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        <button className={`btn btn-sm ${filterCat==='All'?'btn-primary':'btn-outline'}`} onClick={() => setFilterCat('All')}>All Categories</button>
        {CATEGORIES.map(c => (
          <button key={c.id}
            className={`btn btn-sm ${filterCat===c.id?'btn-primary':''}`}
            style={filterCat!==c.id?{ background:'rgba(255,255,255,0.7)', border:'1.5px solid #E2E8F0', color:'var(--muted)', whiteSpace:'nowrap' }:{ whiteSpace:'nowrap' }}
            onClick={() => setFilterCat(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[
          { label:'Active Polls',  value: stats.active,     color:'var(--accent)',  icon:'🟢' },
          { label:'Closed Polls',  value: stats.closed,     color:'var(--muted)',   icon:'🔒' },
          { label:'Total Votes',   value: stats.totalVotes, color:'var(--accent2)', icon:'🗳️' },
        ].map((s,i) => (
          <div key={i} className="stat-card" style={{ flex:1, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Create poll form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>📊 Create New Poll</span>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={18}/></button>
          </div>
          <div className="form-grid-3" style={{ marginBottom:14 }}>
            <div className="form-row" style={{ gridColumn:'span 3' }}>
              <label className="field-label">Poll Question</label>
              <input placeholder="e.g. Should we install CCTV cameras at all entry points?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            </div>
            <div className="form-row" style={{ gridColumn:'span 3' }}>
              <label className="field-label">Description (optional)</label>
              <textarea placeholder="Provide more context about this poll..." style={{ minHeight:70 }} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Category</label>
              <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">End Date</label>
              <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div className="form-row">
              <label className="field-label">Created By</label>
              <input value={form.createdBy} onChange={e=>setForm({...form,createdBy:e.target.value})}/>
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label className="field-label">Poll Options (minimum 2)</label>
            {form.options.map((opt, i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
                <div style={{ width:26, height:26, borderRadius:6, background:'rgba(37,99,235,0.1)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {String.fromCharCode(65+i)}
                </div>
                <input placeholder={`Option ${i+1}`} value={opt} onChange={e=>{const o=[...form.options];o[i]=e.target.value;setForm({...form,options:o});}}/>
                {form.options.length > 2 && (
                  <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', padding:4 }}
                    onClick={() => setForm({...form, options:form.options.filter((_,j)=>j!==i)})}>
                    <X size={16}/>
                  </button>
                )}
              </div>
            ))}
            {form.options.length < 5 && (
              <button className="btn btn-sm btn-outline" style={{ marginTop:4 }}
                onClick={() => setForm({...form, options:[...form.options,'']})}>
                <Plus size={13}/> Add Option
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={createPoll}>📊 Launch Poll</button>
        </div>
      )}

      {/* Active polls */}
      {filtered.filter(p => p.status === 'Active').length > 0 && (filterStatus === 'All' || filterStatus === 'Active') && (
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>🟢 Active Polls</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {filtered.filter(p => p.status === 'Active').map(p => (
              <PollCard key={p.id} poll={p}/>
            ))}
          </div>
        </div>
      )}

      {/* Closed polls */}
      {filtered.filter(p => p.status === 'Closed').length > 0 && (filterStatus === 'All' || filterStatus === 'Closed') && (
        <div>
          <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>🔒 Closed Polls</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {filtered.filter(p => p.status === 'Closed').map(p => (
              <PollCard key={p.id} poll={p}/>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>No polls found.</div>
      )}

      {/* Poll detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:560, maxHeight:'90vh', overflowY:'auto' }}>
            {(() => {
              const cat     = CAT_MAP[selected.category_id] || CAT_MAP.general;
              const isActive = selected.status === 'Active';
              const leading  = [...selected.options].sort((a,b) => b.votes - a.votes)[0];
              return (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      <span style={{ fontSize:22 }}>{cat.emoji}</span>
                      <span className="badge" style={{ background:'rgba(37,99,235,0.1)', color:'var(--accent)' }}>{cat.label}</span>
                      <span className={`badge ${isActive?'badge-green':'badge-gray'}`}>{isActive?'🟢 Active':'🔒 Closed'}</span>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={20}/></button>
                  </div>

                  <div style={{ fontWeight:800, fontSize:17, color:'var(--white)', marginBottom:8, lineHeight:1.4 }}>{selected.title}</div>

                  {selected.description && (
                    <div style={{ fontSize:13.5, color:'var(--muted)', marginBottom:16, lineHeight:1.6, background:'#F8FAFC', padding:'12px 14px', borderRadius:8, border:'1px solid var(--border)' }}>
                      {selected.description}
                    </div>
                  )}

                  <div style={{ display:'flex', gap:16, marginBottom:18, fontSize:12, color:'var(--muted)' }}>
                    <span>👤 {selected.createdBy}</span>
                    <span>📅 {selected.startDate} – {selected.endDate || 'Ongoing'}</span>
                    <span><Users size={12} style={{ display:'inline', marginRight:4 }}/>{selected.totalVotes} votes</span>
                  </div>

                  {/* Options */}
                  <div style={{ marginBottom:20 }}>
                    {selected.options.map((opt, i) => {
                      const pct      = getPercent(opt.votes, selected.totalVotes);
                      const isWinner = selected.winner === opt.id;
                      const isVoted  = selected.userVoted === opt.id;
                      const canVote  = isActive && !selected.userVoted;
                      return (
                        <div key={opt.id} style={{ marginBottom:12, cursor: canVote ? 'pointer' : 'default',
                          background: isVoted ? 'rgba(37,99,235,0.05)' : isWinner ? `${BAR_COLORS[i%4]}08` : 'transparent',
                          borderRadius:10, padding:'10px 14px', border:`1px solid ${isVoted || isWinner ? BAR_COLORS[i%4]+'40' : 'transparent'}`,
                          transition:'all 0.15s' }}
                          onClick={() => { if (canVote) castVote(selected.id, opt.id); }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontSize:14, fontWeight: isVoted||isWinner ? 700 : 500,
                              color: isVoted||isWinner ? BAR_COLORS[i%4] : 'var(--text)',
                              display:'flex', alignItems:'center', gap:8 }}>
                              <span style={{ width:24, height:24, borderRadius:6, background:`${BAR_COLORS[i%4]}15`, color:BAR_COLORS[i%4], display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                                {String.fromCharCode(65+i)}
                              </span>
                              {isWinner && '🏆 '}{opt.label}
                              {isVoted && !isWinner && <span style={{ fontSize:11, background:'rgba(37,99,235,0.1)', color:'var(--accent)', padding:'2px 8px', borderRadius:99 }}>Your vote</span>}
                            </span>
                            <span style={{ fontWeight:800, color:BAR_COLORS[i%4], fontSize:15 }}>{pct}%</span>
                          </div>
                          <div style={{ height:10, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${pct}%`, borderRadius:99, background:BAR_COLORS[i%4], transition:'width 0.6s ease' }}/>
                          </div>
                          <div style={{ fontSize:11, color:'var(--muted)', marginTop:5 }}>{opt.votes} votes</div>
                        </div>
                      );
                    })}
                  </div>

                  {isActive && !selected.userVoted && (
                    <div style={{ padding:'12px 14px', background:'rgba(37,99,235,0.06)', borderRadius:10, fontSize:13, color:'var(--accent)', marginBottom:16, fontWeight:600 }}>
                      🗳️ Click any option above to cast your vote
                    </div>
                  )}
                  {selected.userVoted && isActive && (
                    <div style={{ padding:'12px 14px', background:'rgba(37,99,235,0.06)', borderRadius:10, fontSize:13, color:'var(--accent)', marginBottom:16 }}>
                      ✅ You have voted. Results update in real time.
                    </div>
                  )}
                  {!isActive && leading && (
                    <div style={{ padding:'14px 16px', background:`${BAR_COLORS[selected.options.findIndex(o=>o.id===leading.id)%4]}10`, border:`1.5px solid ${BAR_COLORS[selected.options.findIndex(o=>o.id===leading.id)%4]}30`, borderRadius:10, marginBottom:16 }}>
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>🏆 WINNING RESULT</div>
                      <div style={{ fontWeight:800, fontSize:15, color:'var(--white)' }}>{leading.label}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{leading.votes} votes · {getPercent(leading.votes, selected.totalVotes)}% of total</div>
                    </div>
                  )}

                  <div style={{ display:'flex', gap:10 }}>
                    {isActive && (
                      <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none' }}
                        onClick={() => { closePoll(selected.id); setSelected(null); }}>
                        <Lock size={13}/> Close Poll
                      </button>
                    )}
                    <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none' }}
                      onClick={() => deletePoll(selected.id)}>
                      <Trash2 size={13}/> Delete
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ marginLeft:'auto' }} onClick={() => setSelected(null)}>
                      Close
                    </button>
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
