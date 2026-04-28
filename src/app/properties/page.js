'use client';
import { useState } from 'react';
import { Plus, X, Phone, Mail, BedDouble, Bath, Maximize, MapPin, Heart, Share2, Eye } from 'lucide-react';

const initialProperties = [
  {
    id: 1, flat: 'A-301', type: 'Sale', bhk: 2, floor: 3, area: 950, price: 8500000,
    owner: 'Suresh Mehta', phone: '9820011234', email: 'suresh@email.com',
    amenities: ['Parking', 'Gym', 'Garden'], furnished: 'Semi-Furnished',
    available: 'Immediate', bathrooms: 2, facing: 'East', description: 'Beautiful 2BHK with great ventilation and city view. Recently renovated with modular kitchen.',
    emoji: '🏢', views: 34, likes: 8,
  },
  {
    id: 2, flat: 'B-102', type: 'Rent', bhk: 1, floor: 1, area: 620, price: 22000,
    owner: 'Priya Verma', phone: '9876512345', email: 'priya@email.com',
    amenities: ['Parking', 'Security'], furnished: 'Fully Furnished',
    available: '1 May 2025', bathrooms: 1, facing: 'West', description: 'Cozy 1BHK fully furnished flat. Ideal for working professionals. All utilities included.',
    emoji: '🏠', views: 52, likes: 15,
  },
  {
    id: 3, flat: 'C-401', type: 'Sale', bhk: 3, floor: 4, area: 1350, price: 12500000,
    owner: 'Rajesh Iyer', phone: '9765123456', email: 'rajesh@email.com',
    amenities: ['Parking', 'Gym', 'Pool', 'Garden', 'Club House'], furnished: 'Unfurnished',
    available: 'Immediate', bathrooms: 3, facing: 'North', description: 'Spacious 3BHK corner flat with panoramic view. Premium fittings, large balcony.',
    emoji: '🏗️', views: 78, likes: 22,
  },
  {
    id: 4, flat: 'D-203', type: 'Rent', bhk: 2, floor: 2, area: 880, price: 35000,
    owner: 'Anita Sharma', phone: '9654321987', email: 'anita@email.com',
    amenities: ['Parking', 'Gym', 'Security', 'Garden'], furnished: 'Semi-Furnished',
    available: '15 May 2025', bathrooms: 2, facing: 'South', description: 'Well-maintained 2BHK in prime location. Newly painted, modular kitchen, 24/7 security.',
    emoji: '🏡', views: 41, likes: 11,
  },
];

const AMENITY_ICONS = { Parking: '🚗', Gym: '💪', Pool: '🏊', Garden: '🌳', Security: '🔒', 'Club House': '🎳' };

