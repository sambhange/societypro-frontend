'use client';
import { useState } from 'react';
import {
  Plus, X, Search, MessageCircle, ThumbsUp, Eye,
  Pin, ChevronRight, Send, Trash2, Flag, Clock,
  Hash, TrendingUp, Bell
} from 'lucide-react';

const CATEGORIES = [
  { id: 'general',     label: 'General',          emoji: '💬', color: '#2563EB' },
  { id: 'maintenance', label: 'Maintenance',       emoji: '🔧', color: '#D97706' },
  { id: 'events',      label: 'Events & Social',   emoji: '🎉', color: '#7C3AED' },
  { id: 'safety',      label: 'Safety & Security', emoji: '🔒', color: '#DC2626' },
  { id: 'helpdesk',    label: 'Help & Questions',  emoji: '❓', color: '#0891B2' },
  { id: 'suggestion',  label: 'Suggestions',       emoji: '💡', color: '#16A34A' },
  { id: 'buy_sell',    label: 'Buy & Sell',        emoji: '🛒', color: '#9333EA' },
  { id: 'pets',        label: 'Pets Corner',       emoji: '🐾', color: '#EA580C' },
];

const now   = () => new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

const initialThreads = [
  {
    id: 1, category: 'safety', flat: 'A-101', author: 'Rajesh Kumar',
    title: 'Unknown person spotted near parking area last night',
    body: 'Around 11:30 PM last night I noticed an unknown person loitering near the B-wing parking area. He was there for about 20 minutes. Security guard was not visible at that time. I have reported to the admin but wanted to alert everyone. Please be cautious and report anything suspicious immediately.',
    tags: ['security', 'parking', 'alert'],
    pinned: true, views: 87, likes: 23,
    date: '16 Apr 2025', time: '8:00 AM',
    replies: [
      { id: 1, author: 'Priya Sharma',   flat: 'B-201', text: 'Thank you for alerting everyone. I also saw someone yesterday. We must ask the committee to improve night security.',     date: '16 Apr', time: '8:30 AM', likes: 8  },
      { id: 2, author: 'Society Admin',  flat: 'Admin', text: 'We have reviewed the CCTV footage. The person appears to have been waiting for a cab. However we have instructed security to be more vigilant during night hours.', date: '16 Apr', time: '10:00 AM', likes: 15 },
      { id: 3, author: 'Vikram Joshi',   flat: 'C-302', text: 'We really need a proper night patrol. Let us raise this in the next meeting.', date: '16 Apr', time: '11:00 AM', likes: 5  },
    ],
    likedByMe: false,
  },
  {
    id: 2, category: 'events', flat: 'D-401', author: 'Meena Iyer',
    title: 'Holi 2025 celebration — volunteers needed! 🎨',
    body: 'This year\'s Holi celebration is on 14th March. We need volunteers for decoration, water arrangement, colour distribution, and food coordination. Please reply with your name and what you can help with. It\'s going to be a grand celebration! Everyone is invited — residents and their families.',
    tags: ['holi', 'volunteers', 'celebration'],
    pinned: true, views: 134, likes: 41,
    date: '5 Mar 2025', time: '3:00 PM',
    replies: [
      { id: 1, author: 'Anjali Verma', flat: 'B-201', text: 'I can help with decoration and food coordination! Count me in.',    date: '5 Mar',  time: '4:00 PM', likes: 6 },
      { id: 2, author: 'Arjun Nair',   flat: 'D-402', text: 'I will handle water balloons and pichkari distribution for kids!', date: '5 Mar',  time: '5:30 PM', likes: 4 },
      { id: 3, author: 'Neha Singh',   flat: 'C-301', text: 'I can manage the food stall with my husband. We can arrange poha, jalebi and thandai.',                                   date: '6 Mar',  time: '9:00 AM', likes: 9 },
    ],
    likedByMe: true,
  },
  {
    id: 3, category: 'suggestion', flat: 'B-202', author: 'Suresh Patel',
    title: 'Proposal: Add a reading room / library for society',
    body: 'I suggest we convert the unused storage room near the community hall into a small library or reading room. We can collect donated books from residents, add a few chairs and a bookshelf. This would be a great resource especially for students and senior citizens. Cost would be minimal. Would love to hear your thoughts.',
    tags: ['library', 'suggestion', 'community'],
    pinned: false, views: 52, likes: 31,
    date: '10 Apr 2025', time: '11:00 AM',
    replies: [
      { id: 1, author: 'Meena Iyer',   flat: 'D-401', text: 'Wonderful idea! I have around 50 books I can donate. Let\'s do it!', date: '10 Apr', time: '12:00 PM', likes: 12 },
      { id: 2, author: 'Rajesh Kumar', flat: 'A-101', text: 'I support this. I can speak to the committee about allocating the storage room.', date: '10 Apr', time: '2:00 PM', likes: 8 },
    ],
    likedByMe: false,
  },
  {
    id: 4, category: 'buy_sell', flat: 'C-301', author: 'Neha Singh',
    title: 'Selling: 2-year-old washing machine — ₹8,000 (negotiable)',
    body: 'Selling my LG 7kg front-load washing machine. Bought in 2023, in excellent working condition. Selling because we upgraded to a bigger model. Price ₹8,000 negotiable. Interested residents can contact me on 9543219876. Delivery within the society premises only.',
    tags: ['washing machine', 'sell', 'LG'],
    pinned: false, views: 38, likes: 6,
    date: '14 Apr 2025', time: '5:00 PM',
    replies: [
      { id: 1, author: 'Arjun Nair', flat: 'D-402', text: 'Interested! Will call you tomorrow.', date: '14 Apr', time: '6:00 PM', likes: 0 },
    ],
    likedByMe: false,
  },
  {
    id: 5, category: 'helpdesk', flat: 'A-102', author: 'Priya Mehta',
    title: 'Where can I find the society NOC format for flat renovation?',
    body: 'I want to do minor renovation in my flat — false ceiling and painting. I was told I need an NOC from the society. Can anyone tell me where I can get the form or process for getting NOC? What documents are needed?',
    tags: ['NOC', 'renovation', 'question'],
    pinned: false, views: 29, likes: 4,
    date: '15 Apr 2025', time: '10:00 AM',
    replies: [
      { id: 1, author: 'Society Admin', flat: 'Admin', text: 'Please download the NOC form from the File Repository section or visit the society office on any weekday between 10 AM – 12 PM. You will need your ID proof, flat ownership docs and a brief description of work.',    date: '15 Apr', time: '11:30 AM', likes: 7 },
    ],
    likedByMe: false,
  },
  {
    id: 6, category: 'pets', flat: 'D-402', author: 'Arjun Nair',
    title: 'Dog walking timings — let us agree on a common schedule',
    body: 'Hello fellow pet owners! I think we should agree on a dog walking schedule in the garden area to avoid overcrowding and any incidents. I suggest morning 6–8 AM and evening 6–8 PM as dedicated pet walk times. Thoughts?',
    tags: ['pets', 'dogs', 'garden', 'schedule'],
    pinned: false, views: 45, likes: 18,
    date: '13 Apr 2025', time: '7:00 PM',
    replies: [
      { id: 1, author: 'Deepa Patil', flat: 'D-202', text: 'Great idea! I have two dogs and I always feel awkward when others are also in the garden. A fixed schedule makes sense.', date: '13 Apr', time: '8:00 PM', likes: 6 },
    ],
    likedByMe: false,
  },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const getInitials = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

const AVATAR_COLORS = ['#2563EB','#7C3AED','#D97706','#DC2626','#16A34A','#0891B2','#9333EA','#EA580C'];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function Forum() {
  const [threads, setThreads]         = useState(initialThreads);
  const [selected, setSelected]       = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState('All');
  const [sortBy, setSortBy]           = useState('recent');
  const [replyText, setReplyText]     = useState('');
  const [replyFlat, setReplyFlat]     = useState('');
  const [replyName, setReplyName]     = useState('');
  const [form, setForm] = useState({
    title:'', body:'', category:'general', flat:'', author:'', tags:'',
  });

  const filtered = threads.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !search || t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || t.tags?.some(tag => tag.includes(q));
    const matchCat = filterCat === 'All' || t.category === filterCat;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'replies') return b.replies.length - a.replies.length;
    return 0;
  });

  const likeThread = (id) => {
    setThreads(threads.map(t =>
      t.id === id ? { ...t, likes: t.likedByMe ? t.likes - 1 : t.likes + 1, likedByMe: !t.likedByMe } : t
    ));
    if (selected?.id === id) setSelected(p => ({ ...p, likes: p.likedByMe ? p.likes-1 : p.likes+1, likedByMe: !p.likedByMe }));
  };

  const likeReply = (threadId, replyId) => {
    const update = t => t.id !== threadId ? t : { ...t, replies: t.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r) };
    setThreads(threads.map(update));
    if (selected?.id === threadId) setSelected(p => update(p));
  };

  const postReply = (threadId) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(), author: replyName || 'Resident', flat: replyFlat || '—',
      text: replyText.trim(), date: today, time: now(), likes: 0,
    };
    const update = t => t.id !== threadId ? t : { ...t, replies: [...t.replies, newReply] };
    setThreads(threads.map(update));
    setSelected(p => update(p));
    setReplyText(''); setReplyFlat(''); setReplyName('');
  };

  const pinThread = (id) => setThreads(threads.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  const deleteThread = (id) => { setThreads(threads.filter(t => t.id !== id)); setSelected(null); };

  const createThread = () => {
    if (!form.title || !form.body || !form.flat) return;
    const tags = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    setThreads([{ ...form, id: Date.now(), tags, pinned: false, views: 1, likes: 0, date: today, time: now(), replies: [], likedByMe: false }, ...threads]);
    setForm({ title:'', body:'', category:'general', flat:'', author:'', tags:'' });
    setShowForm(false);
  };

  const openThread = (t) => {
    setSelected(t);
    setThreads(threads.map(x => x.id === t.id ? { ...x, views: x.views + 1 } : x));
  };

  const stats = {
    total:    threads.length,
    today:    threads.filter(t => t.date === today).length,
    replies:  threads.reduce((s,t) => s+t.replies.length, 0),
    pinned:   threads.filter(t => t.pinned).length,
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, maxWidth:320 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search discussions..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ maxWidth:160 }}>
          <option value="recent">🕐 Most Recent</option>
          <option value="popular">🔥 Most Popular</option>
          <option value="replies">💬 Most Replies</option>
        </select>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={()=>setShowForm(!showForm)}>
          <Plus size={14}/> New Discussion
        </button>
      </div>

      {/* Category tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        <button className={`btn btn-sm ${filterCat==='All'?'btn-primary':'btn-outline'}`} onClick={()=>setFilterCat('All')}>
          🏠 All Topics
        </button>
        {CATEGORIES.map(c => (
          <button key={c.id}
            className={`btn btn-sm ${filterCat===c.id?'btn-primary':''}`}
            style={filterCat!==c.id?{background:'rgba(255,255,255,0.7)',border:'1.5px solid #E2E8F0',color:'var(--muted)',whiteSpace:'nowrap'}:{whiteSpace:'nowrap'}}
            onClick={()=>setFilterCat(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Threads',  value:stats.total,   color:'var(--accent)',  icon:'💬' },
          { label:'Posted Today',   value:stats.today,   color:'var(--gold)',    icon:'🕐' },
          { label:'Total Replies',  value:stats.replies, color:'var(--accent2)', icon:'↩️' },
          { label:'Pinned Posts',   value:stats.pinned,  color:'var(--red)',     icon:'📌' },
        ].map((s,i) => (
          <div key={i} className="stat-card" style={{ flex:1, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:24 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:'var(--muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* New thread form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>✍️ Start New Discussion</span>
            <button onClick={()=>setShowForm(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={18}/></button>
          </div>
          <div className="form-grid-3" style={{ marginBottom:14 }}>
            <div className="form-row" style={{ gridColumn:'span 3' }}>
              <label className="field-label">Discussion Title</label>
              <input placeholder="What do you want to discuss?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            </div>
            <div className="form-row" style={{ gridColumn:'span 3' }}>
              <label className="field-label">Your Message</label>
              <textarea placeholder="Write your post here — be clear and respectful..." style={{ minHeight:100 }} value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Your Name</label>
              <input placeholder="Your full name" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Your Flat No.</label>
              <input placeholder="A-101" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/>
            </div>
            <div className="form-row" style={{ gridColumn:'span 3' }}>
              <label className="field-label">Tags (comma separated)</label>
              <input placeholder="e.g. security, parking, event" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-primary" onClick={createThread}>🚀 Post Discussion</button>
        </div>
      )}

      {/* Thread list */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>💬 Discussions ({sorted.length})</span>
        </div>

        {sorted.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>No discussions found.</div>
        )}

        {sorted.map((t, idx) => {
          const cat = CAT_MAP[t.category] || CAT_MAP.general;
          return (
            <div key={t.id}
              style={{ display:'flex', gap:14, padding:'16px 22px', borderBottom: idx < sorted.length-1 ? '1px solid var(--border)' : 'none', cursor:'pointer', transition:'background 0.12s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              onClick={()=>openThread(t)}>

              {/* Avatar */}
              <div style={{ width:44, height:44, borderRadius:'50%', background:`${avatarColor(t.author)}18`, border:`2px solid ${avatarColor(t.author)}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:avatarColor(t.author), flexShrink:0 }}>
                {getInitials(t.author)}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:5 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    {t.pinned && <Pin size={13} style={{ color:'var(--red)', flexShrink:0 }}/>}
                    <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)', lineHeight:1.3 }}>{t.title}</span>
                  </div>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${cat.color}12`, color:cat.color, borderRadius:99, padding:'2px 10px', fontSize:11, fontWeight:600, flexShrink:0 }}>
                    {cat.emoji} {cat.label}
                  </span>
                </div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:8, lineHeight:1.5 }}>{t.body.slice(0,120)}...</div>

                {/* Tags */}
                {t.tags?.length > 0 && (
                  <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' }}>
                    {t.tags.map(tag => (
                      <span key={tag} style={{ fontSize:11, background:'rgba(37,99,235,0.08)', color:'var(--accent)', padding:'1px 8px', borderRadius:99 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--muted)', alignItems:'center' }}>
                  <span style={{ fontWeight:600, color:'var(--text)' }}>{t.author}</span>
                  <span>🏠 {t.flat}</span>
                  <span>📅 {t.date}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><Eye size={12}/>{t.views}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><ThumbsUp size={12}/>{t.likes}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><MessageCircle size={12}/>{t.replies.length} replies</span>
                </div>
              </div>
              <ChevronRight size={18} style={{ color:'var(--muted)', flexShrink:0, marginTop:12 }}/>
            </div>
          );
        })}
      </div>

      {/* Thread detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>{ setSelected(null); setReplyText(''); }}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:640, maxHeight:'92vh', overflowY:'auto', padding:0 }}>

            {/* Thread header */}
            <div style={{ padding:'22px 26px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {(() => { const cat = CAT_MAP[selected.category]||CAT_MAP.general; return (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${cat.color}12`, color:cat.color, borderRadius:99, padding:'3px 12px', fontSize:12, fontWeight:700 }}>
                      {cat.emoji} {cat.label}
                    </span>
                  );})()}
                  {selected.pinned && <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(220,38,38,0.1)', color:'var(--red)', borderRadius:99, padding:'3px 10px', fontSize:11, fontWeight:700 }}><Pin size={11}/> Pinned</span>}
                </div>
                <button onClick={()=>{ setSelected(null); setReplyText(''); }} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={20}/></button>
              </div>

              <h2 style={{ fontWeight:800, fontSize:18, color:'var(--white)', marginBottom:10, lineHeight:1.4 }}>{selected.title}</h2>

              {/* Author row */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:`${avatarColor(selected.author)}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:avatarColor(selected.author) }}>
                  {getInitials(selected.author)}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13.5, color:'var(--white)' }}>{selected.author}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>Flat {selected.flat} · {selected.date} at {selected.time}</div>
                </div>
              </div>

              <div style={{ fontSize:14, lineHeight:1.75, color:'var(--text)', marginBottom:14 }}>{selected.body}</div>

              {/* Tags */}
              {selected.tags?.length > 0 && (
                <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
                  {selected.tags.map(tag=>(
                    <span key={tag} style={{ fontSize:11.5, background:'rgba(37,99,235,0.08)', color:'var(--accent)', padding:'3px 10px', borderRadius:99, display:'flex', alignItems:'center', gap:4 }}>
                      <Hash size={10}/>{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <button className="btn btn-sm"
                  style={{ background: selected.likedByMe ? 'rgba(37,99,235,0.15)' : '#F1F5F9', color: selected.likedByMe ? 'var(--accent)' : 'var(--muted)', border:`1px solid ${selected.likedByMe?'var(--accent)':'var(--border)'}` }}
                  onClick={()=>likeThread(selected.id)}>
                  <ThumbsUp size={13}/> {selected.likes}
                </button>
                <span style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}><Eye size={13}/>{selected.views} views</span>
                <span style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}><MessageCircle size={13}/>{selected.replies.length} replies</span>
                <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                  <button className="btn btn-sm" style={{ background:'#F1F5F9', color:'var(--muted)', border:'1px solid var(--border)' }}
                    onClick={()=>pinThread(selected.id)}>
                    <Pin size={13}/> {selected.pinned?'Unpin':'Pin'}
                  </button>
                  <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none' }}
                    onClick={()=>deleteThread(selected.id)}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {selected.replies.length > 0 && (
              <div style={{ padding:'16px 26px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:16 }}>
                  💬 {selected.replies.length} {selected.replies.length===1?'Reply':'Replies'}
                </div>
                {selected.replies.map((r, i) => (
                  <div key={r.id} style={{ display:'flex', gap:12, marginBottom:16, paddingBottom:16, borderBottom: i<selected.replies.length-1?'1px solid var(--border)':'none' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:`${avatarColor(r.author)}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:avatarColor(r.author), flexShrink:0 }}>
                      {getInitials(r.author)}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <div>
                          <span style={{ fontWeight:700, fontSize:13.5, color:'var(--white)' }}>{r.author}</span>
                          <span style={{ fontSize:12, color:'var(--muted)', marginLeft:8 }}>Flat {r.flat} · {r.date} {r.time}</span>
                          {r.flat === 'Admin' && <span style={{ marginLeft:8, fontSize:11, background:'rgba(37,99,235,0.12)', color:'var(--accent)', padding:'2px 8px', borderRadius:99, fontWeight:700 }}>Admin</span>}
                        </div>
                      </div>
                      <div style={{ fontSize:13.5, color:'var(--text)', lineHeight:1.65, marginBottom:8 }}>{r.text}</div>
                      <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:12, display:'flex', alignItems:'center', gap:5 }}
                        onClick={()=>likeReply(selected.id, r.id)}>
                        <ThumbsUp size={12}/> {r.likes} Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            <div style={{ padding:'16px 26px' }}>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:12 }}>
                ✍️ Post a Reply
              </div>
              <div className="form-grid-2" style={{ marginBottom:10 }}>
                <div className="form-row" style={{ marginBottom:0 }}>
                  <input placeholder="Your name" value={replyName} onChange={e=>setReplyName(e.target.value)}/>
                </div>
                <div className="form-row" style={{ marginBottom:0 }}>
                  <input placeholder="Flat no. (e.g. A-101)" value={replyFlat} onChange={e=>setReplyFlat(e.target.value)}/>
                </div>
              </div>
              <textarea
                placeholder="Write your reply — be helpful and respectful..."
                value={replyText} onChange={e=>setReplyText(e.target.value)}
                style={{ minHeight:80, marginBottom:10 }}
                onKeyDown={e=>{ if(e.ctrlKey && e.key==='Enter') postReply(selected.id); }}
              />
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <button className="btn btn-primary" onClick={()=>postReply(selected.id)} disabled={!replyText.trim()}>
                  <Send size={14}/> Post Reply
                </button>
                <span style={{ fontSize:12, color:'var(--muted)' }}>Ctrl+Enter to post</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
