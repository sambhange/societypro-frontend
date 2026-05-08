'use client';
import { useState } from 'react';
import {
  IndianRupee, TrendingUp, TrendingDown, FileText,
  Plus, X, Download, Search, Filter, CheckCircle,
  AlertCircle, Printer, Calendar, PieChart, BarChart2
} from 'lucide-react';

// ── Export utility (inline for independence) ──────────────────────────────────
const exportCSV = (data, filename) => {
  if (!data?.length) return alert('No data to export!');
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row =>
    headers.map(h => {
      const v = String(row[h] ?? '').replace(/"/g, '""');
      return v.includes(',') ? `"${v}"` : v;
    }).join(',')
  )].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

const printReport = (title, data) => {
  if (!data?.length) return alert('No data to print!');
  const headers = Object.keys(data[0]);
  const rows = data.map(r => `<tr>${headers.map(h => `<td>${r[h]??''}</td>`).join('')}</tr>`).join('');
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>${title}</title><style>
    body{font-family:Arial;padding:20px}h2{color:#2563EB}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#0F172A;color:white;padding:9px 12px;text-align:left}
    td{padding:8px 12px;border-bottom:1px solid #E2E8F0}
    tr:nth-child(even){background:#F8FAFC}
    .total{font-weight:bold;background:#EFF6FF!important}
    @media print{button{display:none}}
  </style></head><body>
    <h2>${title}</h2>
    <p style="color:#64748B">Generated: ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
    <button onclick="window.print()" style="background:#2563EB;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;margin-bottom:16px">🖨️ Print / Save PDF</button>
    <table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows}</tbody></table>
  </body></html>`);
  w.document.close();
};

// ── Sample Data ───────────────────────────────────────────────────────────────
const INCOME_CATEGORIES  = ['Maintenance','Water Charges','Parking Charges','Interest Income','Late Fee','NOC Charges','Event Income','Other Income'];
const EXPENSE_CATEGORIES = ['Security','Housekeeping','Electricity','Water Supply','Repairs & Maintenance','Garden','Lift AMC','Generator','Insurance','Accounting','Legal','Office Expenses','Bank Charges','Other Expense'];

const initialIncome = [
  { id:1,  date:'01 Apr 2025', category:'Maintenance',    description:'April maintenance collection — 42 flats', amount:105000, gst:0,    flat:'All',   ref:'RCP-001', status:'Received' },
  { id:2,  date:'03 Apr 2025', category:'Parking Charges',description:'Monthly parking — 18 vehicles',          amount:9000,   gst:0,    flat:'All',   ref:'RCP-002', status:'Received' },
  { id:3,  date:'05 Apr 2025', category:'Late Fee',       description:'Late fee — 3 defaulter flats',           amount:1500,   gst:0,    flat:'B-202', ref:'RCP-003', status:'Received' },
  { id:4,  date:'10 Apr 2025', category:'NOC Charges',    description:'Renovation NOC — flat A-301',            amount:2000,   gst:360,  flat:'A-301', ref:'RCP-004', status:'Received' },
  { id:5,  date:'15 Apr 2025', category:'Interest Income',description:'FD interest — SBI',                      amount:8500,   gst:0,    flat:'-',     ref:'RCP-005', status:'Received' },
  { id:6,  date:'20 Apr 2025', category:'Event Income',   description:'Holi event collection',                  amount:12000,  gst:0,    flat:'All',   ref:'RCP-006', status:'Received' },
  { id:7,  date:'01 Mar 2025', category:'Maintenance',    description:'March maintenance — 40 flats',           amount:100000, gst:0,    flat:'All',   ref:'RCP-007', status:'Received' },
  { id:8,  date:'05 Mar 2025', category:'Water Charges',  description:'Water charges March',                    amount:15000,  gst:0,    flat:'All',   ref:'RCP-008', status:'Received' },
];

const initialExpenses = [
  { id:1,  date:'02 Apr 2025', category:'Security',         description:'Security agency — April salary',       amount:45000,  gst:8100,  vendor:'SafeGuard Pvt Ltd', ref:'EXP-001', status:'Paid',    invoice:'INV-SG-04' },
  { id:2,  date:'03 Apr 2025', category:'Housekeeping',     description:'Housekeeping staff — April',           amount:28000,  gst:5040,  vendor:'CleanPro Services', ref:'EXP-002', status:'Paid',    invoice:'INV-CP-04' },
  { id:3,  date:'05 Apr 2025', category:'Electricity',      description:'Common area electricity — April',      amount:18500,  gst:3330,  vendor:'MSEB',              ref:'EXP-003', status:'Paid',    invoice:'INV-MSE-04'},
  { id:4,  date:'07 Apr 2025', category:'Repairs & Maintenance', description:'Lift repair — Motor replacement', amount:15000,  gst:2700,  vendor:'ThyssenKrupp',      ref:'EXP-004', status:'Paid',    invoice:'INV-TK-04' },
  { id:5,  date:'10 Apr 2025', category:'Water Supply',     description:'Water tanker — 5 trips',               amount:8500,   gst:0,     vendor:'RK Water Supply',   ref:'EXP-005', status:'Paid',    invoice:'INV-RK-04' },
  { id:6,  date:'12 Apr 2025', category:'Garden',           description:'Gardening — monthly',                  amount:4500,   gst:810,   vendor:'Green Thumb',       ref:'EXP-006', status:'Paid',    invoice:'INV-GT-04' },
  { id:7,  date:'15 Apr 2025', category:'Lift AMC',         description:'Lift AMC — quarterly',                 amount:12000,  gst:2160,  vendor:'ThyssenKrupp',      ref:'EXP-007', status:'Pending', invoice:'-'          },
  { id:8,  date:'20 Apr 2025', category:'Insurance',        description:'Building insurance premium',           amount:22000,  gst:3960,  vendor:'HDFC Ergo',         ref:'EXP-008', status:'Paid',    invoice:'INV-HE-04' },
  { id:9,  date:'02 Mar 2025', category:'Security',         description:'Security agency — March',              amount:45000,  gst:8100,  vendor:'SafeGuard Pvt Ltd', ref:'EXP-009', status:'Paid',    invoice:'INV-SG-03' },
  { id:10, date:'04 Mar 2025', category:'Housekeeping',     description:'Housekeeping — March',                 amount:28000,  gst:5040,  vendor:'CleanPro Services', ref:'EXP-010', status:'Paid',    invoice:'INV-CP-03' },
];

const MONTHS = ['April 2025','March 2025','February 2025','January 2025','December 2024'];

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;
const fmtDate = d => d;

// ── Tab components defined OUTSIDE to prevent re-render focus loss ─────────────
const InputField = ({ label, value, onChange, type='text', placeholder='', as='input', options=[] }) => (
  <div className="form-row">
    <label className="field-label">{label}</label>
    {as === 'select' ? (
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    ) : as === 'textarea' ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ minHeight:60 }}/>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function Accounting() {
  const [tab, setTab]           = useState('dashboard');
  const [income, setIncome]     = useState(initialIncome);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [filterMonth, setFilterMonth] = useState('April 2025');
  const [search, setSearch]     = useState('');
  const [showIncomeForm, setShowIncomeForm]   = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(null);

  const [incomeForm, setIncomeForm] = useState({
    date:'', category:'', description:'', amount:'', gst:'0', flat:'', ref:'', status:'Received'
  });
  const [expenseForm, setExpenseForm] = useState({
    date:'', category:'', description:'', amount:'', gst:'0', vendor:'', ref:'', status:'Paid', invoice:''
  });

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalIncome    = income.reduce((s, i) => s + i.amount + i.gst, 0);
  const totalExpenses  = expenses.reduce((s, e) => s + e.amount + e.gst, 0);
  const netBalance     = totalIncome - totalExpenses;
  const totalGSTIn     = income.reduce((s, i) => s + i.gst, 0);
  const totalGSTOut    = expenses.reduce((s, e) => s + e.gst, 0);
  const pendingExp     = expenses.filter(e => e.status === 'Pending').reduce((s,e) => s+e.amount+e.gst, 0);

  const aprilIncome   = income.filter(i => i.date.includes('Apr')).reduce((s,i) => s+i.amount, 0);
  const aprilExpenses = expenses.filter(e => e.date.includes('Apr')).reduce((s,e) => s+e.amount, 0);

  // ── Add records ────────────────────────────────────────────────────────────
  const addIncome = () => {
    if (!incomeForm.date || !incomeForm.category || !incomeForm.amount) return;
    setIncome([{ ...incomeForm, id:Date.now(), amount:+incomeForm.amount, gst:+incomeForm.gst }, ...income]);
    setIncomeForm({ date:'', category:'', description:'', amount:'', gst:'0', flat:'', ref:'', status:'Received' });
    setShowIncomeForm(false);
  };

  const addExpense = () => {
    if (!expenseForm.date || !expenseForm.category || !expenseForm.amount) return;
    setExpenses([{ ...expenseForm, id:Date.now(), amount:+expenseForm.amount, gst:+expenseForm.gst }, ...expenses]);
    setExpenseForm({ date:'', category:'', description:'', amount:'', gst:'0', vendor:'', ref:'', status:'Paid', invoice:'' });
    setShowExpenseForm(false);
  };

  // ── GST Invoice generator ──────────────────────────────────────────────────
  const generateInvoice = (item, type) => setShowInvoice({ ...item, type });

  // ── Balance sheet data ─────────────────────────────────────────────────────
  const incomeByCategory  = INCOME_CATEGORIES.map(cat => ({
    Category: cat,
    'Amount (₹)': income.filter(i => i.category === cat).reduce((s,i) => s+i.amount, 0),
    'GST (₹)':    income.filter(i => i.category === cat).reduce((s,i) => s+i.gst, 0),
  })).filter(r => r['Amount (₹)'] > 0);

  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    Category: cat,
    'Amount (₹)': expenses.filter(e => e.category === cat).reduce((s,e) => s+e.amount, 0),
    'GST (₹)':    expenses.filter(e => e.category === cat).reduce((s,e) => s+e.gst, 0),
  })).filter(r => r['Amount (₹)'] > 0);

  const TABS = [
    { id:'dashboard', label:'📊 Dashboard'     },
    { id:'income',    label:'💰 Income'         },
    { id:'expenses',  label:'💸 Expenses'       },
    { id:'gst',       label:'🧾 GST & Invoices' },
    { id:'reports',   label:'📋 Reports'        },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} className={`btn ${tab===t.id?'btn-primary':'btn-outline'}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ maxWidth:160 }}>
            <option value="All">All Months</option>
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* ══ DASHBOARD TAB ══════════════════════════════════════════════════════ */}
      {tab === 'dashboard' && (
        <div>
          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
            {[
              { label:'Total Income',    value:fmt(totalIncome),   color:'var(--accent)',  icon:'💰', sub:'All time' },
              { label:'Total Expenses',  value:fmt(totalExpenses), color:'var(--red)',     icon:'💸', sub:'All time' },
              { label:'Net Balance',     value:fmt(netBalance),    color: netBalance>=0?'var(--accent)':'var(--red)', icon:'📊', sub: netBalance>=0?'Surplus':'Deficit' },
              { label:'Pending Bills',   value:fmt(pendingExp),    color:'var(--gold)',    icon:'⏳', sub:'Unpaid expenses' },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
                <div className="stat-value" style={{ color:s.color, fontSize:20 }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Monthly summary */}
          <div className="grid-2">
            <div className="card">
              <div className="card-title">📅 April 2025 Summary</div>
              {[
                { label:'Income Collected',  value:aprilIncome,   color:'var(--accent)' },
                { label:'Expenses Paid',     value:aprilExpenses, color:'var(--red)'    },
                { label:'Net Surplus',       value:aprilIncome-aprilExpenses, color:aprilIncome-aprilExpenses>=0?'var(--accent)':'var(--red)' },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--muted)', fontSize:13 }}>{r.label}</span>
                  <span style={{ fontWeight:800, color:r.color, fontSize:14 }}>{fmt(r.value)}</span>
                </div>
              ))}
              <div style={{ marginTop:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:12, color:'var(--muted)' }}>
                  <span>Collection Efficiency</span>
                  <span style={{ fontWeight:700, color:'var(--accent)' }}>{Math.round((aprilIncome/(aprilIncome+pendingExp||1))*100)}%</span>
                </div>
                <div style={{ height:10, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.round((aprilIncome/(aprilIncome+pendingExp||1))*100)}%`, background:'var(--accent)', borderRadius:99 }}/>
                </div>
              </div>
            </div>

            {/* Income breakdown */}
            <div className="card">
              <div className="card-title">💰 Income Breakdown</div>
              {incomeByCategory.slice(0,6).map((cat, i) => {
                const pct = Math.round((cat['Amount (₹)']/totalIncome)*100);
                const COLORS = ['#2563EB','#7C3AED','#16A34A','#D97706','#DC2626','#0891B2'];
                return (
                  <div key={cat.Category} style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                      <span style={{ color:'var(--text)', fontWeight:500 }}>{cat.Category}</span>
                      <span style={{ fontWeight:700, color:COLORS[i%6] }}>{fmt(cat['Amount (₹)'])} ({pct}%)</span>
                    </div>
                    <div style={{ height:7, background:'#F1F5F9', borderRadius:99 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:COLORS[i%6], borderRadius:99 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>🔄 Recent Transactions</span>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-sm" style={{ background:'rgba(22,163,74,0.1)', color:'var(--accent)', border:'1px solid rgba(22,163,74,0.2)', fontSize:11 }}
                  onClick={() => exportCSV([...income.slice(0,5).map(i=>({Type:'Income',...i})),...expenses.slice(0,5).map(e=>({Type:'Expense',...e}))], 'transactions')}>
                  📄 Export CSV
                </button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr>{['Date','Type','Category','Description','Amount','GST','Status'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ...income.slice(0,4).map(i=>({...i,type:'Income',totalAmt:i.amount+i.gst})),
                    ...expenses.slice(0,4).map(e=>({...e,type:'Expense',totalAmt:e.amount+e.gst}))
                  ].sort((a,b)=>b.id-a.id).slice(0,8).map(r=>(
                    <tr key={r.id+r.type}>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{r.date}</td>
                      <td><span style={{ fontSize:11, background:r.type==='Income'?'rgba(22,163,74,0.1)':'rgba(220,38,38,0.1)', color:r.type==='Income'?'var(--accent)':'var(--red)', padding:'2px 8px', borderRadius:99, fontWeight:700 }}>{r.type}</span></td>
                      <td style={{ fontSize:13, fontWeight:600 }}>{r.category}</td>
                      <td style={{ fontSize:12, color:'var(--muted)', maxWidth:160 }}>{r.description}</td>
                      <td style={{ fontWeight:700, color:r.type==='Income'?'var(--accent)':'var(--red)' }}>{fmt(r.amount)}</td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{r.gst>0?fmt(r.gst):'-'}</td>
                      <td><span className={`badge ${r.status==='Received'||r.status==='Paid'?'badge-green':'badge-gold'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ INCOME TAB ═════════════════════════════════════════════════════════ */}
      {tab === 'income' && (
        <div>
          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ position:'relative', maxWidth:260 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
              <input placeholder="Search income..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <button className="btn btn-sm" style={{ background:'rgba(22,163,74,0.1)', color:'var(--accent)', border:'1px solid rgba(22,163,74,0.2)' }}
                onClick={() => exportCSV(income.map(i=>({'Date':i.date,'Category':i.category,'Description':i.description,'Amount':i.amount,'GST':i.gst,'Total':i.amount+i.gst,'Flat':i.flat,'Ref':i.ref,'Status':i.status})), 'income')}>
                📄 Export CSV
              </button>
              <button className="btn btn-sm" style={{ background:'rgba(37,99,235,0.1)', color:'var(--accent2)', border:'1px solid rgba(37,99,235,0.2)' }}
                onClick={() => printReport('Income Report — SocietyPro', income.map(i=>({'Date':i.date,'Category':i.category,'Description':i.description,'Amount (₹)':i.amount,'GST (₹)':i.gst,'Total (₹)':i.amount+i.gst,'Status':i.status})))}>
                🖨️ Print
              </button>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowIncomeForm(!showIncomeForm)}>
                <Plus size={14}/> Add Income
              </button>
            </div>
          </div>

          {showIncomeForm && (
            <div className="card" style={{ marginBottom:16 }}>
              <div className="card-title">
                <span>💰 Add Income Entry</span>
                <button onClick={()=>setShowIncomeForm(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={18}/></button>
              </div>
              <div className="form-grid-3">
                <InputField label="Date" value={incomeForm.date} onChange={v=>setIncomeForm({...incomeForm,date:v})} type="date"/>
                <InputField label="Category" value={incomeForm.category} onChange={v=>setIncomeForm({...incomeForm,category:v})} as="select" options={INCOME_CATEGORIES}/>
                <InputField label="Amount (₹)" value={incomeForm.amount} onChange={v=>setIncomeForm({...incomeForm,amount:v})} type="number" placeholder="0"/>
                <InputField label="GST (₹)" value={incomeForm.gst} onChange={v=>setIncomeForm({...incomeForm,gst:v})} type="number" placeholder="0"/>
                <InputField label="Flat No." value={incomeForm.flat} onChange={v=>setIncomeForm({...incomeForm,flat:v})} placeholder="A-101 or All"/>
                <InputField label="Reference No." value={incomeForm.ref} onChange={v=>setIncomeForm({...incomeForm,ref:v})} placeholder="RCP-001"/>
                <div className="form-row col-span-3">
                  <InputField label="Description" value={incomeForm.description} onChange={v=>setIncomeForm({...incomeForm,description:v})} placeholder="Description of income..." as="textarea"/>
                </div>
              </div>
              <button className="btn btn-primary" onClick={addIncome}><Plus size={14}/> Add Income</button>
            </div>
          )}

          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>💰 Income Records ({income.length})</span>
              <span style={{ fontWeight:800, color:'var(--accent)', fontSize:14 }}>Total: {fmt(totalIncome)}</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr>{['Date','Category','Description','Amount','GST','Total','Flat','Ref','Status','Action'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {income.filter(i=>!search||i.category.toLowerCase().includes(search.toLowerCase())||i.description.toLowerCase().includes(search.toLowerCase())).map(i=>(
                    <tr key={i.id}>
                      <td style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap' }}>{i.date}</td>
                      <td style={{ fontWeight:600, fontSize:13 }}>{i.category}</td>
                      <td style={{ fontSize:12, color:'var(--muted)', maxWidth:180 }}>{i.description}</td>
                      <td style={{ fontWeight:700, color:'var(--accent)' }}>{fmt(i.amount)}</td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{i.gst>0?fmt(i.gst):'-'}</td>
                      <td style={{ fontWeight:800, color:'var(--accent)' }}>{fmt(i.amount+i.gst)}</td>
                      <td><span className="badge badge-blue" style={{ fontWeight:700 }}>{i.flat}</span></td>
                      <td style={{ fontSize:11, color:'var(--muted)' }}>{i.ref}</td>
                      <td><span className="badge badge-green">{i.status}</span></td>
                      <td>
                        <button className="btn btn-sm" style={{ background:'rgba(37,99,235,0.08)', color:'var(--accent)', border:'none', fontSize:11 }}
                          onClick={()=>generateInvoice(i,'income')}>🧾 Receipt</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ EXPENSES TAB ═══════════════════════════════════════════════════════ */}
      {tab === 'expenses' && (
        <div>
          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ position:'relative', maxWidth:260 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
              <input placeholder="Search expenses..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <button className="btn btn-sm" style={{ background:'rgba(22,163,74,0.1)', color:'var(--accent)', border:'1px solid rgba(22,163,74,0.2)' }}
                onClick={()=>exportCSV(expenses.map(e=>({'Date':e.date,'Category':e.category,'Description':e.description,'Amount':e.amount,'GST':e.gst,'Total':e.amount+e.gst,'Vendor':e.vendor,'Invoice':e.invoice,'Status':e.status})),'expenses')}>
                📄 Export CSV
              </button>
              <button className="btn btn-sm" style={{ background:'rgba(37,99,235,0.1)', color:'var(--accent2)', border:'1px solid rgba(37,99,235,0.2)' }}
                onClick={()=>printReport('Expense Report — SocietyPro', expenses.map(e=>({'Date':e.date,'Category':e.category,'Vendor':e.vendor,'Amount (₹)':e.amount,'GST (₹)':e.gst,'Total (₹)':e.amount+e.gst,'Status':e.status})))}>
                🖨️ Print
              </button>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowExpenseForm(!showExpenseForm)}>
                <Plus size={14}/> Add Expense
              </button>
            </div>
          </div>

          {showExpenseForm && (
            <div className="card" style={{ marginBottom:16 }}>
              <div className="card-title">
                <span>💸 Add Expense Entry</span>
                <button onClick={()=>setShowExpenseForm(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={18}/></button>
              </div>
              <div className="form-grid-3">
                <InputField label="Date" value={expenseForm.date} onChange={v=>setExpenseForm({...expenseForm,date:v})} type="date"/>
                <InputField label="Category" value={expenseForm.category} onChange={v=>setExpenseForm({...expenseForm,category:v})} as="select" options={EXPENSE_CATEGORIES}/>
                <InputField label="Amount (₹)" value={expenseForm.amount} onChange={v=>setExpenseForm({...expenseForm,amount:v})} type="number" placeholder="0"/>
                <InputField label="GST (₹)" value={expenseForm.gst} onChange={v=>setExpenseForm({...expenseForm,gst:v})} type="number" placeholder="0"/>
                <InputField label="Vendor Name" value={expenseForm.vendor} onChange={v=>setExpenseForm({...expenseForm,vendor:v})} placeholder="Vendor / Supplier"/>
                <InputField label="Invoice No." value={expenseForm.invoice} onChange={v=>setExpenseForm({...expenseForm,invoice:v})} placeholder="INV-001"/>
                <InputField label="Status" value={expenseForm.status} onChange={v=>setExpenseForm({...expenseForm,status:v})} as="select" options={['Paid','Pending']}/>
                <InputField label="Reference" value={expenseForm.ref} onChange={v=>setExpenseForm({...expenseForm,ref:v})} placeholder="EXP-001"/>
                <div className="form-row col-span-3">
                  <InputField label="Description" value={expenseForm.description} onChange={v=>setExpenseForm({...expenseForm,description:v})} placeholder="Description..." as="textarea"/>
                </div>
              </div>
              <button className="btn btn-primary" onClick={addExpense}><Plus size={14}/> Add Expense</button>
            </div>
          )}

          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>💸 Expense Records ({expenses.length})</span>
              <span style={{ fontWeight:800, color:'var(--red)', fontSize:14 }}>Total: {fmt(totalExpenses)}</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr>{['Date','Category','Description','Vendor','Amount','GST','Total','Invoice','Status','Action'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {expenses.filter(e=>!search||e.category.toLowerCase().includes(search.toLowerCase())||e.vendor.toLowerCase().includes(search.toLowerCase())).map(e=>(
                    <tr key={e.id}>
                      <td style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap' }}>{e.date}</td>
                      <td style={{ fontWeight:600, fontSize:13 }}>{e.category}</td>
                      <td style={{ fontSize:12, color:'var(--muted)', maxWidth:150 }}>{e.description}</td>
                      <td style={{ fontSize:12 }}>{e.vendor}</td>
                      <td style={{ fontWeight:700, color:'var(--red)' }}>{fmt(e.amount)}</td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{e.gst>0?fmt(e.gst):'-'}</td>
                      <td style={{ fontWeight:800, color:'var(--red)' }}>{fmt(e.amount+e.gst)}</td>
                      <td style={{ fontSize:11, color:'var(--muted)' }}>{e.invoice}</td>
                      <td><span className={`badge ${e.status==='Paid'?'badge-green':'badge-gold'}`}>{e.status}</span></td>
                      <td>
                        <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none', fontSize:11 }}
                          onClick={()=>generateInvoice(e,'expense')}>🧾 Invoice</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ GST & INVOICES TAB ═════════════════════════════════════════════════ */}
      {tab === 'gst' && (
        <div>
          <div className="grid-2" style={{ marginBottom:16 }}>
            <div className="card">
              <div className="card-title">🧾 GST Summary</div>
              {[
                { label:'GST Collected (Input)',  value:totalGSTIn,           color:'var(--accent)' },
                { label:'GST Paid (Output)',       value:totalGSTOut,          color:'var(--red)'    },
                { label:'Net GST Payable',         value:totalGSTOut-totalGSTIn, color:'var(--gold)' },
              ].map(r=>(
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--muted)', fontSize:13 }}>{r.label}</span>
                  <span style={{ fontWeight:800, color:r.color, fontSize:15 }}>{fmt(r.value)}</span>
                </div>
              ))}
              <button className="btn btn-sm" style={{ marginTop:14, background:'rgba(37,99,235,0.08)', color:'var(--accent)', border:'1px solid rgba(37,99,235,0.2)' }}
                onClick={()=>exportCSV([
                  {'Category':'GST Collected (Input)','Amount (₹)':totalGSTIn},
                  {'Category':'GST Paid (Output)','Amount (₹)':totalGSTOut},
                  {'Category':'Net GST Payable','Amount (₹)':totalGSTOut-totalGSTIn},
                ],'gst_summary')}>
                📄 Export GST Report
              </button>
            </div>

            <div className="card">
              <div className="card-title">📋 GST Transactions</div>
              {[
                ...income.filter(i=>i.gst>0).map(i=>({date:i.date,desc:i.description,type:'Collected',gst:i.gst})),
                ...expenses.filter(e=>e.gst>0).map(e=>({date:e.date,desc:e.description,type:'Paid',gst:e.gst})),
              ].slice(0,8).map((r,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
                  <div>
                    <div style={{ fontWeight:600, color:'var(--white)' }}>{r.desc}</div>
                    <div style={{ color:'var(--muted)' }}>{r.date}</div>
                  </div>
                  <span style={{ fontWeight:700, color:r.type==='Collected'?'var(--accent)':'var(--red)' }}>
                    {r.type==='Collected'?'+':'-'}{fmt(r.gst)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice generator */}
          <div className="card">
            <div className="card-title">🧾 Generate Invoice / Receipt</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginBottom:14 }}>
              Click the 🧾 button on any income or expense row to generate a printable invoice/receipt.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { title:'Maintenance Receipt', desc:'PDF receipt for maintenance payments', emoji:'💰' },
                { title:'NOC Invoice', desc:'GST invoice for NOC charges', emoji:'📜' },
                { title:'Vendor Invoice', desc:'Record vendor payment with invoice no.', emoji:'🏢' },
              ].map(c=>(
                <div key={c.title} style={{ background:'#F8FAFC', borderRadius:10, padding:'16px', border:'1px solid var(--border)', textAlign:'center' }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{c.emoji}</div>
                  <div style={{ fontWeight:700, fontSize:13.5, color:'var(--white)', marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ REPORTS TAB ════════════════════════════════════════════════════════ */}
      {tab === 'reports' && (
        <div>
          <div className="grid-2" style={{ marginBottom:16 }}>
            {/* Balance Sheet */}
            <div className="card">
              <div className="card-title">
                <span>📊 Balance Sheet</span>
                <button className="btn btn-sm" style={{ background:'rgba(37,99,235,0.08)', color:'var(--accent)', border:'1px solid rgba(37,99,235,0.2)' }}
                  onClick={()=>printReport('Balance Sheet — SocietyPro', [
                    {'Category':'INCOME','Amount (₹)':'','':''},
                    ...incomeByCategory.map(r=>({'Category':r.Category,'Amount (₹)':r['Amount (₹)'],'GST (₹)':r['GST (₹)']})),
                    {'Category':'Total Income','Amount (₹)':totalIncome,'GST (₹)':totalGSTIn},
                    {'Category':'EXPENSES','Amount (₹)':'','':''},
                    ...expenseByCategory.map(r=>({'Category':r.Category,'Amount (₹)':r['Amount (₹)'],'GST (₹)':r['GST (₹)']})),
                    {'Category':'Total Expenses','Amount (₹)':totalExpenses,'GST (₹)':totalGSTOut},
                    {'Category':'NET BALANCE','Amount (₹)':netBalance,'GST (₹)':''},
                  ])}>🖨️ Print</button>
              </div>

              <div style={{ background:'rgba(22,163,74,0.06)', borderRadius:8, padding:'10px 14px', marginBottom:12 }}>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>INCOME</div>
                {incomeByCategory.map(r=>(
                  <div key={r.Category} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'4px 0', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                    <span style={{ color:'var(--muted)' }}>{r.Category}</span>
                    <span style={{ fontWeight:600, color:'var(--accent)' }}>{fmt(r['Amount (₹)'])}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:800, marginTop:8, color:'var(--accent)' }}>
                  <span>Total Income</span><span>{fmt(totalIncome)}</span>
                </div>
              </div>

              <div style={{ background:'rgba(220,38,38,0.06)', borderRadius:8, padding:'10px 14px', marginBottom:12 }}>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>EXPENSES</div>
                {expenseByCategory.map(r=>(
                  <div key={r.Category} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'4px 0', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                    <span style={{ color:'var(--muted)' }}>{r.Category}</span>
                    <span style={{ fontWeight:600, color:'var(--red)' }}>{fmt(r['Amount (₹)'])}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:800, marginTop:8, color:'var(--red)' }}>
                  <span>Total Expenses</span><span>{fmt(totalExpenses)}</span>
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 14px', background:netBalance>=0?'rgba(22,163,74,0.1)':'rgba(220,38,38,0.1)', borderRadius:8, border:`1px solid ${netBalance>=0?'rgba(22,163,74,0.3)':'rgba(220,38,38,0.3)'}` }}>
                <span style={{ fontWeight:800, fontSize:14 }}>Net Balance</span>
                <span style={{ fontWeight:800, fontSize:16, color:netBalance>=0?'var(--accent)':'var(--red)' }}>{fmt(netBalance)}</span>
              </div>
            </div>

            {/* Export options */}
            <div className="card">
              <div className="card-title">📋 Export Reports</div>
              {[
                { title:'Income Report',     desc:'All income entries with GST details', color:GREEN,  fn:()=>exportCSV(income.map(i=>({'Date':i.date,'Category':i.category,'Description':i.description,'Amount (₹)':i.amount,'GST (₹)':i.gst,'Total (₹)':i.amount+i.gst,'Flat':i.flat,'Status':i.status})),'income_report') },
                { title:'Expense Report',    desc:'All expenses with vendor details',    color:RED,    fn:()=>exportCSV(expenses.map(e=>({'Date':e.date,'Category':e.category,'Vendor':e.vendor,'Amount (₹)':e.amount,'GST (₹)':e.gst,'Total (₹)':e.amount+e.gst,'Invoice':e.invoice,'Status':e.status})),'expense_report') },
                { title:'Balance Sheet',     desc:'Income vs expense summary',           color:BLUE,   fn:()=>exportCSV([...incomeByCategory.map(r=>({...r,Type:'Income'})),...expenseByCategory.map(r=>({...r,Type:'Expense'}))],'balance_sheet') },
                { title:'GST Report',        desc:'GST collected and paid',              color:PURPLE, fn:()=>exportCSV([{'Type':'Collected','Amount':totalGSTIn},{'Type':'Paid','Amount':totalGSTOut},{'Type':'Net Payable','Amount':totalGSTOut-totalGSTIn}],'gst_report') },
                { title:'Defaulter Report',  desc:'Flats with pending payments',         color:ORANGE, fn:()=>exportCSV([{Flat:'B-202',Name:'Suresh Patel',Month:'April 2025',Amount:2500,Overdue:'Yes'},{Flat:'D-402',Name:'Arjun Nair',Month:'April 2025',Amount:2500,Overdue:'Yes'}],'defaulters') },
                { title:'Print Balance Sheet',desc:'Printable balance sheet PDF',        color:DARK,   fn:()=>printReport('Balance Sheet — SocietyPro',[...incomeByCategory.map(r=>({Type:'Income',...r})),...expenseByCategory.map(r=>({Type:'Expense',...r})),{Type:'Net Balance',Category:'',  'Amount (₹)':netBalance,'GST (₹)':''}]) },
              ].map(r=>(
                <div key={r.title} onClick={r.fn}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'#F8FAFC', borderRadius:10, marginBottom:8, cursor:'pointer', border:'1px solid var(--border)', transition:'all 0.12s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background=LBLUE; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='#F8FAFC'; }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:'var(--white)' }}>{r.title}</div>
                    <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{r.desc}</div>
                  </div>
                  <Download size={16} style={{ color:'var(--accent)', flexShrink:0 }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly trend */}
          <div className="card">
            <div className="card-title">
              <span>📈 Monthly Trend</span>
              <button className="btn btn-sm btn-outline" onClick={()=>exportCSV([
                {Month:'March 2025','Income (₹)':115000,'Expenses (₹)':128400,'Net (₹)':-13400},
                {Month:'April 2025','Income (₹)':138000,'Expenses (₹)':153900,'Net (₹)':-15900},
              ],'monthly_trend')}>📄 Export</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr>{['Month','Income','Expenses','Net Balance','Collection Rate'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { month:'March 2025', income:115000, expenses:128400, rate:88 },
                    { month:'April 2025', income:138000, expenses:153900, rate:87 },
                  ].map(r=>(
                    <tr key={r.month}>
                      <td style={{ fontWeight:600 }}>{r.month}</td>
                      <td style={{ fontWeight:700, color:'var(--accent)' }}>{fmt(r.income)}</td>
                      <td style={{ fontWeight:700, color:'var(--red)' }}>{fmt(r.expenses)}</td>
                      <td style={{ fontWeight:800, color:r.income-r.expenses>=0?'var(--accent)':'var(--red)' }}>{fmt(r.income-r.expenses)}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ height:8, width:80, background:'#F1F5F9', borderRadius:99 }}>
                            <div style={{ height:'100%', width:`${r.rate}%`, background:'var(--accent)', borderRadius:99 }}/>
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:'var(--accent)' }}>{r.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ INVOICE MODAL ══════════════════════════════════════════════════════ */}
      {showInvoice && (
        <div className="modal-overlay" onClick={()=>setShowInvoice(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:500 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:17, color:'var(--white)' }}>
                {showInvoice.type==='income'?'🧾 Receipt':'🧾 Invoice'}
              </div>
              <button onClick={()=>setShowInvoice(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={20}/></button>
            </div>

            <div style={{ border:'2px solid var(--border)', borderRadius:12, padding:20 }}>
              {/* Header */}
              <div style={{ textAlign:'center', borderBottom:'2px solid var(--border)', paddingBottom:14, marginBottom:14 }}>
                <div style={{ fontWeight:800, fontSize:18, color:'var(--accent)' }}>🏢 Sunrise Residency</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>Andheri West, Mumbai — 400053</div>
                <div style={{ fontSize:13, fontWeight:700, marginTop:8, color:'var(--white)' }}>
                  {showInvoice.type==='income'?'RECEIPT':'TAX INVOICE'}
                </div>
              </div>

              {/* Details */}
              {[
                { label: showInvoice.type==='income'?'Receipt No.':'Invoice No.', value: showInvoice.ref||showInvoice.invoice||'—' },
                { label:'Date',        value: showInvoice.date },
                { label:'Description', value: showInvoice.description },
                { label: showInvoice.type==='income'?'Received From':'Vendor', value: showInvoice.flat||showInvoice.vendor||'—' },
                { label:'Amount',      value: fmt(showInvoice.amount) },
                { label:'GST',         value: showInvoice.gst>0?fmt(showInvoice.gst):'Nil' },
                { label:'Total',       value: fmt(showInvoice.amount+showInvoice.gst) },
                { label:'Status',      value: showInvoice.status },
              ].map(r=>(
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)' }}>{r.label}</span>
                  <span style={{ fontWeight:600, color:'var(--white)' }}>{r.value}</span>
                </div>
              ))}

              <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(37,99,235,0.06)', borderRadius:8, textAlign:'center', fontSize:12, color:'var(--muted)' }}>
                This is a computer generated {showInvoice.type==='income'?'receipt':'invoice'}. No signature required.
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
                onClick={()=>{
                  printReport(showInvoice.type==='income'?'Receipt':'Invoice', [{
                    'No.': showInvoice.ref||showInvoice.invoice||'—',
                    'Date': showInvoice.date,
                    'Description': showInvoice.description,
                    'Amount': fmt(showInvoice.amount),
                    'GST': showInvoice.gst>0?fmt(showInvoice.gst):'Nil',
                    'Total': fmt(showInvoice.amount+showInvoice.gst),
                    'Status': showInvoice.status,
                  }]);
                }}>
                🖨️ Print Invoice
              </button>
              <button className="btn btn-outline" onClick={()=>setShowInvoice(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        const LBLUE = '#EFF6FF';
        const BLUE = '#2563EB';
        const GREEN = '#16A34A';
        const RED = '#DC2626';
        const PURPLE = '#7C3AED';
        const ORANGE = '#D97706';
        const DARK = '#0F172A';
      `}</style>
    </div>
  );
}
