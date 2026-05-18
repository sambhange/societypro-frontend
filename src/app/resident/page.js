'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, IndianRupee, FileText, Megaphone, Eye, LogOut, Plus, X, Send, Download, AlertCircle, CheckCircle } from 'lucide-react';

const FLAT_DATA = {
  'A-101': {
    dues:[
      { id:1, month:'May 2025',      amount:2500, status:'Pending', paidOn:'-',          txnId:'-'       },
      { id:2, month:'April 2025',    amount:2500, status:'Paid',    paidOn:'2 Apr 2025', txnId:'TXN-001' },
      { id:3, month:'March 2025',    amount:2500, status:'Paid',    paidOn:'3 Mar 2025', txnId:'TXN-002' },
      { id:4, month:'February 2025', amount:2500, status:'Paid',    paidOn:'1 Feb 2025', txnId:'TXN-003' },
    ],
    complaints:[
      { id:1, ticket:'TKT-001', category:'Plumbing',   title:'Water leakage in bathroom', status:'Resolved',    date:'15 Mar 2025', reply:'Fixed by plumber on 17 Mar.' },
      { id:2, ticket:'TKT-008', category:'Electrical', title:'Power cut in corridor',      status:'In Progress', date:'20 Apr 2025', reply:'Electrician scheduled for tomorrow.' },
    ],
    visitors:[
      { id:1, name:'Ravi Kumar',      purpose:'Personal', date:'17 Apr 2025', time:'10:30 AM', status:'Checked Out' },
      { id:2, name:'Amazon Delivery', purpose:'Delivery', date:'20 Apr 2025', time:'2:00 PM',  status:'Checked Out' },
    ],
    notices:[
      { id:1, title:'Water supply off on 30th Apr', date:'28 Apr 2025', type:'urgent', body:'Water supply will be off from 9AM to 1PM on 30th April for tank cleaning. Please store water in advance.' },
      { id:2, title:'AGM scheduled for 5th May',    date:'25 Apr 2025', type:'info',   body:'Annual General Meeting on 5 May 2025 at 6:30 PM in Community Hall. All flat owners must attend.' },
      { id:3, title:'Holi 2025 celebration photos', date:'15 Mar 2025', type:'event',  body:'Photos from our Holi 2025 celebration are now uploaded in the gallery. Check them out!' },
    ],
  }
};

const getData = (flat) => FLAT_DATA[flat] || FLAT_DATA['A-101'];
const fmt = n => '₹' + Number(n).toLocaleString('en-IN');

const TABS = [
  { id:'home',       label:'🏠 Home',        icon:Home         },
  { id:'dues',       label:'💰 My Dues',     icon:IndianRupee  },
  { id:'complaints', label:'🎫 Complaints',  icon:FileText     },
  { id:'notices',    label:'📢 Notices',     icon:Megaphone    },
  { id:'visitors',   label:'🔐 Visitors',    icon:Eye          },
];

