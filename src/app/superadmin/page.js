'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Building2, Users, IndianRupee, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Eye, Ban, RefreshCw, LogOut } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PLAN_COLORS = { starter:'#2563EB', standard:'#7C3AED', premium:'#D97706', trial:'#64748B' };
const STATUS_BADGE = { active:'badge-green', trial:'badge-gold', suspended:'badge-red' };

const mock = {
  stats: {
    societies: { total:48, active:35, trial:11, suspended:2, new_month:7, total_flats:3840, by_plan:{ starter:18, standard:22, premium:8 } },
    revenue:   { total:2450000, month:192000, year:1840000, invoices:186, arr_monthly:192000, arr_yearly:2304000 },
  },
  plans: [
    { name:'Starter',  slug:'starter',  price_per_flat:25, society_count:18, total_flats:620,  monthly_arr:15500 },
    { name:'Standard', slug:'standard', price_per_flat:40, society_count:22, total_flats:2840, monthly_arr:113600 },
    { name:'Premium',  slug:'premium',  price_per_flat:60, society_count:8,  total_flats:380,  monthly_arr:22800 },
  ],
  recent_societies: [
    { id:1, name:'Sunrise Residency',     slug:'sunrise',     plan:'standard', status:'active', total_flats:48, secretary_email:'sec@sunrise.in',   created_at:'2025-04-10' },
    { id:2, name:'Green Park Apartments', slug:'greenpark',   plan:'premium',  status:'active', total_flats:120,secretary_email:'admin@greenpark.com',created_at:'2025-04-08' },
    { id:3, name:'Blue Hills CHS',        slug:'bluehills',   plan:'standard', status:'trial',  total_flats:64, secretary_email:'bh@email.com',       created_at:'2025-04-06' },
    { id:4, name:'Shanti Nagar Society',  slug:'shantinagar', plan:'starter',  status:'active', total_flats:36, secretary_email:'sn@email.com',       created_at:'2025-04-03' },
    { id:5, name:'Metro Heights CHS',     slug:'metro',       plan:'standard', status:'trial',  total_flats:88, secretary_email:'mh@email.com',       created_at:'2025-04-01' },
  ],
  expiring_trials: [
    { id:6, name:'Palm Grove Society', plan:'standard', total_flats:52, trial_ends_at:'2025-04-23' },
    { id:7, name:'River View Flats',   plan:'starter',  total_flats:30, trial_ends_at:'2025-04-25' },
  ],
  monthly: [
    { month:'Nov', revenue:98000 },{ month:'Dec', revenue:115000 },{ month:'Jan', revenue:132000 },
    { month:'Feb', revenue:148000 },{ month:'Mar', revenue:170000 },{ month:'Apr', revenue:192000 },
  ],
};

