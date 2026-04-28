'use client';
import { useState } from 'react';
import {
  Plus, X, Search, Clock, CheckCircle, XCircle,
  Calendar, Users, IndianRupee, MapPin, Star,
  Edit2, Trash2, Eye, ChevronLeft, ChevronRight,
  AlertCircle, Lock, Unlock
} from 'lucide-react';

const FACILITIES = [
  {
    id: 1, name: 'Community Hall',       emoji: '🏛️', capacity: 150, pricePerHour: 500,
    amenities: ['AC', 'Sound System', 'Projector', 'Stage', 'Kitchen Access'],
    description: 'Spacious air-conditioned hall for events, parties, AGMs and cultural programmes.',
    timings: '8:00 AM – 10:00 PM', minHours: 2, maxHours: 12,
    rules: ['No outside catering without permission', 'Cleaning deposit ₹1,000', 'No loud music after 9 PM'],
    images: '🏛️', status: 'Available', rating: 4.8, bookings: 34,
  },
  {
    id: 2, name: 'Terrace / Rooftop',    emoji: '🌇', capacity: 80, pricePerHour: 300,
    amenities: ['Open Air', 'Fairy Lights', 'Seating Area', 'BBQ Grill'],
    description: 'Beautiful open-air terrace with panoramic views. Perfect for parties and get-togethers.',
    timings: '6:00 AM – 9:00 PM', minHours: 2, maxHours: 8,
    rules: ['No glass items', 'Children must be supervised', 'No cooking without prior approval'],
    images: '🌇', status: 'Available', rating: 4.6, bookings: 28,
  },
  {
    id: 3, name: 'Gymnasium',             emoji: '💪', capacity: 20,  pricePerHour: 0,
    amenities: ['Cardio Equipment', 'Weight Training', 'Yoga Mat', 'Locker'],
    description: 'Fully equipped gym with cardio and weight training equipment. Free for all residents.',
    timings: '5:00 AM – 10:00 PM', minHours: 1, maxHours: 2,
    rules: ['Proper gym attire required', 'Wipe equipment after use', 'Max 2 hours per session'],
    images: '💪', status: 'Available', rating: 4.5, bookings: 120,
  },
  {
    id: 4, name: 'Swimming Pool',         emoji: '🏊', capacity: 30,  pricePerHour: 0,
    amenities: ['Changing Room', 'Shower', 'Lifeguard', 'Kids Pool'],
    description: 'Olympic-size swimming pool with separate kids pool. Lifeguard on duty at all times.',
    timings: '6:00 AM – 8:00 PM', minHours: 1, maxHours: 2,
    rules: ['Swim cap mandatory', 'No diving in kids pool', 'Shower before entering pool'],
    images: '🏊', status: 'Maintenance', rating: 4.9, bookings: 89,
  },
  {
    id: 5, name: 'Kids Play Area',        emoji: '🎠', capacity: 25,  pricePerHour: 0,
    amenities: ['Slides', 'Swings', 'Sand Pit', 'Climbing Frame', 'Benches'],
    description: 'Safe and fun play area for children up to age 12 with soft flooring.',
    timings: '6:00 AM – 8:30 PM', minHours: 1, maxHours: 2,
    rules: ['Children must be supervised', 'No food inside', 'Age limit: 12 years'],
    images: '🎠', status: 'Available', rating: 4.7, bookings: 0,
  },
  {
    id: 6, name: 'Mini Conference Room',  emoji: '🖥️', capacity: 15,  pricePerHour: 200,
    amenities: ['AC', 'Projector', 'Whiteboard', 'Video Conferencing', 'WiFi'],
    description: 'Professional mini conference room for business meetings, interviews and small gatherings.',
    timings: '8:00 AM – 9:00 PM', minHours: 1, maxHours: 8,
    rules: ['No food or drinks', 'Prior booking mandatory', 'Society members only'],
    images: '🖥️', status: 'Available', rating: 4.4, bookings: 15,
  },
];

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const formatDate = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
const formatTime = t => t;

const TIME_SLOTS = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM',
];

