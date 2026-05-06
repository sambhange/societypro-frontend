'use client';
import { useState } from 'react';
import { exportToCSV, exportToExcel, ExportButtons } from '../../lib/export';
import { Plus, Search, CheckCircle, Clock, AlertCircle, X, Download } from 'lucide-react';

const MONTHS = ['April 2025','March 2025','February 2025','January 2025','December 2024','November 2024'];

const initialRecords = [
  { id:1,  flat:'A-101', name:'Ramesh Sharma',   month:'April 2025',    amount:2500, status:'Paid',    paidOn:'2 Apr 2025',  method:'UPI'  },
  { id:2,  flat:'A-102', name:'Priya Mehta',      month:'April 2025',    amount:2500, status:'Pending', paidOn:'-',           method:'-'    },
  { id:3,  flat:'B-201', name:'Anjali Verma',     month:'April 2025',    amount:2500, status:'Paid',    paidOn:'1 Apr 2025',  method:'UPI'  },
  { id:4,  flat:'B-202', name:'Suresh Patel',     month:'April 2025',    amount:2500, status:'Overdue', paidOn:'-',           method:'-'    },
  { id:5,  flat:'C-301', name:'Neha Singh',       month:'April 2025',    amount:2500, status:'Paid',    paidOn:'3 Apr 2025',  method:'Cash' },
  { id:6,  flat:'C-302', name:'Vikram Joshi',     month:'April 2025',    amount:2500, status:'Pending', paidOn:'-',           method:'-'    },
  { id:7,  flat:'D-401', name:'Meena Iyer',       month:'April 2025',    amount:2500, status:'Paid',    paidOn:'1 Apr 2025',  method:'UPI'  },
  { id:8,  flat:'D-402', name:'Arjun Nair',       month:'April 2025',    amount:2500, status:'Overdue', paidOn:'-',           method:'-'    },
  { id:9,  flat:'A-101', name:'Ramesh Sharma',    month:'March 2025',    amount:2500, status:'Paid',    paidOn:'3 Mar 2025',  method:'UPI'  },
  { id:10, flat:'A-102', name:'Priya Mehta',      month:'March 2025',    amount:2500, status:'Paid',    paidOn:'5 Mar 2025',  method:'UPI'  },
  { id:11, flat:'B-202', name:'Suresh Patel',     month:'March 2025',    amount:2500, status:'Overdue', paidOn:'-',           method:'-'    },
  { id:12, flat:'B-201', name:'Anjali Verma',     month:'March 2025',    amount:2500, status:'Paid',    paidOn:'2 Mar 2025',  method:'Cash' },
];

const STATUS_CONFIG = {
  Paid:    { badge:'badge-green', icon:<CheckCircle size={12}/>, color:'var(--accent)'  },
  Pending: { badge:'badge-gold',  icon:<Clock size={12}/>,       color:'var(--gold)'    },
  Overdue: { badge:'badge-red',   icon:<AlertCircle size={12}/>, color:'var(--red)'     },
};