export default function SuperAdmin() {
  const [data, setData]         = useState(mock);
  const [tab, setTab]           = useState('overview');
  const [societies, setSocieties] = useState(mock.recent_societies);
  const [search, setSearch]     = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const s = data.stats;
  const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;

  const filteredSoc = societies.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.secretary_email.toLowerCase().includes(search.toLowerCase());
    const matchPlan   = filterPlan === 'all'   || s.plan === filterPlan;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9', fontFamily:'DM Sans,sans-serif' }}>
      {/* Top nav */}
      <div style={{ background:'#0F172A', height:56, display:'flex', alignItems:'center', padding:'0 28px', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:18, fontWeight:800, color:'#fff' }}>🏢 SocietyPro</span>
          <span style={{ fontSize:11, background:'rgba(37,99,235,0.3)', color:'#93C5FD', borderRadius:99, padding:'2px 10px', fontWeight:700 }}>SUPER ADMIN</span>
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#94A3B8' }}>superadmin@societypro.in</span>
          <button style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer' }}><LogOut size={18}/></button>
        </div>
      </div>

      <div style={{ display:'flex' }}>
        {/* Sidebar */}
        <div style={{ width:220, background:'#fff', minHeight:'calc(100vh - 56px)', borderRight:'1px solid #E2E8F0', padding:'16px 0' }}>
          {[
            { id:'overview',  label:'Overview',      emoji:'📊' },
            { id:'societies', label:'All Societies',  emoji:'🏢' },
            { id:'revenue',   label:'Revenue',        emoji:'💰' },
            { id:'trials',    label:'Expiring Trials',emoji:'⏰', badge: data.expiring_trials?.length },
            { id:'settings',  label:'Settings',       emoji:'⚙️' },
          ].map(t=>(
            <div key={t.id} onClick={()=>setTab(t.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', cursor:'pointer', borderLeft:`3px solid ${tab===t.id?'#2563EB':'transparent'}`, background:tab===t.id?'rgba(37,99,235,0.06)':'transparent', fontSize:13.5, fontWeight:tab===t.id?700:400, color:tab===t.id?'#2563EB':'#64748B', marginBottom:2, justifyContent:'space-between' }}>
              <span>{t.emoji} {t.label}</span>
              {t.badge > 0 && <span style={{ background:'#DC2626', color:'#fff', borderRadius:99, fontSize:10, padding:'1px 7px', fontWeight:700 }}>{t.badge}</span>}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:24, overflowX:'hidden' }}>

          {/* ── OVERVIEW ── */}
          {tab==='overview' && (
            <div>
              {/* Stat cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'Total Societies',  value:s.societies.total,                              color:'#2563EB', sub:`${s.societies.new_month} new this month`,  icon:'🏢' },
                  { label:'Active Societies', value:`${s.societies.active} / ${s.societies.total}`, color:'#16A34A', sub:`${s.societies.trial} on trial`,            icon:'✅' },
                  { label:'MRR (Monthly)',    value:fmt(s.revenue.arr_monthly),                     color:'#7C3AED', sub:`ARR: ${fmt(s.revenue.arr_yearly)}`,        icon:'💰' },
                  { label:'Total Revenue',   value:fmt(s.revenue.total),                            color:'#D97706', sub:`${s.revenue.invoices} invoices`,           icon:'📈' },
                ].map((c,i)=>(
                  <div key={i} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:12, color:'#64748B' }}>{c.label}</span>
                      <span style={{ fontSize:22, opacity:0.15 }}>{c.icon}</span>
                    </div>
                    <div style={{ fontSize:26, fontWeight:800, color:c.color }}>{c.value}</div>
                    <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                {/* Revenue chart */}
                <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:14 }}>📈 Monthly Revenue</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={data.monthly} barSize={28}>
                      <XAxis dataKey="month" tick={{ fill:'#94A3B8', fontSize:11 }} axisLine={false} tickLine={false}/>
                      <YAxis hide/>
                      <Tooltip formatter={v=>[`₹${(v/1000).toFixed(0)}K`]} labelStyle={{ color:'#0F172A' }} contentStyle={{ border:'1px solid #E2E8F0', borderRadius:8, fontSize:12 }}/>
                      <Bar dataKey="revenue" radius={[6,6,0,0]}>
                        {data.monthly.map((_,i)=><Cell key={i} fill={i===data.monthly.length-1?'#2563EB':'#E2E8F0'}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Plans breakdown */}
                <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:14 }}>📦 Plan Breakdown</div>
                  {data.plans.map(p=>(
                    <div key={p.slug} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{p.name}</span>
                        <span style={{ fontSize:13, color:'#64748B' }}>{p.society_count} societies · ₹{(p.monthly_arr/1000).toFixed(0)}K MRR</span>
                      </div>
                      <div style={{ height:8, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${(p.society_count/s.societies.total)*100}%`, background:PLAN_COLORS[p.slug], borderRadius:99 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent signups */}
              <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:14 }}>🆕 Recent Signups</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>
                    {['Society','Plan','Status','Flats','Email','Joined'].map(h=>(<th key={h} style={{ textAlign:'left', fontSize:11, color:'#94A3B8', fontWeight:600, padding:'6px 10px', textTransform:'uppercase', letterSpacing:'0.8px', borderBottom:'1px solid #F1F5F9' }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {data.recent_societies.map(s=>(
                      <tr key={s.id} style={{ cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'10px 10px', fontWeight:600, fontSize:13.5, color:'#0F172A' }}>{s.name}</td>
                        <td style={{ padding:'10px 10px' }}><span style={{ fontSize:11, background:`${PLAN_COLORS[s.plan]}15`, color:PLAN_COLORS[s.plan], padding:'2px 9px', borderRadius:99, fontWeight:700 }}>{s.plan}</span></td>
                        <td style={{ padding:'10px 10px' }}><span style={{ fontSize:11, background:s.status==='active'?'rgba(22,163,74,0.1)':s.status==='trial'?'rgba(217,119,6,0.1)':'rgba(220,38,38,0.1)', color:s.status==='active'?'#16A34A':s.status==='trial'?'#D97706':'#DC2626', padding:'2px 9px', borderRadius:99, fontWeight:700 }}>{s.status}</span></td>
                        <td style={{ padding:'10px 10px', fontSize:13, color:'#64748B' }}>{s.total_flats}</td>
                        <td style={{ padding:'10px 10px', fontSize:12, color:'#94A3B8' }}>{s.secretary_email}</td>
                        <td style={{ padding:'10px 10px', fontSize:12, color:'#94A3B8' }}>{new Date(s.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expiring trials */}
              {data.expiring_trials?.length > 0 && (
                <div style={{ background:'rgba(220,38,38,0.05)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:12, padding:'18px 20px', marginTop:16 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#DC2626', marginBottom:12 }}>⏰ Trials Expiring in 7 Days — Convert These!</div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    {data.expiring_trials.map(t=>(
                      <div key={t.id} style={{ background:'#fff', borderRadius:10, padding:'12px 16px', border:'1px solid rgba(220,38,38,0.2)', flex:1, minWidth:200 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:'#0F172A' }}>{t.name}</div>
                        <div style={{ fontSize:12, color:'#64748B', margin:'4px 0' }}>{t.total_flats} flats · {t.plan} plan</div>
                        <div style={{ fontSize:12, color:'#DC2626', fontWeight:600 }}>Expires: {new Date(t.trial_ends_at).toLocaleDateString('en-IN')}</div>
                        <button style={{ marginTop:10, width:'100%', background:'#2563EB', color:'#fff', border:'none', borderRadius:6, padding:'6px 0', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                          Send Upgrade Email
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SOCIETIES TAB ── */}
          {tab==='societies' && (
            <div>
              <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
                <div style={{ position:'relative', maxWidth:300 }}>
                  <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }}/>
                  <input placeholder="Search society or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34, background:'#fff', border:'1px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:13, padding:'8px 14px 8px 34px', outline:'none', width:'100%', fontFamily:'inherit' }}/>
                </div>
                {['all','starter','standard','premium'].map(p=>(
                  <button key={p} onClick={()=>setFilterPlan(p)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${filterPlan===p?'#2563EB':'#E2E8F0'}`, background:filterPlan===p?'#2563EB':'#fff', color:filterPlan===p?'#fff':'#64748B', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {p==='all'?'All Plans':p.charAt(0).toUpperCase()+p.slice(1)}
                  </button>
                ))}
                {['all','active','trial','suspended'].map(st=>(
                  <button key={st} onClick={()=>setFilterStatus(st)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${filterStatus===st?'#2563EB':'#E2E8F0'}`, background:filterStatus===st?'#2563EB':'#fff', color:filterStatus===st?'#fff':'#64748B', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {st==='all'?'All Status':st.charAt(0).toUpperCase()+st.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontWeight:700, fontSize:14, color:'#0F172A' }}>
                  All Societies ({filteredSoc.length})
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>
                    {['Society','Plan','Status','Flats','MRR','Secretary','Joined','Actions'].map(h=>(
                      <th key={h} style={{ textAlign:'left', fontSize:11, color:'#94A3B8', fontWeight:600, padding:'8px 14px', textTransform:'uppercase', letterSpacing:'0.8px', background:'#F8FAFC', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredSoc.map(sc=>{
                      const plan = data.plans.find(p=>p.slug===sc.plan);
                      const mrr  = (plan?.price_per_flat||0) * sc.total_flats;
                      return (
                        <tr key={sc.id} onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'12px 14px', fontWeight:600, fontSize:13.5, color:'#0F172A' }}>{sc.name}</td>
                          <td style={{ padding:'12px 14px' }}><span style={{ fontSize:11, background:`${PLAN_COLORS[sc.plan]}15`, color:PLAN_COLORS[sc.plan], padding:'3px 10px', borderRadius:99, fontWeight:700 }}>{sc.plan}</span></td>
                          <td style={{ padding:'12px 14px' }}><span style={{ fontSize:11, background:sc.status==='active'?'rgba(22,163,74,0.1)':sc.status==='trial'?'rgba(217,119,6,0.1)':'rgba(220,38,38,0.1)', color:sc.status==='active'?'#16A34A':sc.status==='trial'?'#D97706':'#DC2626', padding:'3px 10px', borderRadius:99, fontWeight:700 }}>{sc.status}</span></td>
                          <td style={{ padding:'12px 14px', fontSize:13, color:'#64748B' }}>{sc.total_flats}</td>
                          <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#16A34A' }}>₹{mrr.toLocaleString()}</td>
                          <td style={{ padding:'12px 14px', fontSize:12, color:'#94A3B8' }}>{sc.secretary_email}</td>
                          <td style={{ padding:'12px 14px', fontSize:12, color:'#94A3B8' }}>{new Date(sc.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                          <td style={{ padding:'12px 14px' }}>
                            <div style={{ display:'flex', gap:6 }}>
                              <button style={{ background:'rgba(37,99,235,0.08)', color:'#2563EB', border:'none', borderRadius:6, padding:'5px 10px', cursor:'pointer', fontSize:11 }}><Eye size={12}/></button>
                              <button style={{ background:sc.status==='suspended'?'rgba(22,163,74,0.08)':'rgba(220,38,38,0.08)', color:sc.status==='suspended'?'#16A34A':'#DC2626', border:'none', borderRadius:6, padding:'5px 10px', cursor:'pointer', fontSize:11 }}>
                                {sc.status==='suspended'?<CheckCircle size={12}/>:<Ban size={12}/>}
                              </button>
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

          {/* ── REVENUE TAB ── */}
          {tab==='revenue' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'This Month',     value:fmt(s.revenue.month),      color:'#2563EB', icon:'📅' },
                  { label:'This Year',      value:fmt(s.revenue.year),       color:'#7C3AED', icon:'📆' },
                  { label:'Total Revenue',  value:fmt(s.revenue.total),      color:'#D97706', icon:'💰' },
                  { label:'Monthly ARR',    value:fmt(s.revenue.arr_monthly),color:'#16A34A', icon:'📈' },
                  { label:'Yearly ARR',     value:fmt(s.revenue.arr_yearly), color:'#0891B2', icon:'🚀' },
                  { label:'Total Invoices', value:s.revenue.invoices,        color:'#64748B', icon:'🧾' },
                ].map((c,i)=>(
                  <div key={i} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize:12, color:'#64748B', marginBottom:6 }}>{c.icon} {c.label}</div>
                    <div style={{ fontSize:28, fontWeight:800, color:c.color }}>{c.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:16 }}>📊 Monthly Revenue Trend</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.monthly}>
                    <XAxis dataKey="month" tick={{ fill:'#94A3B8', fontSize:12 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:'#94A3B8', fontSize:11 }} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} axisLine={false} tickLine={false}/>
                    <Tooltip formatter={v=>[`₹${(v/1000).toFixed(1)}K`]} contentStyle={{ border:'1px solid #E2E8F0', borderRadius:8, fontSize:12 }}/>
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} dot={{ fill:'#2563EB', r:4 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── TRIALS TAB ── */}
          {tab==='trials' && (
            <div>
              <div style={{ background:'rgba(220,38,38,0.04)', border:'1px solid rgba(220,38,38,0.15)', borderRadius:12, padding:'18px 20px' }}>
                <div style={{ fontWeight:700, fontSize:16, color:'#DC2626', marginBottom:16 }}>⏰ Trials Expiring Soon — Action Required</div>
                {data.expiring_trials.map(t=>(
                  <div key={t.id} style={{ background:'#fff', borderRadius:10, padding:'16px 20px', marginBottom:12, border:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:'#0F172A' }}>{t.name}</div>
                      <div style={{ fontSize:13, color:'#64748B', margin:'4px 0' }}>{t.total_flats} flats · {t.plan} plan · ₹{({'starter':25,'standard':40,'premium':60}[t.plan])*t.total_flats}/month</div>
                      <div style={{ fontSize:13, color:'#DC2626', fontWeight:600 }}>Trial ends: {new Date(t.trial_ends_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button style={{ background:'#2563EB', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Send Upgrade Email</button>
                      <button style={{ background:'rgba(37,99,235,0.08)', color:'#2563EB', border:'1px solid rgba(37,99,235,0.2)', borderRadius:8, padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Extend Trial</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
