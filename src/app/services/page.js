'use client';
import { useState } from 'react';
import { Star, Phone, Clock, MapPin, X, Plus, ChevronRight, CheckCircle, Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'all',        label: 'All Services',  emoji: '🏠' },
  { id: 'cleaning',   label: 'Cleaning',      emoji: '🧹' },
  { id: 'plumbing',   label: 'Plumbing',      emoji: '🔧' },
  { id: 'electrical', label: 'Electrical',    emoji: '⚡' },
  { id: 'painting',   label: 'Painting',      emoji: '🖌️' },
  { id: 'beauty',     label: 'Beauty & Spa',  emoji: '💅' },
  { id: 'appliance',  label: 'Appliances',    emoji: '🔌' },
  { id: 'carpentry',  label: 'Carpentry',     emoji: '🪚' },
  { id: 'pest',       label: 'Pest Control',  emoji: '🦟' },
];

const SERVICES = [
  // Cleaning
  { id:1,  category:'cleaning',   title:'Home Deep Cleaning',      price:799,  unit:'1BHK',  rating:4.8, reviews:234, time:'3–4 hrs',  providers:12, emoji:'🧹', popular:true,
    description:'Full home deep cleaning including kitchen, bathroom, all rooms and balcony. Trained professionals with eco-friendly products.',
    includes:['Kitchen deep clean','Bathroom scrubbing','Floor mopping','Sofa vacuuming','Window cleaning'] },
  { id:2,  category:'cleaning',   title:'Bathroom Deep Clean',     price:349,  unit:'per bathroom', rating:4.7, reviews:189, time:'1–2 hrs', providers:8, emoji:'🚿', popular:false,
    description:'Professional bathroom cleaning with high-pressure jet cleaning and disinfection.',
    includes:['Toilet deep clean','Floor scrubbing','Wall tiles clean','Tap polishing','Disinfection'] },
  { id:3,  category:'cleaning',   title:'Sofa / Carpet Cleaning',  price:499,  unit:'per sofa',  rating:4.6, reviews:142, time:'2–3 hrs', providers:6, emoji:'🛋️', popular:false,
    description:'Steam cleaning for sofas, carpets and mattresses. Removes deep stains and allergens.',
    includes:['Foam treatment','Steam cleaning','Stain removal','Odour removal','Drying'] },

  // Plumbing
  { id:4,  category:'plumbing',   title:'Plumber Visit',           price:199,  unit:'visit',     rating:4.7, reviews:312, time:'30 min',  providers:15, emoji:'🔧', popular:true,
    description:'Experienced plumber for pipe leaks, tap repair, drain cleaning and more.',
    includes:['Leak repair','Tap fixing','Drain unclogging','Pipe inspection','Free diagnosis'] },
  { id:5,  category:'plumbing',   title:'Water Tank Cleaning',     price:999,  unit:'500 litres', rating:4.5, reviews:88,  time:'2–3 hrs', providers:5, emoji:'🪣', popular:false,
    description:'Full tank cleaning with disinfection. Prevents algae and bacterial growth.',
    includes:['Tank draining','High-pressure wash','Disinfection','Refill','Report'] },

  // Electrical
  { id:6,  category:'electrical', title:'Electrician Visit',       price:199,  unit:'visit',     rating:4.8, reviews:278, time:'30 min',  providers:14, emoji:'⚡', popular:true,
    description:'Licensed electrician for switch repairs, fan fitting, wiring issues and MCB replacement.',
    includes:['Switch repair','Fan fitting','Wiring check','MCB replacement','Free quote'] },
  { id:7,  category:'electrical', title:'AC Service',              price:599,  unit:'per AC',    rating:4.6, reviews:196, time:'1–2 hrs', providers:9, emoji:'❄️', popular:true,
    description:'AC servicing, deep cleaning, gas refilling and repair for all brands.',
    includes:['Filter cleaning','Coil wash','Gas check','PCB check','Service report'] },

  // Painting
  { id:8,  category:'painting',   title:'Room Painting',           price:2999, unit:'per room',  rating:4.7, reviews:167, time:'1–2 days', providers:7, emoji:'🖌️', popular:true,
    description:'Professional painting with premium emulsion. Includes putty, primer and 2 coats of paint.',
    includes:['Wall putty','Primer coat','2 paint coats','Clean up','1 year warranty'] },
  { id:9,  category:'painting',   title:'Full Home Painting',      price:18999,unit:'2BHK',      rating:4.8, reviews:93,  time:'4–5 days', providers:5, emoji:'🏠', popular:false,
    description:'Complete home interior painting. Asian Paints / Berger options available.',
    includes:['All rooms','Putty + primer','Top coat paint','Doors & windows','Clean-up included'] },

  // Beauty
  { id:10, category:'beauty',     title:'Women\'s Haircut & Style', price:399, unit:'per session', rating:4.9, reviews:445, time:'45 min', providers:10, emoji:'✂️', popular:true,
    description:'Professional stylist at home. Haircut, blow-dry and styling as per your choice.',
    includes:['Haircut','Blow-dry','Styling','Head massage','No salon rush'] },
  { id:11, category:'beauty',     title:'Waxing – Full Body',      price:799,  unit:'per session', rating:4.8, reviews:389, time:'1–1.5 hrs', providers:12, emoji:'💅', popular:true,
    description:'Full body waxing at home by certified beauty professionals. Hygienic disposable strips.',
    includes:['Full body','Rica / Chocolate wax','Aloe gel','Disposable strips','Home comfort'] },
  { id:12, category:'beauty',     title:'Bridal Makeup',           price:4999, unit:'per session', rating:4.9, reviews:67,  time:'2–3 hrs', providers:4, emoji:'👰', popular:false,
    description:'Professional bridal makeup by experienced artists. HD, Airbrush or Natural look.',
    includes:['Consultation','HD makeup','Hair styling','Saree draping','Touch-up kit'] },
  { id:13, category:'beauty',     title:'Men\'s Grooming',          price:299,  unit:'per session', rating:4.7, reviews:221, time:'45 min', providers:8, emoji:'💈', popular:false,
    description:'Haircut, beard trim and face cleanup at home. Professional barber at your door.',
    includes:['Haircut','Beard trim','Face cleanup','Hair wash','Styling'] },

  // Appliance
  { id:14, category:'appliance',  title:'Washing Machine Repair',  price:349,  unit:'visit',     rating:4.6, reviews:134, time:'1–2 hrs', providers:7, emoji:'🫧', popular:false,
    description:'Repair for all brands — LG, Samsung, Whirlpool, IFB. Same day service available.',
    includes:['Diagnosis','Part replacement','Testing','6 month warranty','All brands'] },
  { id:15, category:'appliance',  title:'RO Water Purifier Service',price:299, unit:'visit',     rating:4.7, reviews:178, time:'45 min',  providers:9, emoji:'💧', popular:true,
    description:'RO service, filter change and UV lamp replacement. All brands covered.',
    includes:['Filter change','UV lamp check','TDS test','Tank cleaning','Warranty service'] },

  // Carpentry
  { id:16, category:'carpentry',  title:'Carpenter Visit',         price:199,  unit:'visit',     rating:4.5, reviews:112, time:'1–2 hrs', providers:6, emoji:'🪚', popular:false,
    description:'Door repair, furniture fixing, hinge replacement and custom woodwork.',
    includes:['Door repair','Hinge fixing','Furniture repair','Lock fitting','Free quote'] },

  // Pest Control
  { id:17, category:'pest',       title:'Cockroach Treatment',     price:599,  unit:'1BHK',      rating:4.6, reviews:203, time:'1 hr',    providers:8, emoji:'🦟', popular:true,
    description:'Gel-based cockroach treatment. No smell, safe for children and pets.',
    includes:['Gel treatment','Kitchen focus','All rooms','3 month guarantee','Odourless'] },
  { id:18, category:'pest',       title:'Bed Bug Treatment',       price:1499, unit:'1BHK',      rating:4.7, reviews:98,  time:'2 hrs',   providers:5, emoji:'🛏️', popular:false,
    description:'Heat + chemical treatment for complete bed bug elimination.',
    includes:['Heat treatment','Spray treatment','Mattress treatment','Follow-up visit','Guarantee'] },
];