export default function Maintenance() {
  const [records, setRecords] = useState(initialRecords);
  const [search,  setSearch]  = useState('');
  const [month,   setMonth]   = useState('April 2025');
  const [status,  setStatus]  = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ flat:'', name:'', month:'April 2025', amount:2500 });

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.flat.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    const matchMonth  = month === 'All' || r.month === month;
    const matchStatus = status === 'All' || r.status === status;
    return matchSearch && matchMonth && matchStatus;
  });

  const markPaid = (id) => {
    setRecords(records.map(r => r.id === id
      ? { ...r, status:'Paid', paidOn: new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), method:'Cash' }
      : r));
  };

  const bulkGenerate = () => {
    const flats = [
      { flat:'A-101', name:'Ramesh Sharma' }, { flat:'A-102', name:'Priya Mehta' },
      { flat:'B-201', name:'Anjali Verma' },  { flat:'B-202', name:'Suresh Patel' },
      { flat:'C-301', name:'Neha Singh' },    { flat:'C-302', name:'Vikram Joshi' },
      { flat:'D-401', name:'Meena Iyer' },    { flat:'D-402', name:'Arjun Nair' },
    ];
    const newMonth = 'May 2025';
    const exists   = records.filter(r => r.month === newMonth);
    if (exists.length > 0) { alert(`Bills for ${newMonth} already exist!`); return; }
    const newBills = flats.map((f, i) => ({
      id: Date.now() + i, ...f, month: newMonth,
      amount:2500, status:'Pending', paidOn:'-', method:'-',
    }));
    setRecords([...newBills, ...records]);
    alert(`✅ ${newBills.length} bills generated for ${newMonth}`);
  };

  const addRecord = () => {
    if (!form.flat || !form.name) return;
    setRecords([{ ...form, id:Date.now(), status:'Pending', paidOn:'-', method:'-' }, ...records]);
    setForm({ flat:'', name:'', month:'April 2025', amount:2500 });
    setShowForm(false);
  };

  // Prepare export data — clean column names
  const getExportData = () => filtered.map(r => ({
    'Flat No':    r.flat,
    'Resident':   r.name,
    'Month':      r.month,
    'Amount (₹)': r.amount,
    'Status':     r.status,
    'Paid On':    r.paidOn,
    'Method':     r.method,
  }));

  const stats = {
    total:     filtered.length,
    paid:      filtered.filter(r => r.status === 'Paid').length,
    pending:   filtered.filter(r => r.status === 'Pending').length,
    overdue:   filtered.filter(r => r.status === 'Overdue').length,
    collected: filtered.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0),
    pending_amt: filtered.filter(r => r.status !== 'Paid').reduce((s, r) => s + r.amount, 0),
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', maxWidth:260 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search flat or name..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ maxWidth:160 }}>
          <option value="All">All Months</option>
          {MONTHS.map(m => <option key={m}>{m}</option>)}
        </select>
        {['All','Paid','Pending','Overdue'].map(s => (
          <button key={s} className={`btn btn-sm ${status===s?'btn-primary':'btn-outline'}`}
            onClick={() => setStatus(s)}>{s}</button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          {/* Export buttons */}
          <ExportButtons
            data={getExportData()}
            filename={`maintenance_${month.replace(' ','_')}`}
            title={`Maintenance Report — ${month}`}
          />
          <button className="btn btn-sm" style={{ background:'rgba(124,58,237,0.1)', color:'var(--accent2)', border:'1px solid rgba(124,58,237,0.2)' }}
            onClick={bulkGenerate}>
            ⚡ Bulk Generate
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={14}/> Add Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Total Bills',      value:stats.total,                        color:'var(--accent)',  icon:'📋' },
          { label:'Paid',             value:stats.paid,                         color:'var(--accent)',  icon:'✅' },
          { label:'Pending / Overdue',value:stats.pending + stats.overdue,      color:'var(--red)',     icon:'⚠️' },
          { label:'Amount Collected', value:`₹${stats.collected.toLocaleString()}`, color:'var(--accent)',icon:'💰' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
            <div className="stat-value" style={{ color:s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add record form */}
      {showForm && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-title">
            <span>➕ Add Maintenance Record</span>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}><X size={18}/></button>
          </div>
          <div className="form-grid-4">
            <div className="form-row">
              <label className="field-label">Flat No.</label>
              <input placeholder="A-101" value={form.flat} onChange={e => setForm({...form,flat:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Resident Name</label>
              <input placeholder="Full name" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
            </div>
            <div className="form-row">
              <label className="field-label">Month</label>
              <select value={form.month} onChange={e => setForm({...form,month:e.target.value})}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form,amount:+e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-primary" onClick={addRecord}>Add Record</button>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>
            📋 Maintenance Records ({filtered.length})
          </span>
          <span style={{ fontSize:12, color:'var(--muted)' }}>
            Collected: <b style={{ color:'var(--accent)' }}>₹{stats.collected.toLocaleString()}</b>
            &nbsp;| Pending: <b style={{ color:'var(--red)' }}>₹{stats.pending_amt.toLocaleString()}</b>
          </span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{['Flat','Resident','Month','Amount','Status','Paid On','Method','Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)' }}>No records found</td></tr>
              )}
              {filtered.map(r => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.Pending;
                return (
                  <tr key={r.id}>
                    <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{r.flat}</span></td>
                    <td style={{ fontWeight:600 }}>{r.name}</td>
                    <td style={{ fontSize:13, color:'var(--muted)' }}>{r.month}</td>
                    <td style={{ fontWeight:700, color:'var(--accent)' }}>₹{r.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${sc.badge}`} style={{ display:'flex', alignItems:'center', gap:4, width:'fit-content' }}>
                        {sc.icon} {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize:12, color:'var(--muted)' }}>{r.paidOn}</td>
                    <td style={{ fontSize:12, color:'var(--muted)' }}>{r.method}</td>
                    <td>
                      {r.status !== 'Paid' && (
                        <button className="btn btn-sm" style={{ background:'rgba(22,163,74,0.1)', color:'var(--accent)', border:'1px solid rgba(22,163,74,0.2)', fontSize:11 }}
                          onClick={() => markPaid(r.id)}>
                          <CheckCircle size={12}/> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
