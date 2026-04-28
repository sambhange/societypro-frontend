'use client';
import { useState } from 'react';
import { Plus, X, Search, Car, Bike, Truck, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const WINGS = ['A', 'B', 'C', 'D'];

// Generate 40 parking slots: P1-P40
const generateSlots = () => {
  const slots = [];
  for (let i = 1; i <= 40; i++) {
    slots.push({
      id: i,
      slotNo: `P${String(i).padStart(2, '0')}`,
      type: i <= 24 ? 'Four Wheeler' : 'Two Wheeler',
      wing: WINGS[Math.floor((i - 1) / 10)],
      assignedTo: null,
      vehicle: null,
    });
  }
  return slots;
};

const initialVehicles = [
  { id: 1, flat: 'A-101', owner: 'Ramesh Sharma',  slotNo: 'P01', type: 'Four Wheeler', brand: 'Maruti',  model: 'Swift',      vehicleNo: 'MH04-AB1234', color: 'White',  charges: 500,  status: 'Active' },
  { id: 2, flat: 'A-102', owner: 'Priya Mehta',    slotNo: 'P02', type: 'Four Wheeler', brand: 'Honda',   model: 'City',       vehicleNo: 'MH04-CD5678', color: 'Silver', charges: 500,  status: 'Active' },
  { id: 3, flat: 'B-201', owner: 'Anjali Verma',   slotNo: 'P03', type: 'Four Wheeler', brand: 'Hyundai', model: 'i20',        vehicleNo: 'MH02-EF9012', color: 'Red',    charges: 500,  status: 'Active' },
  { id: 4, flat: 'B-202', owner: 'Suresh Patel',   slotNo: 'P04', type: 'Four Wheeler', brand: 'Toyota',  model: 'Innova',     vehicleNo: 'MH02-GH3456', color: 'Grey',   charges: 800,  status: 'Active' },
  { id: 5, flat: 'C-301', owner: 'Neha Singh',     slotNo: 'P25', type: 'Two Wheeler',  brand: 'Honda',   model: 'Activa',     vehicleNo: 'MH01-IJ7890', color: 'Blue',   charges: 200,  status: 'Active' },
  { id: 6, flat: 'C-302', owner: 'Vikram Joshi',   slotNo: 'P26', type: 'Two Wheeler',  brand: 'Bajaj',   model: 'Pulsar',     vehicleNo: 'MH01-KL2345', color: 'Black',  charges: 200,  status: 'Active' },
  { id: 7, flat: 'D-401', owner: 'Meena Iyer',     slotNo: 'P05', type: 'Four Wheeler', brand: 'Tata',    model: 'Nexon',      vehicleNo: 'MH05-MN6789', color: 'Orange', charges: 500,  status: 'Active' },
  { id: 8, flat: 'D-402', owner: 'Arjun Nair',     slotNo: 'P27', type: 'Two Wheeler',  brand: 'Royal Enfield', model: 'Classic 350', vehicleNo: 'MH05-OP0123', color: 'Black', charges: 200, status: 'Active' },
];

const VEHICLE_TYPES = ['Four Wheeler', 'Two Wheeler', 'Three Wheeler'];
const VEHICLE_BRANDS = ['Maruti', 'Honda', 'Hyundai', 'Toyota', 'Tata', 'Mahindra', 'Bajaj', 'Royal Enfield', 'TVS', 'Hero', 'Other'];

const typeIcon = (type) => {
  if (type === 'Two Wheeler')   return <Bike  size={16} />;
  if (type === 'Three Wheeler') return <Truck size={16} />;
  return <Car size={16} />;
};

const typeColor = (type) => {
  if (type === 'Two Wheeler')   return 'var(--accent2)';
  if (type === 'Three Wheeler') return 'var(--gold)';
  return 'var(--accent)';
};

export default function Parking() {
  const [vehicles, setVehicles]     = useState(initialVehicles);
  const [slots]                     = useState(generateSlots());
  const [tab, setTab]               = useState('vehicles'); // vehicles | slots | map
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showForm, setShowForm]     = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState({
    flat: '', owner: '', slotNo: '', type: 'Four Wheeler',
    brand: 'Maruti', model: '', vehicleNo: '', color: '', charges: 500,
  });

  const assignedSlots = new Set(vehicles.map(v => v.slotNo));

  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !search || v.flat.toLowerCase().includes(q) ||
      v.owner.toLowerCase().includes(q) || v.vehicleNo.toLowerCase().includes(q) ||
      v.slotNo.toLowerCase().includes(q);
    const matchT = filterType === 'All' || v.type === filterType;
    return matchQ && matchT;
  });

  const openForm = (item = null) => {
    if (item) {
      setForm({ ...item });
      setEditItem(item);
    } else {
      setForm({ flat:'', owner:'', slotNo:'', type:'Four Wheeler', brand:'Maruti', model:'', vehicleNo:'', color:'', charges:500 });
      setEditItem(null);
    }
    setShowForm(true);
  };

  const saveVehicle = () => {
    if (!form.flat || !form.vehicleNo || !form.slotNo) return;
    if (editItem) {
      setVehicles(vehicles.map(v => v.id === editItem.id ? { ...v, ...form } : v));
    } else {
      setVehicles([...vehicles, { ...form, id: Date.now(), status: 'Active' }]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const removeVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const stats = {
    total4W:    vehicles.filter(v => v.type === 'Four Wheeler').length,
    total2W:    vehicles.filter(v => v.type === 'Two Wheeler').length,
    totalSlots: slots.length,
    available:  slots.length - assignedSlots.size,
    revenue:    vehicles.reduce((s, v) => s + Number(v.charges), 0),
  };

  // Slot map view
  const SlotMap = () => (
    <div className="card">
      <div className="card-title">
        <span>🅿️ Parking Slot Map</span>
        <div style={{ display:'flex', gap:12, fontSize:12 }}>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:12, height:12, borderRadius:3, background:'var(--accent)', display:'inline-block' }}/> Occupied</span>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:12, height:12, borderRadius:3, background:'var(--border)', display:'inline-block' }}/> Available</span>
        </div>
      </div>

      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>🚗 Four Wheeler (P01 – P24)</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:8 }}>
          {slots.filter(s => s.type === 'Four Wheeler').map(s => {
            const v = vehicles.find(v => v.slotNo === s.slotNo);
            const occupied = !!v;
            return (
              <div key={s.id} title={occupied ? `${v.flat} — ${v.vehicleNo}` : 'Available'}
                style={{
                  background: occupied ? 'rgba(0,198,167,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${occupied ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 8, padding:'8px 4px',
                  textAlign:'center', cursor: occupied ? 'pointer' : 'default',
                  transition:'all 0.12s',
                }}
                onClick={() => { if (v) setSelected(v); }}
              >
                <div style={{ fontSize:10, fontWeight:700, color: occupied ? 'var(--accent)' : 'var(--muted)', marginBottom:3 }}>{s.slotNo}</div>
                <Car size={14} style={{ color: occupied ? 'var(--accent)' : 'var(--border)' }}/>
                {occupied && <div style={{ fontSize:9, color:'var(--muted)', marginTop:2 }}>{v.flat}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>🛵 Two Wheeler (P25 – P40)</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:8 }}>
          {slots.filter(s => s.type === 'Two Wheeler').map(s => {
            const v = vehicles.find(v => v.slotNo === s.slotNo);
            const occupied = !!v;
            return (
              <div key={s.id} title={occupied ? `${v.flat} — ${v.vehicleNo}` : 'Available'}
                style={{
                  background: occupied ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${occupied ? 'var(--accent2)' : 'var(--border)'}`,
                  borderRadius:8, padding:'8px 4px',
                  textAlign:'center', cursor: occupied ? 'pointer' : 'default',
                  transition:'all 0.12s',
                }}
                onClick={() => { if (v) setSelected(v); }}
              >
                <div style={{ fontSize:10, fontWeight:700, color: occupied ? 'var(--accent2)' : 'var(--muted)', marginBottom:3 }}>{s.slotNo}</div>
                <Bike size={14} style={{ color: occupied ? 'var(--accent2)' : 'var(--border)' }}/>
                {occupied && <div style={{ fontSize:9, color:'var(--muted)', marginTop:2 }}>{v.flat}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Top bar */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', maxWidth:280 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search flat, owner, vehicle no..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        {['All','Four Wheeler','Two Wheeler'].map(t => (
          <button key={t} className={`btn btn-sm ${filterType===t?'btn-primary':'btn-outline'}`}
            onClick={() => setFilterType(t)}>
            {t==='Four Wheeler'?'🚗':t==='Two Wheeler'?'🛵':''} {t}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => openForm()}>
          <Plus size={14}/> Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Four Wheelers',   value: stats.total4W,                 color:'var(--accent)',  icon:'🚗' },
          { label:'Two Wheelers',    value: stats.total2W,                 color:'var(--accent2)', icon:'🛵' },
          { label:'Slots Available', value: `${stats.available}/${stats.totalSlots}`, color:'var(--gold)', icon:'🅿️' },
          { label:'Monthly Revenue', value: `₹${stats.revenue.toLocaleString()}`, color:'var(--accent)', icon:'💰' },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ fontSize:22, color:s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18 }}>
        {[
          { id:'vehicles', label:'🚗 Vehicle List' },
          { id:'slots',    label:'🅿️ Slot Map' },
        ].map(t => (
          <button key={t.id} className={`btn ${tab===t.id?'btn-primary':'btn-outline'}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>{editItem ? '✏️ Edit Vehicle' : '🚗 Add New Vehicle'}</span>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={18}/></button>
          </div>
          <div className="form-grid-4" style={{ marginBottom:14 }}>
            <div className="form-row">
              <label className="field-label">Flat No.</label>
              <input placeholder="A-101" value={form.flat} onChange={e=>setForm({...form,flat:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Owner Name</label>
              <input placeholder="Resident Name" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Vehicle Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Parking Slot</label>
              <select value={form.slotNo} onChange={e=>setForm({...form,slotNo:e.target.value})}>
                <option value="">Select slot</option>
                {slots
                  .filter(s => !assignedSlots.has(s.slotNo) || s.slotNo === form.slotNo)
                  .map(s => (
                    <option key={s.slotNo} value={s.slotNo}>
                      {s.slotNo} — {s.type} ({s.wing} Wing)
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Vehicle Brand</label>
              <select value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}>
                {VEHICLE_BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Model</label>
              <input placeholder="Swift, Activa..." value={form.model} onChange={e=>setForm({...form,model:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Vehicle Number</label>
              <input placeholder="MH04-AB1234" value={form.vehicleNo} onChange={e=>setForm({...form,vehicleNo:e.target.value.toUpperCase()})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Color</label>
              <input placeholder="White, Black..." value={form.color} onChange={e=>setForm({...form,color:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Monthly Charges (₹)</label>
              <input type="number" value={form.charges} onChange={e=>setForm({...form,charges:Number(e.target.value)})}/>
            </div>
            <div style={{ gridColumn:'span 3', display:'flex', alignItems:'flex-end', paddingBottom:14 }}>
              <div style={{ fontSize:12, color:'var(--muted)', padding:'10px 14px', background:'rgba(245,158,11,0.1)', borderRadius:8, border:'1px solid rgba(245,158,11,0.2)' }}>
                💡 Parking charges will be auto-added to the flat's monthly maintenance bill.
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={saveVehicle}>
            {editItem ? '✏️ Update Vehicle' : '🚗 Register Vehicle'}
          </button>
        </div>
      )}

      {/* Vehicle list tab */}
      {tab === 'vehicles' && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>🚗 Registered Vehicles ({filtered.length})</span>
            <span className="tag">₹{stats.revenue.toLocaleString()} / month total</span>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'50px 0', color:'var(--muted)' }}>No vehicles found.</div>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {['Slot','Flat','Owner','Type','Brand & Model','Vehicle No.','Color','Charges','Actions'].map(h=>(
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td>
                      <span style={{ fontWeight:800, fontSize:14, color:typeColor(v.type) }}>{v.slotNo}</span>
                    </td>
                    <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{v.flat}</span></td>
                    <td style={{ fontWeight:600 }}>{v.owner}</td>
                    <td>
                      <span style={{ display:'flex', alignItems:'center', gap:6, color:typeColor(v.type) }}>
                        {typeIcon(v.type)}
                        <span style={{ fontSize:12 }}>{v.type}</span>
                      </span>
                    </td>
                    <td style={{ color:'var(--text)' }}>{v.brand} {v.model}</td>
                    <td>
                      <span style={{ fontFamily:'monospace', fontSize:13, fontWeight:700, color:'var(--white)', letterSpacing:'0.5px' }}>{v.vehicleNo}</span>
                    </td>
                    <td style={{ color:'var(--muted)', fontSize:13 }}>{v.color}</td>
                    <td>
                      <span style={{ fontWeight:700, color:'var(--accent)' }}>₹{Number(v.charges).toLocaleString()}</span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { setSelected(v); }}>
                          <span style={{ fontSize:11 }}>View</span>
                        </button>
                        <button className="btn btn-sm" style={{ background:'rgba(59,130,246,0.15)', color:'var(--accent2)', border:'none' }}
                          onClick={() => openForm(v)}>
                          <Edit2 size={12}/>
                        </button>
                        <button className="btn btn-sm" style={{ background:'rgba(239,68,68,0.15)', color:'var(--red)', border:'none' }}
                          onClick={() => removeVehicle(v.id)}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div style={{ display:'flex', gap:24, padding:'14px 22px', borderTop:'1px solid var(--border)', fontSize:13 }}>
            <span>🚗 Four Wheeler: <strong style={{ color:'var(--accent)' }}>{stats.total4W}</strong></span>
            <span>🛵 Two Wheeler: <strong style={{ color:'var(--accent2)' }}>{stats.total2W}</strong></span>
            <span>🅿️ Available Slots: <strong style={{ color:'var(--gold)' }}>{stats.available}</strong></span>
            <span style={{ marginLeft:'auto' }}>Monthly Parking Revenue: <strong style={{ color:'var(--accent)' }}>₹{stats.revenue.toLocaleString()}</strong></span>
          </div>
        </div>
      )}

      {/* Slot map tab */}
      {tab === 'slots' && <SlotMap />}

      {/* Vehicle detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:480 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${typeColor(selected.type)}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {selected.type === 'Two Wheeler' ? <Bike size={24} style={{ color:typeColor(selected.type) }}/> : <Car size={24} style={{ color:typeColor(selected.type) }}/>}
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>{selected.brand} {selected.model}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>{selected.type}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={20}/></button>
            </div>

            {/* Vehicle number plate style */}
            <div style={{ background:'#FFF', borderRadius:10, padding:'10px 20px', marginBottom:20, textAlign:'center', border:'3px solid #003580' }}>
              <div style={{ fontSize:10, color:'#003580', fontWeight:700, letterSpacing:'2px', marginBottom:2 }}>INDIA 🇮🇳</div>
              <div style={{ fontSize:26, fontWeight:900, color:'#000', letterSpacing:'3px', fontFamily:'monospace' }}>{selected.vehicleNo}</div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              {[
                { label:'Flat No.',        value: selected.flat },
                { label:'Owner',           value: selected.owner },
                { label:'Parking Slot',    value: selected.slotNo },
                { label:'Color',           value: selected.color },
                { label:'Monthly Charges', value: `₹${Number(selected.charges).toLocaleString()}` },
                { label:'Status',          value: selected.status },
              ].map(f => (
                <div key={f.label} style={{ background:'#F1F5F9', borderRadius:8, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>{f.label}</div>
                  <div style={{ fontWeight:700, fontSize:14, color: f.label==='Monthly Charges'?'var(--accent)':f.label==='Status'?'var(--accent)':'var(--white)' }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
                onClick={() => { openForm(selected); setSelected(null); }}>
                <Edit2 size={14}/> Edit Vehicle
              </button>
              <button className="btn btn-sm" style={{ background:'rgba(239,68,68,0.15)', color:'var(--red)', border:'none', padding:'8px 18px' }}
                onClick={() => removeVehicle(selected.id)}>
                <Trash2 size={14}/> Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