const initialBookings = [
  { id:1, facilityId:1, facilityName:'Community Hall',      flat:'D-401', bookedBy:'Meena Iyer',    date:'2025-04-20', fromTime:'4:00 PM', toTime:'9:00 PM', hours:5, amount:2500, purpose:'Birthday Party',         status:'Approved',  deposit:1000 },
  { id:2, facilityId:2, facilityName:'Terrace / Rooftop',   flat:'B-201', bookedBy:'Anjali Verma',  date:'2025-04-22', fromTime:'6:00 PM', toTime:'9:00 PM', hours:3, amount:900,  purpose:'Family get-together',    status:'Approved',  deposit:0 },
  { id:3, facilityId:1, facilityName:'Community Hall',      flat:'A-101', bookedBy:'Rajesh Kumar',  date:'2025-04-25', fromTime:'6:00 PM', toTime:'10:00 PM',hours:4, amount:2000, purpose:'AGM Meeting',            status:'Pending',   deposit:1000 },
  { id:4, facilityId:6, facilityName:'Mini Conference Room',flat:'C-302', bookedBy:'Vikram Joshi',  date:'2025-04-21', fromTime:'10:00 AM',toTime:'12:00 PM',hours:2, amount:400,  purpose:'Job Interview',          status:'Approved',  deposit:0 },
  { id:5, facilityId:2, facilityName:'Terrace / Rooftop',   flat:'D-402', bookedBy:'Arjun Nair',    date:'2025-04-18', fromTime:'6:00 PM', toTime:'9:00 PM', hours:3, amount:900,  purpose:'Friends reunion',        status:'Completed', deposit:0 },
  { id:6, facilityId:1, facilityName:'Community Hall',      flat:'C-301', bookedBy:'Neha Singh',    date:'2025-05-05', fromTime:'2:00 PM', toTime:'8:00 PM', hours:6, amount:3000, purpose:'Baby shower ceremony',   status:'Pending',   deposit:1000 },
];

const STATUS_CONFIG = {
  Approved:  { color:'var(--accent)',  badge:'badge-green', icon:'✅' },
  Pending:   { color:'var(--gold)',    badge:'badge-gold',  icon:'⏳' },
  Rejected:  { color:'var(--red)',     badge:'badge-red',   icon:'❌' },
  Completed: { color:'var(--muted)',   badge:'badge-gray',  icon:'✓'  },
  Cancelled: { color:'var(--red)',     badge:'badge-red',   icon:'✕'  },
};