export default function Properties() {
  const [properties, setProperties] = useState(initialProperties);
  const [filter, setFilter] = useState('All');
  const [bhkFilter, setBhkFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [liked, setLiked] = useState({});
  const [form, setForm] = useState({
    flat: '', type: 'Sale', bhk: 2, floor: '', area: '', price: '',
    owner: '', phone: '', email: '', furnished: 'Semi-Furnished',
    available: '', facing: 'East', description: '', bathrooms: 2,
  });

  const filtered = properties.filter(p => {
    const matchType = filter === 'All' || p.type === filter;
    const matchBHK  = bhkFilter === 'All' || p.bhk === Number(bhkFilter);
    return matchType && matchBHK;
  });

  const formatPrice = (p, type) =>
    type === 'Rent'
      ? `₹${p.toLocaleString()}/mo`
      : p >= 10000000
        ? `₹${(p / 10000000).toFixed(1)} Cr`
        : `₹${(p / 100000).toFixed(0)} L`;

  const addListing = () => {
    if (!form.flat || !form.owner) return;
    setProperties([{
      ...form, id: Date.now(), bhk: Number(form.bhk), bathrooms: Number(form.bathrooms),
      area: Number(form.area), price: Number(form.price), floor: Number(form.floor),
      amenities: ['Parking', 'Security'], emoji: '🏢', views: 0, likes: 0,
    }, ...properties]);
    setShowForm(false);
    setForm({ flat:'',type:'Sale',bhk:2,floor:'',area:'',price:'',owner:'',phone:'',email:'',furnished:'Semi-Furnished',available:'',facing:'East',description:'',bathrooms:2 });
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        {['All','Sale','Rent'].map(f => (
          <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`} onClick={()=>setFilter(f)}>{f==='Sale'?'🏷️ For Sale':f==='Rent'?'🔑 For Rent':'All Listings'}</button>
        ))}
        <div style={{ display:'flex', gap:6, marginLeft:8 }}>
          {['All','1','2','3'].map(b => (
            <button key={b} className={`btn btn-sm ${bhkFilter===b?'btn-blue':'btn-outline'}`} onClick={()=>setBhkFilter(b)}>
              {b==='All'?'Any BHK':`${b} BHK`}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={()=>setShowForm(!showForm)}>
          <Plus size={14}/> List Property
        </button>
      </div>

      {/* Add listing form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>🏠 List Your Property</span>
            <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)'}}><X size={18}/></button>
          </div>
          <div className="form-grid-4" style={{marginBottom:14}}>
            <div className="form-row"><label className="field-label">Flat No.</label><input placeholder="A-301" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/></div>
            <div className="form-row"><label className="field-label">Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option>Sale</option><option>Rent</option>
              </select>
            </div>
            <div className="form-row"><label className="field-label">BHK</label>
              <select value={form.bhk} onChange={e=>setForm({...form,bhk:e.target.value})}>
                <option value={1}>1 BHK</option><option value={2}>2 BHK</option><option value={3}>3 BHK</option>
              </select>
            </div>
            <div className="form-row"><label className="field-label">Floor</label><input type="number" placeholder="3" value={form.floor} onChange={e=>setForm({...form,floor:e.target.value})}/></div>
            <div className="form-row"><label className="field-label">Area (sq ft)</label><input type="number" placeholder="950" value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></div>
            <div className="form-row"><label className="field-label">{form.type==='Rent'?'Rent/month (₹)':'Price (₹)'}</label><input type="number" placeholder={form.type==='Rent'?'25000':'8500000'} value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
            <div className="form-row"><label className="field-label">Furnished</label>
              <select value={form.furnished} onChange={e=>setForm({...form,furnished:e.target.value})}>
                <option>Fully Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option>
              </select>
            </div>
            <div className="form-row"><label className="field-label">Available From</label><input placeholder="Immediate" value={form.available} onChange={e=>setForm({...form,available:e.target.value})}/></div>
            <div className="form-row"><label className="field-label">Owner Name</label><input placeholder="Your Name" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></div>
            <div className="form-row"><label className="field-label">Phone</label><input placeholder="9820012345" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            <div className="form-row col-span-2"><label className="field-label">Email</label><input type="email" placeholder="owner@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div className="form-row col-span-2" style={{gridColumn:'span 4'}}><label className="field-label">Description</label><textarea placeholder="Describe your property..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          </div>
          <button className="btn btn-primary" onClick={addListing}>📋 Submit Listing</button>
        </div>
      )}

      {/* Stats */}
      <div style={{display:'flex',gap:12,marginBottom:20}}>
        {[
          {label:'For Sale', count:properties.filter(p=>p.type==='Sale').length, color:'var(--accent)'},
          {label:'For Rent', count:properties.filter(p=>p.type==='Rent').length, color:'var(--accent2)'},
          {label:'Total Listings', count:properties.length, color:'var(--gold)'},
        ].map(s=>(
          <div key={s.label} className="stat-card" style={{flex:1,padding:'14px 18px'}}>
            <div className="stat-value" style={{fontSize:22,color:s.color}}>{s.count}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Property cards grid */}
      <div className="grid-2">
        {filtered.map(p=>(
          <div key={p.id} className="card" style={{marginBottom:0,cursor:'pointer',transition:'border-color 0.15s',borderColor: selected?.id===p.id?'var(--accent)':'var(--border)'}} onClick={()=>setSelected(p)}>
            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div style={{fontSize:36}}>{p.emoji}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:'var(--white)'}}>{p.bhk} BHK Flat – {p.flat}</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2,display:'flex',alignItems:'center',gap:4}}><MapPin size={11}/> Sunrise Residency, {p.facing} facing, Floor {p.floor}</div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <span className={`badge ${p.type==='Sale'?'badge-green':'badge-blue'}`} style={{fontSize:12,padding:'4px 12px'}}>{p.type==='Sale'?'🏷️ FOR SALE':'🔑 FOR RENT'}</span>
                <div style={{fontSize:20,fontWeight:800,color:p.type==='Sale'?'var(--accent)':'var(--accent2)',marginTop:6}}>{formatPrice(p.price,p.type)}</div>
              </div>
            </div>

            {/* Details row */}
            <div style={{display:'flex',gap:16,padding:'10px 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',marginBottom:12}}>
              {[
                {icon:<BedDouble size={14}/>,  label:`${p.bhk} BHK`},
                {icon:<Bath size={14}/>,        label:`${p.bathrooms} Bath`},
                {icon:<Maximize size={14}/>,    label:`${p.area} sq.ft`},
                {icon:<span style={{fontSize:12}}>🏠</span>, label:p.furnished},
              ].map((d,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'var(--muted)'}}>
                  {d.icon} {d.label}
                </div>
              ))}
            </div>

            <div style={{fontSize:13,color:'var(--muted)',marginBottom:12,lineHeight:1.5}}>{p.description.slice(0,90)}...</div>

            {/* Amenities */}
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
              {p.amenities.map(a=>(
                <span key={a} style={{fontSize:11,background:'rgba(255,255,255,0.05)',color:'var(--text)',padding:'3px 10px',borderRadius:99,display:'flex',alignItems:'center',gap:4}}>
                  {AMENITY_ICONS[a]||'✨'} {a}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:12,color:'var(--muted)'}}>
                👤 {p.owner} &nbsp;·&nbsp; <Eye size={11} style={{display:'inline'}}/> {p.views} views
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-sm" style={{background:'none',border:'1.5px solid var(--border)',color:liked[p.id]?'var(--red)':'var(--muted)',padding:'5px 10px'}}
                  onClick={e=>{e.stopPropagation();setLiked({...liked,[p.id]:!liked[p.id]});}}>
                  <Heart size={13} fill={liked[p.id]?'var(--red)':'none'}/> {p.likes+(liked[p.id]?1:0)}
                </button>
                <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();setSelected(p);}}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length===0&&<div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>No properties found.</div>}

      {/* Detail modal */}
      {selected&&(
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:580,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
              <div>
                <span className={`badge ${selected.type==='Sale'?'badge-green':'badge-blue'}`}>{selected.type==='Sale'?'🏷️ FOR SALE':'🔑 FOR RENT'}</span>
                <div style={{fontSize:20,fontWeight:800,color:'var(--white)',marginTop:8}}>{selected.bhk} BHK Flat — {selected.flat}</div>
                <div style={{fontSize:13,color:'var(--muted)',marginTop:3}}>Sunrise Residency · Floor {selected.floor} · {selected.facing} facing</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)'}}><X size={20}/></button>
            </div>

            <div style={{fontSize:28,fontWeight:800,color:selected.type==='Sale'?'var(--accent)':'var(--accent2)',marginBottom:16}}>{formatPrice(selected.price,selected.type)}</div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[
                {label:'BHK',        value:`${selected.bhk} BHK`},
                {label:'Area',       value:`${selected.area} sq.ft`},
                {label:'Bathrooms',  value:selected.bathrooms},
                {label:'Floor',      value:`${selected.floor}th Floor`},
                {label:'Furnished',  value:selected.furnished},
                {label:'Facing',     value:`${selected.facing} Facing`},
                {label:'Available',  value:selected.available},
                {label:'Views',      value:`${selected.views} views`},
              ].map(f=>(
                <div key={f.label} style={{background:'#F1F5F9',borderRadius:8,padding:'10px 14px'}}>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:3,textTransform:'uppercase',letterSpacing:'0.5px'}}>{f.label}</div>
                  <div style={{fontWeight:700,fontSize:14}}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{background:'#F8FAFC',borderRadius:10,padding:'14px 16px',marginBottom:16,fontSize:13,lineHeight:1.7,color:'var(--text)'}}>{selected.description}</div>

            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:'var(--muted)',marginBottom:8,fontWeight:600,textTransform:'uppercase'}}>Amenities</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {selected.amenities.map(a=>(
                  <span key={a} style={{fontSize:12,background:'rgba(0,198,167,0.1)',color:'var(--accent)',padding:'5px 12px',borderRadius:99}}>
                    {AMENITY_ICONS[a]||'✨'} {a}
                  </span>
                ))}
              </div>
            </div>

            <div style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:12,padding:'16px 18px',marginBottom:16}}>
              <div style={{fontWeight:700,color:'var(--white)',marginBottom:10}}>👤 Contact Owner</div>
              <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                <span style={{fontSize:13,color:'var(--muted)',display:'flex',alignItems:'center',gap:6}}><Phone size={13}/>{selected.phone}</span>
                <span style={{fontSize:13,color:'var(--muted)',display:'flex',alignItems:'center',gap:6}}><Mail size={13}/>{selected.email}</span>
              </div>
            </div>

            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}}><Phone size={14}/> Call Owner</button>
              <button className="btn btn-blue" style={{flex:1,justifyContent:'center'}}><Mail size={14}/> Send Enquiry</button>
              <button className="btn btn-sm" style={{background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',color:'var(--muted)'}}><Share2 size={14}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