const SLOT_TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

export default function Services() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [slot, setSlot] = useState({ date: '', time: '', flat: '', notes: '' });
  const [bookings, setBookings] = useState([]);

  const filtered = SERVICES.filter(s => {
    const matchCat = category === 'all' || s.category === category;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const popular = SERVICES.filter(s => s.popular).slice(0, 4);

  const confirmBooking = () => {
    if (!slot.date || !slot.time || !slot.flat) return;
    const newBooking = { ...booking, ...slot, id: Date.now(), status: 'Confirmed',
      bookingId: `SRV${String(Date.now()).slice(-5)}` };
    setBookings([newBooking, ...bookings]);
    setBookingDone(true);
  };

  return (
    <div>
      {/* Search bar */}
      <div style={{ position:'relative', maxWidth:400, marginBottom:20 }}>
        <Search size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }} />
        <input placeholder="Search services — painting, plumber, beauty..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:36 }} />
      </div>

      {/* Popular services banner */}
      {!search && category === 'all' && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-title"><span>🔥 Popular Right Now</span><span className="tag">Society Favourites</span></div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {popular.map(s=>(
              <div key={s.id} onClick={()=>setSelected(s)} style={{ background:'#F1F5F9', borderRadius:12, padding:'14px 16px', cursor:'pointer', border:'1px solid var(--border)', transition:'border-color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ fontSize:32, marginBottom:8 }}>{s.emoji}</div>
                <div style={{ fontWeight:700, fontSize:13.5, color:'var(--white)', marginBottom:4, lineHeight:1.3 }}>{s.title}</div>
                <div style={{ fontSize:12, color:'var(--accent)', fontWeight:700 }}>₹{s.price} <span style={{ color:'var(--muted)', fontWeight:400 }}>{s.unit}</span></div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>⭐ {s.rating} ({s.reviews})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setCategory(c.id)}
            className={`btn btn-sm ${category===c.id?'btn-primary':''}`}
            style={category!==c.id?{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--muted)', whiteSpace:'nowrap' }:{ whiteSpace:'nowrap' }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {filtered.map(s=>(
          <div key={s.id} className="card" style={{ marginBottom:0, cursor:'pointer', transition:'border-color 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
            onClick={()=>setSelected(s)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ fontSize:40 }}>{s.emoji}</div>
              {s.popular && <span className="badge badge-gold" style={{ fontSize:10 }}>⭐ Popular</span>}
            </div>
            <div style={{ fontWeight:700, fontSize:14.5, color:'var(--white)', marginBottom:4 }}>{s.title}</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12, lineHeight:1.5 }}>{s.description.slice(0,65)}...</div>

            <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
              <span style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}><Clock size={12}/> {s.time}</span>
              <span style={{ fontSize:12, color:'var(--muted)' }}>👷 {s.providers} providers</span>
            </div>

            <div style={{ display:'flex', alignItems:'center', marginBottom:12 }}>
              {[...Array(5)].map((_,i)=>(
                <Star key={i} size={12} fill={i<Math.floor(s.rating)?'var(--gold)':'none'} stroke="var(--gold)" style={{ marginRight:1 }} />
              ))}
              <span style={{ fontSize:12, color:'var(--muted)', marginLeft:6 }}>{s.rating} ({s.reviews} reviews)</span>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize:18, fontWeight:800, color:'var(--accent)' }}>₹{s.price}</span>
                <span style={{ fontSize:12, color:'var(--muted)', marginLeft:4 }}>{s.unit}</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={e=>{ e.stopPropagation(); setBooking(s); setSelected(null); }}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length===0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>No services found for "{search}"</div>
      )}

      {/* My bookings strip */}
      {bookings.length>0 && (
        <div className="card" style={{ marginTop:8 }}>
          <div className="card-title"><span>📋 My Bookings</span><span className="tag">{bookings.length} booked</span></div>
          {bookings.map(b=>(
            <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(30,45,69,0.4)' }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:24 }}>{b.emoji}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13.5 }}>{b.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{b.date} · {b.time} · Flat {b.flat}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>Booking ID: {b.bookingId}</div>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <span className="badge badge-green">✓ {b.status}</span>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--accent)', marginTop:4 }}>₹{b.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:520, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:48 }}>{selected.emoji}</div>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={20}/></button>
            </div>
            <div style={{ fontWeight:800, fontSize:20, color:'var(--white)', marginBottom:4 }}>{selected.title}</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              {[...Array(5)].map((_,i)=>(
                <Star key={i} size={13} fill={i<Math.floor(selected.rating)?'var(--gold)':'none'} stroke="var(--gold)" />
              ))}
              <span style={{ fontSize:13, color:'var(--muted)' }}>{selected.rating} · {selected.reviews} reviews · {selected.providers} providers</span>
            </div>
            <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.7, marginBottom:16 }}>{selected.description}</div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', marginBottom:8 }}>What's included</div>
              {selected.includes.map(item=>(
                <div key={item} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, marginBottom:6 }}>
                  <CheckCircle size={14} style={{ color:'var(--accent)', flexShrink:0 }}/> {item}
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:16, padding:'14px 0', borderTop:'1px solid var(--border)', marginBottom:16 }}>
              <span style={{ fontSize:13, color:'var(--muted)', display:'flex', alignItems:'center', gap:6 }}><Clock size={13}/>{selected.time}</span>
              <span style={{ fontSize:13, color:'var(--muted)' }}>👷 {selected.providers} available</span>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <span style={{ fontSize:26, fontWeight:800, color:'var(--accent)' }}>₹{selected.price}</span>
                <span style={{ fontSize:13, color:'var(--muted)', marginLeft:6 }}>{selected.unit}</span>
              </div>
              <button className="btn btn-primary" onClick={()=>{ setBooking(selected); setSelected(null); }}>Book Now →</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking modal */}
      {booking && !bookingDone && (
        <div className="modal-overlay" onClick={()=>{setBooking(null);setSlot({date:'',time:'',flat:'',notes:''});}}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:480 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>Book {booking.title}</div>
                <div style={{ fontSize:13, color:'var(--accent)', marginTop:2 }}>₹{booking.price} · {booking.unit}</div>
              </div>
              <button onClick={()=>{setBooking(null);setSlot({date:'',time:'',flat:'',notes:''});}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={20}/></button>
            </div>

            <div className="form-row">
              <label className="field-label">Your Flat Number</label>
              <input placeholder="A-101" value={slot.flat} onChange={e=>setSlot({...slot,flat:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Preferred Date</label>
              <input type="date" value={slot.date} onChange={e=>setSlot({...slot,date:e.target.value})} min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div className="form-row">
              <label className="field-label">Preferred Time Slot</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginTop:4 }}>
                {SLOT_TIMES.map(t=>(
                  <button key={t} onClick={()=>setSlot({...slot,time:t})}
                    className={`btn btn-sm`}
                    style={{ fontSize:11, padding:'6px 0', justifyContent:'center',
                      background: slot.time===t ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                      color: slot.time===t ? 'var(--bg)' : 'var(--muted)',
                      border: `1px solid ${slot.time===t?'var(--accent)':'var(--border)'}` }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-row">
              <label className="field-label">Special Instructions (Optional)</label>
              <textarea placeholder="e.g. call before coming, use back door..." value={slot.notes} onChange={e=>setSlot({...slot,notes:e.target.value})} style={{ minHeight:60 }}/>
            </div>

            {(!slot.date||!slot.time||!slot.flat) && (
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>⚠️ Please fill flat number, date and time slot to confirm.</div>
            )}

            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
              onClick={confirmBooking} disabled={!slot.date||!slot.time||!slot.flat}>
              ✅ Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Booking success modal */}
      {bookingDone && (
        <div className="modal-overlay" onClick={()=>{setBookingDone(false);setBooking(null);setSlot({date:'',time:'',flat:'',notes:''});}}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:400, textAlign:'center' }}>
            <div style={{ fontSize:60, marginBottom:12 }}>🎉</div>
            <div style={{ fontWeight:800, fontSize:20, color:'var(--white)', marginBottom:6 }}>Booking Confirmed!</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginBottom:16, lineHeight:1.6 }}>
              Your booking for <strong style={{ color:'var(--accent)' }}>{booking?.title}</strong> is confirmed.<br/>
              {slot.date} at {slot.time} · Flat {slot.flat}
            </div>
            <div style={{ background:'rgba(0,198,167,0.1)', border:'1px solid rgba(0,198,167,0.3)', borderRadius:10, padding:'12px', marginBottom:20, fontSize:13 }}>
              Booking ID: <strong style={{ color:'var(--accent)' }}>{bookings[0]?.bookingId}</strong><br/>
              <span style={{ color:'var(--muted)', fontSize:12 }}>You will receive a confirmation SMS shortly.</span>
            </div>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
              onClick={()=>{setBookingDone(false);setBooking(null);setSlot({date:'',time:'',flat:'',notes:''});}}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