export default function Facilities() {
  const [bookings, setBookings]     = useState(initialBookings);
  const [tab, setTab]               = useState('facilities'); // facilities | bookings | calendar
  const [selected, setSelected]     = useState(null);         // selected facility
  const [showBookForm, setShowBookForm] = useState(null);     // facility being booked
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch]         = useState('');
  const [calMonth, setCalMonth]     = useState(new Date(2025,3,1)); // April 2025
  const [form, setForm] = useState({
    flat:'', bookedBy:'', date:'', fromTime:'8:00 AM', toTime:'10:00 AM', purpose:'', hours:2,
  });

  const calcHours = (from, to) => {
    const toMins = t => {
      const [time, m] = t.split(' ');
      let [h, min] = time.split(':').map(Number);
      if (m==='PM' && h!==12) h+=12;
      if (m==='AM' && h===12) h=0;
      return h*60+min;
    };
    return Math.max(0, (toMins(to)-toMins(from))/60);
  };

  const submitBooking = () => {
    if (!form.flat || !form.date || !form.fromTime || !form.toTime || !form.purpose) return;
    const fac     = showBookForm;
    const hours   = calcHours(form.fromTime, form.toTime);
    const amount  = fac.pricePerHour * hours;
    const deposit = fac.name==='Community Hall' ? 1000 : 0;
    setBookings([{
      ...form, id:Date.now(), facilityId:fac.id, facilityName:fac.name,
      hours, amount, deposit, status:'Pending',
    }, ...bookings]);
    setForm({ flat:'', bookedBy:'', date:'', fromTime:'8:00 AM', toTime:'10:00 AM', purpose:'', hours:2 });
    setShowBookForm(null);
    setTab('bookings');
  };

  const updateStatus = (id, status) => {
    setBookings(bookings.map(b => b.id===id ? {...b, status} : b));
    if (selectedBooking?.id===id) setSelectedBooking(p=>({...p,status}));
  };

  const filteredBookings = bookings.filter(b => {
    const matchStatus = filterStatus==='All' || b.status===filterStatus;
    const matchSearch = !search || b.flat.toLowerCase().includes(search.toLowerCase()) || b.bookedBy.toLowerCase().includes(search.toLowerCase()) || b.facilityName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    totalBookings: bookings.length,
    pending:  bookings.filter(b=>b.status==='Pending').length,
    approved: bookings.filter(b=>b.status==='Approved').length,
    revenue:  bookings.filter(b=>b.status!=='Cancelled'&&b.status!=='Rejected').reduce((s,b)=>s+b.amount+b.deposit,0),
  };

  // Calendar logic
  const getDaysInMonth = (y,m) => new Date(y,m+1,0).getDate();
  const getFirstDay    = (y,m) => new Date(y,m,1).getDay();
  const calYear  = calMonth.getFullYear();
  const calMon   = calMonth.getMonth();
  const daysInMon = getDaysInMonth(calYear, calMon);
  const firstDay  = getFirstDay(calYear, calMon);
  const bookingsThisMonth = bookings.filter(b => {
    const d = new Date(b.date);
    return d.getFullYear()===calYear && d.getMonth()===calMon;
  });
  const getBookingsOnDay = (day) => bookingsThisMonth.filter(b => new Date(b.date).getDate()===day);

  return (
    <div>
      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        {[
          { id:'facilities', label:'🏢 Facilities' },
          { id:'bookings',   label:'📋 All Bookings' },
          { id:'calendar',   label:'📅 Calendar' },
        ].map(t=>(
          <button key={t.id} className={`btn ${tab===t.id?'btn-primary':'btn-outline'}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          {[
            {label:'Total', value:stats.totalBookings, color:'var(--accent2)'},
            {label:'Pending', value:stats.pending, color:'var(--gold)'},
            {label:'Approved', value:stats.approved, color:'var(--accent)'},
            {label:'Revenue', value:`₹${stats.revenue.toLocaleString()}`, color:'var(--accent)'},
          ].map(s=>(
            <div key={s.label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 14px', textAlign:'center', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FACILITIES TAB ── */}
      {tab==='facilities' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
            {FACILITIES.map(f=>(
              <div key={f.id} className="card" style={{ marginBottom:0, cursor:'pointer', transition:'all 0.15s', position:'relative', overflow:'hidden' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';}}
                onClick={()=>setSelected(f)}>

                {/* Status ribbon */}
                {f.status==='Maintenance' && (
                  <div style={{ position:'absolute', top:14, right:-22, background:'var(--gold)', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 28px', transform:'rotate(45deg)', letterSpacing:'0.5px' }}>MAINTENANCE</div>
                )}

                {/* Emoji */}
                <div style={{ fontSize:44, marginBottom:12, textAlign:'center' }}>{f.emoji}</div>

                <div style={{ fontWeight:800, fontSize:16, color:'var(--white)', marginBottom:4, textAlign:'center' }}>{f.name}</div>

                {/* Price & capacity */}
                <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:10, fontSize:13 }}>
                  <span style={{ color:'var(--accent)', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                    <IndianRupee size={13}/>{f.pricePerHour===0?'Free':f.pricePerHour+'/hr'}
                  </span>
                  <span style={{ color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
                    <Users size={13}/>{f.capacity} max
                  </span>
                </div>

                <div style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginBottom:10, lineHeight:1.5 }}>{f.description.slice(0,80)}...</div>

                {/* Amenities */}
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'center', marginBottom:12 }}>
                  {f.amenities.slice(0,3).map(a=>(
                    <span key={a} style={{ fontSize:10.5, background:'rgba(37,99,235,0.08)', color:'var(--accent)', padding:'2px 8px', borderRadius:99 }}>{a}</span>
                  ))}
                  {f.amenities.length>3 && <span style={{ fontSize:10.5, color:'var(--muted)' }}>+{f.amenities.length-3} more</span>}
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid var(--border)' }}>
                  <div style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
                    <Star size={12} fill="var(--gold)" style={{ color:'var(--gold)' }}/>{f.rating} · {f.bookings} bookings
                  </div>
                  <button className="btn btn-primary btn-sm"
                    style={{ opacity: f.status==='Maintenance'?0.5:1 }}
                    onClick={e=>{ e.stopPropagation(); if(f.status!=='Maintenance') { setShowBookForm(f); setTab('facilities'); }}}
                  >
                    {f.status==='Maintenance'?'Unavailable':'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Facility detail modal */}
          {selected && (
            <div className="modal-overlay" onClick={()=>setSelected(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:520 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <span style={{ fontSize:40 }}>{selected.emoji}</span>
                    <div>
                      <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>{selected.name}</div>
                      <div style={{ fontSize:13, color:'var(--muted)', marginTop:3, display:'flex', gap:10 }}>
                        <span style={{ color:'var(--accent)', fontWeight:700 }}>{selected.pricePerHour===0?'Free':`₹${selected.pricePerHour}/hr`}</span>
                        <span><Users size={12} style={{ display:'inline' }}/> {selected.capacity} max</span>
                        <span>⭐ {selected.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>setSelected(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={20}/></button>
                </div>

                <div style={{ fontSize:14, lineHeight:1.7, color:'var(--text)', marginBottom:14 }}>{selected.description}</div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                  <div style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 14px', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>Timings</div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{selected.timings}</div>
                  </div>
                  <div style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 14px', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>Booking Duration</div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{selected.minHours}–{selected.maxHours} hours</div>
                  </div>
                </div>

                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Amenities</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {selected.amenities.map(a=>(
                      <span key={a} style={{ fontSize:12, background:'rgba(37,99,235,0.08)', color:'var(--accent)', padding:'4px 12px', borderRadius:99, display:'flex', alignItems:'center', gap:5 }}>
                        <CheckCircle size={11}/>{a}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom:18 }}>
                  <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Rules & Guidelines</div>
                  {selected.rules.map((r,i)=>(
                    <div key={i} style={{ fontSize:13, color:'var(--text)', padding:'5px 0', borderBottom:i<selected.rules.length-1?'1px solid var(--border)':'none', display:'flex', gap:8 }}>
                      <span style={{ color:'var(--red)', fontWeight:700 }}>•</span>{r}
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
                  disabled={selected.status==='Maintenance'}
                  onClick={()=>{ setSelected(null); setShowBookForm(selected); }}>
                  {selected.status==='Maintenance' ? '🚧 Under Maintenance' : '📅 Book This Facility'}
                </button>
              </div>
            </div>
          )}

          {/* Booking form modal */}
          {showBookForm && (
            <div className="modal-overlay" onClick={()=>setShowBookForm(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:520 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>Book {showBookForm.name} {showBookForm.emoji}</div>
                    <div style={{ fontSize:13, color:showBookForm.pricePerHour===0?'var(--accent)':'var(--gold)', fontWeight:600, marginTop:3 }}>
                      {showBookForm.pricePerHour===0 ? 'Free facility' : `₹${showBookForm.pricePerHour} per hour`}
                    </div>
                  </div>
                  <button onClick={()=>setShowBookForm(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={20}/></button>
                </div>

                <div className="form-grid-2" style={{ marginBottom:14 }}>
                  <div className="form-row">
                    <label className="field-label">Your Name</label>
                    <input placeholder="Resident name" value={form.bookedBy} onChange={e=>setForm({...form,bookedBy:e.target.value})}/>
                  </div>
                  <div className="form-row">
                    <label className="field-label">Flat No.</label>
                    <input placeholder="A-101" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/>
                  </div>
                  <div className="form-row col-span-2">
                    <label className="field-label">Date</label>
                    <input type="date" value={form.date} min={todayStr} onChange={e=>setForm({...form,date:e.target.value})}/>
                  </div>
                  <div className="form-row">
                    <label className="field-label">From Time</label>
                    <select value={form.fromTime} onChange={e=>setForm({...form,fromTime:e.target.value})}>
                      {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label className="field-label">To Time</label>
                    <select value={form.toTime} onChange={e=>setForm({...form,toTime:e.target.value})}>
                      {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-row col-span-2">
                    <label className="field-label">Purpose of Booking</label>
                    <input placeholder="e.g. Birthday party, AGM, Meeting..." value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}/>
                  </div>
                </div>

                {/* Cost summary */}
                {form.fromTime && form.toTime && (() => {
                  const hrs = calcHours(form.fromTime, form.toTime);
                  const amt = showBookForm.pricePerHour * hrs;
                  const dep = showBookForm.name==='Community Hall' ? 1000 : 0;
                  return hrs > 0 && (
                    <div style={{ background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
                      <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Booking Summary</div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                        <span style={{ color:'var(--muted)' }}>Duration</span>
                        <span style={{ fontWeight:700 }}>{hrs} hour{hrs!==1?'s':''}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                        <span style={{ color:'var(--muted)' }}>Facility Charge</span>
                        <span style={{ fontWeight:700 }}>{amt===0?'Free':`₹${amt.toLocaleString()}`}</span>
                      </div>
                      {dep>0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                        <span style={{ color:'var(--muted)' }}>Refundable Deposit</span>
                        <span style={{ fontWeight:700 }}>₹{dep.toLocaleString()}</span>
                      </div>}
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, borderTop:'1px solid rgba(37,99,235,0.2)', paddingTop:8, marginTop:4 }}>
                        <span style={{ fontWeight:700 }}>Total Payable</span>
                        <span style={{ fontWeight:800, color:'var(--accent)', fontSize:17 }}>₹{(amt+dep).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}

                <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={submitBooking}>
                  📅 Request Booking
                </button>
                <div style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginTop:8 }}>Booking will be confirmed after admin approval</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BOOKINGS TAB ── */}
      {tab==='bookings' && (
        <div>
          <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ position:'relative', maxWidth:280 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
              <input placeholder="Search flat, name, facility..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
            </div>
            {['All','Pending','Approved','Completed','Cancelled'].map(s=>(
              <button key={s} className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-outline'}`} onClick={()=>setFilterStatus(s)}>
                {STATUS_CONFIG[s]?.icon||''} {s}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>📋 All Bookings ({filteredBookings.length})</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>{['Facility','Booked By','Flat','Date','Time','Hours','Amount','Purpose','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b=>{
                    const sc = STATUS_CONFIG[b.status]||STATUS_CONFIG.Pending;
                    const fac = FACILITIES.find(f=>f.id===b.facilityId);
                    return (
                      <tr key={b.id}>
                        <td style={{ fontWeight:600 }}>{fac?.emoji} {b.facilityName}</td>
                        <td style={{ fontWeight:600 }}>{b.bookedBy}</td>
                        <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{b.flat}</span></td>
                        <td style={{ fontSize:13, color:'var(--muted)' }}>{formatDate(b.date)}</td>
                        <td style={{ fontSize:12, color:'var(--muted)' }}>{b.fromTime} – {b.toTime}</td>
                        <td style={{ fontWeight:600 }}>{b.hours}h</td>
                        <td style={{ fontWeight:700, color:'var(--accent)' }}>{b.amount===0?'Free':`₹${b.amount.toLocaleString()}`}</td>
                        <td style={{ fontSize:12, color:'var(--muted)', maxWidth:120 }}>{b.purpose}</td>
                        <td><span className={`badge ${sc.badge}`}>{sc.icon} {b.status}</span></td>
                        <td>
                          <div style={{ display:'flex', gap:5 }}>
                            <button className="btn btn-outline btn-sm" onClick={()=>setSelectedBooking(b)}><Eye size={12}/></button>
                            {b.status==='Pending' && (
                              <>
                                <button className="btn btn-sm" style={{ background:'rgba(37,99,235,0.1)',color:'var(--accent)',border:'none' }} onClick={()=>updateStatus(b.id,'Approved')}><CheckCircle size={12}/></button>
                                <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)',color:'var(--red)',border:'none' }} onClick={()=>updateStatus(b.id,'Rejected')}><XCircle size={12}/></button>
                              </>
                            )}
                            {b.status==='Approved' && (
                              <button className="btn btn-sm" style={{ background:'rgba(100,116,139,0.1)',color:'var(--muted)',border:'none' }} onClick={()=>updateStatus(b.id,'Completed')}><CheckCircle size={12}/></button>
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

          {/* Booking detail modal */}
          {selectedBooking && (
            <div className="modal-overlay" onClick={()=>setSelectedBooking(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:460 }}>
                {(()=>{
                  const b=selectedBooking; const sc=STATUS_CONFIG[b.status]||STATUS_CONFIG.Pending;
                  const fac=FACILITIES.find(f=>f.id===b.facilityId);
                  return (
                    <>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
                        <div>
                          <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>{fac?.emoji} {b.facilityName}</div>
                          <span className={`badge ${sc.badge}`} style={{ marginTop:6, display:'inline-block' }}>{sc.icon} {b.status}</span>
                        </div>
                        <button onClick={()=>setSelectedBooking(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={20}/></button>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                        {[
                          {label:'Booked By',value:b.bookedBy},{label:'Flat No.',value:b.flat},
                          {label:'Date',value:formatDate(b.date)},{label:'Duration',value:`${b.hours} hours`},
                          {label:'From',value:b.fromTime},{label:'To',value:b.toTime},
                          {label:'Amount',value:b.amount===0?'Free':`₹${b.amount.toLocaleString()}`},{label:'Deposit',value:b.deposit>0?`₹${b.deposit.toLocaleString()}`:'None'},
                        ].map(d=>(
                          <div key={d.label} style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 14px', border:'1px solid var(--border)' }}>
                            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>{d.label}</div>
                            <div style={{ fontWeight:700, fontSize:13.5, color:'var(--white)' }}>{d.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background:'#F8FAFC', borderRadius:8, padding:'12px 14px', marginBottom:16, border:'1px solid var(--border)' }}>
                        <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>Purpose</div>
                        <div style={{ fontSize:13.5, color:'var(--text)' }}>{b.purpose}</div>
                      </div>
                      {b.status==='Pending' && (
                        <div style={{ display:'flex', gap:10 }}>
                          <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={()=>updateStatus(b.id,'Approved')}><CheckCircle size={14}/> Approve</button>
                          <button className="btn btn-sm" style={{ flex:1, justifyContent:'center', background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none' }} onClick={()=>updateStatus(b.id,'Rejected')}><XCircle size={14}/> Reject</button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CALENDAR TAB ── */}
      {tab==='calendar' && (
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <button className="btn btn-outline btn-sm" onClick={()=>setCalMonth(new Date(calYear, calMon-1, 1))}><ChevronLeft size={16}/></button>
            <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>
              {calMonth.toLocaleDateString('en-IN', { month:'long', year:'numeric' })}
            </div>
            <button className="btn btn-outline btn-sm" onClick={()=>setCalMonth(new Date(calYear, calMon+1, 1))}><ChevronRight size={16}/></button>
          </div>

          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:4 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
              <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:'var(--muted)', padding:'6px 0', textTransform:'uppercase', letterSpacing:'0.5px' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
            {/* Empty cells */}
            {Array(firstDay).fill(0).map((_,i)=><div key={`e${i}`}/>)}
            {/* Days */}
            {Array(daysInMon).fill(0).map((_,i)=>{
              const day       = i+1;
              const dayBkgs   = getBookingsOnDay(day);
              const isToday   = calYear===today.getFullYear() && calMon===today.getMonth() && day===today.getDate();
              return (
                <div key={day} style={{ minHeight:72, background: isToday?'rgba(37,99,235,0.08)':'#F8FAFC', border:`1px solid ${isToday?'var(--accent)':'var(--border)'}`, borderRadius:8, padding:'6px 8px', transition:'background 0.12s', cursor:dayBkgs.length>0?'pointer':'default' }}>
                  <div style={{ fontSize:12, fontWeight: isToday?800:500, color: isToday?'var(--accent)':'var(--muted)', marginBottom:4 }}>{day}</div>
                  {dayBkgs.map(b=>{
                    const sc = STATUS_CONFIG[b.status]||STATUS_CONFIG.Pending;
                    return (
                      <div key={b.id} onClick={()=>setSelectedBooking(b)}
                        style={{ fontSize:10, background:`${sc.color}18`, color:sc.color, borderRadius:4, padding:'2px 5px', marginBottom:2, cursor:'pointer', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:600 }}>
                        {b.facilityName.split(' ')[0]}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display:'flex', gap:16, marginTop:16, flexWrap:'wrap' }}>
            {Object.entries(STATUS_CONFIG).map(([status, sc])=>(
              <span key={status} style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:10, height:10, borderRadius:3, background:sc.color, display:'inline-block' }}/>
                {status}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