export default function ResidentPortal() {
  const router = useRouter();
  const [resident, setResident] = useState(null);
  const [tab, setTab]           = useState('home');
  const [dues, setDues]         = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [showPay, setShowPay]       = useState(null);
  const [showNotice, setShowNotice] = useState(null);
  const [form, setForm] = useState({ category:'', title:'', description:'' });

  useEffect(() => {
    const stored = localStorage.getItem('resident');
    if (!stored) { router.push('/resident-login'); return; }
    const r = JSON.parse(stored);
    setResident(r);
    const d = getData(r.flat);
    setDues(d.dues);
    setComplaints(d.complaints);
  }, []);

  const logout = () => { localStorage.removeItem('resident'); router.push('/resident-login'); };

  const pay = (id) => {
    setDues(dues.map(d => d.id===id ? {
      ...d, status:'Paid',
      paidOn: new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
      txnId: 'TXN-' + Date.now().toString().slice(-6),
    } : d));
    setShowPay(null);
  };

  const addComplaint = () => {
    if (!form.category || !form.title) return;
    setComplaints([{
      id:Date.now(), ticket:'TKT-0'+complaints.length+10,
      category:form.category, title:form.title,
      status:'Open', date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
      reply:'',
    }, ...complaints]);
    setForm({ category:'', title:'', description:'' });
    setShowForm(false);
  };

  if (!resident) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans,sans-serif', background:'#F8FAFC' }}>
      <div style={{ color:'#64748B' }}>Loading...</div>
    </div>
  );

  const data         = getData(resident.flat);
  const pending      = dues.filter(d => d.status==='Pending'||d.status==='Overdue');
  const totalPending = pending.reduce((s,d)=>s+d.amount,0);
  const paid         = dues.filter(d=>d.status==='Paid');
  const openComp     = complaints.filter(c=>c.status==='Open'||c.status==='In Progress');

  const Card = ({ emoji, label, value, color, sub, onClick }) => (
    <div onClick={onClick} style={{ background:'white', borderRadius:14, padding:'16px 18px',
      border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', flex:1,
      cursor:onClick?'pointer':'default' }}>
      <div style={{ fontSize:24, marginBottom:6 }}>{emoji}</div>
      <div style={{ fontSize:22, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:12, color:'#64748B', marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9', fontFamily:'DM Sans,sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background:'#0F172A', height:56, display:'flex', alignItems:'center',
        padding:'0 24px', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:'#2563EB',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🏢</div>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:'white' }}>Resident Portal</div>
            <div style={{ fontSize:11, color:'#94A3B8' }}>Sunrise Residency</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:700, fontSize:13, color:'white' }}>{resident.name}</div>
            <div style={{ fontSize:11, color:'#94A3B8' }}>Flat {resident.flat} · Wing {resident.wing}</div>
          </div>
          <div style={{ width:36,height:36,borderRadius:'50%',background:'#2563EB',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'white' }}>
            {resident.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
          <button onClick={logout}
            style={{ background:'rgba(220,38,38,0.15)',border:'1px solid rgba(220,38,38,0.3)',
              color:'#FCA5A5',borderRadius:8,padding:'6px 12px',cursor:'pointer',
              fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:5,fontFamily:'inherit' }}>
            <LogOut size={13}/> Logout
          </button>
        </div>
      </nav>

      <div style={{ display:'flex', maxWidth:1100, margin:'0 auto', padding:'20px 16px', gap:20 }}>

        {/* Sidebar */}
        <div style={{ width:200, flexShrink:0 }}>
          <div style={{ background:'white',borderRadius:14,padding:'10px 0',
            border:'1px solid #E2E8F0',boxShadow:'0 1px 4px rgba(0,0,0,0.05)',position:'sticky',top:76 }}>
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.id} onClick={() => setTab(t.id)}
                  style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 16px',
                    cursor:'pointer',borderRadius:8,margin:'2px 6px',fontSize:13,
                    fontWeight:tab===t.id?700:400,
                    color:tab===t.id?'#2563EB':'#64748B',
                    background:tab===t.id?'rgba(37,99,235,0.08)':'transparent',
                    borderLeft:`3px solid ${tab===t.id?'#2563EB':'transparent'}`,
                    transition:'all 0.12s' }}>
                  <Icon size={15}/>{t.label}
                  {t.id==='dues' && pending.length>0 && (
                    <span style={{ marginLeft:'auto',background:'#DC2626',color:'white',
                      borderRadius:99,fontSize:10,padding:'1px 6px',fontWeight:700 }}>
                      {pending.length}
                    </span>
                  )}
                  {t.id==='complaints' && openComp.length>0 && (
                    <span style={{ marginLeft:'auto',background:'#D97706',color:'white',
                      borderRadius:99,fontSize:10,padding:'1px 6px',fontWeight:700 }}>
                      {openComp.length}
                    </span>
                  )}
                </div>
              );
            })}
            {/* Emergency */}
            <div style={{ margin:'12px 8px 6px',background:'rgba(220,38,38,0.06)',
              borderRadius:10,padding:'10px 12px',border:'1px solid rgba(220,38,38,0.15)' }}>
              <div style={{ fontSize:11,color:'#DC2626',fontWeight:700,marginBottom:6 }}>🚨 Emergency</div>
              {[{l:'Security',n:'9999999901'},{l:'Secretary',n:'9820012345'}].map(c=>(
                <a key={c.l} href={`tel:${c.n}`}
                  style={{ display:'flex',justifyContent:'space-between',fontSize:11,color:'#64748B',textDecoration:'none',padding:'3px 0' }}>
                  <span>{c.l}</span><span style={{ color:'#2563EB',fontWeight:600 }}>📞</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* HOME */}
          {tab==='home' && (
            <div>
              <div style={{ background:'linear-gradient(135deg,#1E3A8A,#2563EB)',
                borderRadius:16,padding:'24px 28px',marginBottom:20,color:'white' }}>
                <div style={{ fontWeight:800,fontSize:22 }}>Hello, {resident.name.split(' ')[0]}! 👋</div>
                <div style={{ fontSize:13,opacity:0.8,marginTop:4 }}>Flat {resident.flat} · Wing {resident.wing} · Sunrise Residency</div>
                {pending.length>0 && (
                  <div style={{ marginTop:16,background:'rgba(255,255,255,0.15)',borderRadius:10,
                    padding:'10px 14px',display:'inline-flex',alignItems:'center',gap:10 }}>
                    <AlertCircle size={16}/>
                    <span style={{ fontSize:13,fontWeight:600 }}>{fmt(totalPending)} pending dues</span>
                    <button onClick={()=>setTab('dues')}
                      style={{ background:'white',color:'#2563EB',border:'none',borderRadius:6,
                        padding:'4px 12px',fontSize:12,fontWeight:700,cursor:'pointer' }}>
                      Pay Now
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display:'flex',gap:14,marginBottom:20,flexWrap:'wrap' }}>
                <Card emoji="💰" label="Pending Dues"    value={fmt(totalPending)}    color="#DC2626" sub={`${pending.length} month(s)`}  onClick={()=>setTab('dues')}/>
                <Card emoji="✅" label="Months Paid"     value={paid.length}           color="#16A34A" sub="This year"                      onClick={()=>setTab('dues')}/>
                <Card emoji="🎫" label="Open Complaints" value={openComp.length}       color="#D97706" sub="Awaiting resolution"             onClick={()=>setTab('complaints')}/>
                <Card emoji="📢" label="New Notices"     value={data.notices.length}   color="#2563EB" sub="From admin"                      onClick={()=>setTab('notices')}/>
              </div>

              {/* Notices preview */}
              <div style={{ background:'white',borderRadius:14,border:'1px solid #E2E8F0',overflow:'hidden',marginBottom:16 }}>
                <div style={{ padding:'14px 18px',borderBottom:'1px solid #E2E8F0',
                  display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontWeight:700,fontSize:14.5,color:'#0F172A' }}>📢 Latest Notices</span>
                  <button onClick={()=>setTab('notices')}
                    style={{ background:'none',border:'none',color:'#2563EB',fontSize:12,cursor:'pointer',fontWeight:600 }}>
                    View all →
                  </button>
                </div>
                {data.notices.slice(0,3).map(n=>(
                  <div key={n.id} onClick={()=>setShowNotice(n)}
                    style={{ padding:'12px 18px',borderBottom:'1px solid #F1F5F9',cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e=>e.currentTarget.style.background='white'}>
                    <div style={{ display:'flex',gap:10,alignItems:'flex-start' }}>
                      <span style={{ fontSize:18,flexShrink:0 }}>{n.type==='urgent'?'🚨':n.type==='event'?'🎉':'📋'}</span>
                      <div>
                        <div style={{ fontWeight:600,fontSize:13.5,color:'#0F172A' }}>{n.title}</div>
                        <div style={{ fontSize:12,color:'#94A3B8',marginTop:2 }}>{n.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div style={{ background:'white',borderRadius:14,border:'1px solid #E2E8F0',padding:18 }}>
                <div style={{ fontWeight:700,fontSize:14.5,color:'#0F172A',marginBottom:14 }}>⚡ Quick Actions</div>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
                  {[
                    { label:'Pay Dues',        emoji:'💰', color:'#2563EB', action:()=>setTab('dues')       },
                    { label:'Raise Complaint', emoji:'🎫', color:'#7C3AED', action:()=>{setTab('complaints');setShowForm(true);}},
                    { label:'View Notices',    emoji:'📢', color:'#D97706', action:()=>setTab('notices')    },
                    { label:'My Visitors',     emoji:'🔐', color:'#16A34A', action:()=>setTab('visitors')   },
                  ].map(a=>(
                    <button key={a.label} onClick={a.action}
                      style={{ background:`${a.color}10`,border:`1px solid ${a.color}25`,
                        borderRadius:12,padding:'14px 8px',cursor:'pointer',
                        textAlign:'center',transition:'all 0.15s',fontFamily:'inherit' }}
                      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.background=`${a.color}18`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.background=`${a.color}10`;}}>
                      <div style={{ fontSize:26,marginBottom:6 }}>{a.emoji}</div>
                      <div style={{ fontSize:12,fontWeight:700,color:a.color }}>{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DUES */}
          {tab==='dues' && (
            <div>
              <div style={{ display:'flex',gap:14,marginBottom:20 }}>
                {[
                  { label:'Total Pending', value:fmt(totalPending), color:'#DC2626', sub:`${pending.length} month(s) unpaid` },
                  { label:'Total Paid',    value:fmt(paid.reduce((s,d)=>s+d.amount,0)), color:'#16A34A', sub:`${paid.length} months paid` },
                  { label:'Monthly Charge', value:'₹2,500', color:'#2563EB', sub:'Per month' },
                ].map(s=>(
                  <div key={s.label} style={{ background:'white',borderRadius:14,padding:'18px 20px',
                    border:'1px solid #E2E8F0',flex:1,boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize:13,color:'#64748B',marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontSize:26,fontWeight:800,color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:12,color:'#94A3B8',marginTop:4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:'white',borderRadius:14,border:'1px solid #E2E8F0',overflow:'hidden' }}>
                <div style={{ padding:'14px 18px',borderBottom:'1px solid #E2E8F0',fontWeight:700,fontSize:14.5,color:'#0F172A' }}>
                  💰 Maintenance Dues — Flat {resident.flat}
                </div>
                <table style={{ width:'100%',borderCollapse:'collapse' }}>
                  <thead>
                    <tr>{['Month','Amount','Status','Paid On','Transaction ID','Action'].map(h=>(
                      <th key={h} style={{ textAlign:'left',fontSize:11,color:'#94A3B8',fontWeight:600,
                        padding:'10px 16px',background:'#F8FAFC',borderBottom:'1px solid #E2E8F0',
                        textTransform:'uppercase',letterSpacing:'0.8px' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {dues.map(d=>(
                      <tr key={d.id} style={{ borderBottom:'1px solid #F1F5F9' }}>
                        <td style={{ padding:'12px 16px',fontWeight:600,fontSize:13.5,color:'#0F172A' }}>{d.month}</td>
                        <td style={{ padding:'12px 16px',fontWeight:700,color:'#2563EB' }}>{fmt(d.amount)}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ fontSize:11,padding:'3px 10px',borderRadius:99,fontWeight:700,
                            background:d.status==='Paid'?'rgba(22,163,74,0.1)':'rgba(217,119,6,0.1)',
                            color:d.status==='Paid'?'#16A34A':'#D97706' }}>
                            {d.status==='Paid'?'✅':'⏳'} {d.status}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px',fontSize:12,color:'#94A3B8' }}>{d.paidOn}</td>
                        <td style={{ padding:'12px 16px',fontSize:12,color:'#94A3B8' }}>{d.txnId}</td>
                        <td style={{ padding:'12px 16px' }}>
                          {d.status==='Paid'
                            ? <button style={{ background:'rgba(22,163,74,0.08)',color:'#16A34A',border:'1px solid rgba(22,163,74,0.2)',borderRadius:6,padding:'5px 12px',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'inherit' }}>
                                <Download size={11} style={{ display:'inline',marginRight:4 }}/>Receipt
                              </button>
                            : <button onClick={()=>setShowPay(d)}
                                style={{ background:'#2563EB',color:'white',border:'none',borderRadius:6,padding:'5px 14px',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'inherit' }}>
                                Pay Now →
                              </button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COMPLAINTS */}
          {tab==='complaints' && (
            <div>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16 }}>
                <div style={{ fontWeight:700,fontSize:16,color:'#0F172A' }}>🎫 My Complaints</div>
                <button onClick={()=>setShowForm(!showForm)}
                  style={{ background:'#2563EB',color:'white',border:'none',borderRadius:8,
                    padding:'8px 16px',cursor:'pointer',fontSize:13,fontWeight:700,
                    display:'flex',alignItems:'center',gap:6,fontFamily:'inherit' }}>
                  <Plus size={14}/> Raise Complaint
                </button>
              </div>

              {showForm && (
                <div style={{ background:'white',borderRadius:14,padding:20,marginBottom:16,border:'1px solid #E2E8F0' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:14 }}>
                    <div style={{ fontWeight:700,fontSize:15,color:'#0F172A' }}>🎫 New Complaint</div>
                    <button onClick={()=>setShowForm(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'#94A3B8' }}><X size={18}/></button>
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
                    <div>
                      <label style={{ display:'block',fontSize:11,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px' }}>Category</label>
                      <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                        style={{ width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:13,background:'#F8FAFC',fontFamily:'inherit',color:'#1E293B' }}>
                        <option value="">Select category</option>
                        {['Plumbing','Electrical','Lift','Parking','Security','Cleaning','Noise','Internet','Garden','Other'].map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:'block',fontSize:11,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px' }}>Title</label>
                      <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                        placeholder="Brief title of issue"
                        style={{ width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:13,background:'#F8FAFC',boxSizing:'border-box',fontFamily:'inherit',color:'#1E293B' }}/>
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:'block',fontSize:11,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px' }}>Description</label>
                    <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                      placeholder="Describe the issue..."
                      style={{ width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:13,background:'#F8FAFC',minHeight:80,resize:'vertical',boxSizing:'border-box',fontFamily:'inherit',color:'#1E293B' }}/>
                  </div>
                  <button onClick={addComplaint}
                    style={{ background:'#2563EB',color:'white',border:'none',borderRadius:8,padding:'9px 20px',cursor:'pointer',fontSize:13,fontWeight:700,display:'flex',alignItems:'center',gap:6,fontFamily:'inherit' }}>
                    <Send size={13}/> Submit Complaint
                  </button>
                </div>
              )}

              {complaints.map(c=>(
                <div key={c.id} style={{ background:'white',borderRadius:14,padding:18,border:'1px solid #E2E8F0',marginBottom:12 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                    <div>
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
                        <span style={{ fontSize:11,background:'rgba(37,99,235,0.1)',color:'#2563EB',padding:'2px 8px',borderRadius:99,fontWeight:700 }}>{c.ticket}</span>
                        <span style={{ fontSize:11,background:'rgba(124,58,237,0.1)',color:'#7C3AED',padding:'2px 8px',borderRadius:99 }}>{c.category}</span>
                      </div>
                      <div style={{ fontWeight:700,fontSize:14.5,color:'#0F172A' }}>{c.title}</div>
                      <div style={{ fontSize:12,color:'#94A3B8',marginTop:2 }}>Filed on {c.date}</div>
                    </div>
                    <span style={{ fontSize:11,padding:'4px 12px',borderRadius:99,fontWeight:700,whiteSpace:'nowrap',
                      background:c.status==='Resolved'?'rgba(22,163,74,0.1)':c.status==='In Progress'?'rgba(37,99,235,0.1)':'rgba(217,119,6,0.1)',
                      color:c.status==='Resolved'?'#16A34A':c.status==='In Progress'?'#2563EB':'#D97706' }}>
                      {c.status==='Resolved'?'✅':c.status==='In Progress'?'🔄':'⏳'} {c.status}
                    </span>
                  </div>
                  {c.reply && (
                    <div style={{ background:'rgba(22,163,74,0.06)',borderRadius:8,padding:'10px 14px',border:'1px solid rgba(22,163,74,0.2)',fontSize:13,color:'#64748B' }}>
                      <span style={{ fontWeight:700,color:'#16A34A' }}>Society Response: </span>{c.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* NOTICES */}
          {tab==='notices' && (
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:'#0F172A',marginBottom:16 }}>📢 Society Notices</div>
              {data.notices.map(n=>(
                <div key={n.id} onClick={()=>setShowNotice(n)}
                  style={{ background:'white',borderRadius:14,padding:18,marginBottom:12,
                    border:`1px solid ${n.type==='urgent'?'rgba(220,38,38,0.2)':n.type==='event'?'rgba(124,58,237,0.2)':'#E2E8F0'}`,
                    cursor:'pointer',boxShadow:'0 1px 4px rgba(0,0,0,0.05)',transition:'all 0.12s' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)';}}>
                  <div style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
                    <div style={{ fontSize:28,flexShrink:0 }}>{n.type==='urgent'?'🚨':n.type==='event'?'🎉':'📋'}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                        <div style={{ fontWeight:700,fontSize:14.5,color:'#0F172A' }}>{n.title}</div>
                        <span style={{ fontSize:11,padding:'2px 8px',borderRadius:99,fontWeight:600,
                          background:n.type==='urgent'?'rgba(220,38,38,0.1)':n.type==='event'?'rgba(124,58,237,0.1)':'rgba(37,99,235,0.1)',
                          color:n.type==='urgent'?'#DC2626':n.type==='event'?'#7C3AED':'#2563EB' }}>
                          {n.type.charAt(0).toUpperCase()+n.type.slice(1)}
                        </span>
                      </div>
                      <div style={{ fontSize:13,color:'#64748B',lineHeight:1.6 }}>{n.body.slice(0,100)}...</div>
                      <div style={{ fontSize:11,color:'#94A3B8',marginTop:6 }}>Posted: {n.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISITORS */}
          {tab==='visitors' && (
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:'#0F172A',marginBottom:16 }}>🔐 My Visitor Log — Flat {resident.flat}</div>
              {data.visitors.map(v=>(
                <div key={v.id} style={{ background:'white',borderRadius:14,padding:18,marginBottom:12,
                  border:'1px solid #E2E8F0',boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
                  display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <div style={{ display:'flex',gap:14,alignItems:'center' }}>
                    <div style={{ width:44,height:44,borderRadius:'50%',background:'rgba(37,99,235,0.1)',
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>👤</div>
                    <div>
                      <div style={{ fontWeight:700,fontSize:14.5,color:'#0F172A' }}>{v.name}</div>
                      <div style={{ fontSize:12,color:'#64748B',marginTop:2 }}>{v.purpose} · {v.date} · {v.time}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:11,padding:'4px 12px',borderRadius:99,fontWeight:700,
                    background:'rgba(100,116,139,0.1)',color:'#64748B' }}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pay Modal */}
      {showPay && (
        <div style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20 }}
          onClick={()=>setShowPay(null)}>
          <div style={{ background:'white',borderRadius:20,padding:28,maxWidth:400,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:20 }}>
              <div style={{ fontWeight:800,fontSize:18,color:'#0F172A' }}>💳 Pay Maintenance</div>
              <button onClick={()=>setShowPay(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'#94A3B8' }}><X size={20}/></button>
            </div>
            <div style={{ background:'rgba(37,99,235,0.06)',border:'1px solid rgba(37,99,235,0.2)',borderRadius:12,padding:16,marginBottom:20 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13 }}>
                <span style={{ color:'#64748B' }}>Month</span>
                <span style={{ fontWeight:700,color:'#0F172A' }}>{showPay.month}</span>
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:15 }}>
                <span style={{ color:'#64748B' }}>Amount Due</span>
                <span style={{ fontWeight:800,color:'#2563EB',fontSize:20 }}>₹{showPay.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:10 }}>Pay via</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                {[{l:'UPI / GPay',e:'📱'},{l:'Net Banking',e:'🏦'},{l:'Credit Card',e:'💳'},{l:'Debit Card',e:'💳'}].map(p=>(
                  <button key={p.l} onClick={()=>pay(showPay.id)}
                    style={{ background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'12px 8px',cursor:'pointer',textAlign:'center',fontFamily:'inherit',transition:'all 0.12s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#2563EB';e.currentTarget.style.background='rgba(37,99,235,0.06)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.background='#F8FAFC';}}>
                    <div style={{ fontSize:22,marginBottom:4 }}>{p.e}</div>
                    <div style={{ fontSize:12,fontWeight:600,color:'#1E293B' }}>{p.l}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize:11,color:'#94A3B8',textAlign:'center' }}>🔒 Secured by Razorpay · 256-bit SSL</div>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {showNotice && (
        <div style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20 }}
          onClick={()=>setShowNotice(null)}>
          <div style={{ background:'white',borderRadius:20,padding:28,maxWidth:480,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16 }}>
              <span style={{ fontSize:11,padding:'3px 10px',borderRadius:99,fontWeight:700,
                background:showNotice.type==='urgent'?'rgba(220,38,38,0.1)':showNotice.type==='event'?'rgba(124,58,237,0.1)':'rgba(37,99,235,0.1)',
                color:showNotice.type==='urgent'?'#DC2626':showNotice.type==='event'?'#7C3AED':'#2563EB' }}>
                {showNotice.type==='urgent'?'🚨 Urgent':showNotice.type==='event'?'🎉 Event':'📋 Info'}
              </span>
              <button onClick={()=>setShowNotice(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'#94A3B8' }}><X size={20}/></button>
            </div>
            <div style={{ fontWeight:800,fontSize:18,color:'#0F172A',marginBottom:8 }}>{showNotice.title}</div>
            <div style={{ fontSize:12,color:'#94A3B8',marginBottom:16 }}>Posted: {showNotice.date}</div>
            <div style={{ fontSize:14,lineHeight:1.7,color:'#64748B' }}>{showNotice.body}</div>
          </div>
        </div>
      )}

    </div>
  );
}
