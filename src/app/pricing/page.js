'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, X, Zap, Star, Crown } from 'lucide-react';

const PLANS = [
  {
    slug: 'starter', name: 'Starter', price: 25, icon: <Zap size={22}/>, color: '#2563EB',
    tagline: 'Perfect for small societies',
    maxFlats: '50 flats',
    features: [
      { text: 'Dashboard & Analytics',       included: true  },
      { text: 'Tenant Management',            included: true  },
      { text: 'Maintenance & Billing',        included: true  },
      { text: 'UPI / Razorpay Payments',      included: true  },
      { text: 'Announcements & Meetings',     included: true  },
      { text: 'Photo Gallery',                included: true  },
      { text: 'SMS & WhatsApp Alerts',        included: false },
      { text: 'Visitor Management',           included: false },
      { text: 'Parking Manager',              included: false },
      { text: 'Forum & Polls',                included: false },
      { text: 'Home Services Marketplace',    included: false },
    ],
  },
  {
    slug: 'standard', name: 'Standard', price: 40, icon: <Star size={22}/>, color: '#7C3AED', popular: true,
    tagline: 'Most popular for mid-size societies',
    maxFlats: '200 flats',
    features: [
      { text: 'Everything in Starter',        included: true },
      { text: 'SMS & WhatsApp Alerts',         included: true },
      { text: 'Visitor Management',            included: true },
      { text: 'Parking Manager',               included: true },
      { text: 'Complaint Box',                 included: true },
      { text: 'Discussion Forum & Polls',      included: true },
      { text: 'Committee Members',             included: true },
      { text: 'File Repository',               included: true },
      { text: 'Facility Booking',              included: true },
      { text: 'Home Services Marketplace',     included: false },
      { text: 'White-label Branding',          included: false },
    ],
  },
  {
    slug: 'premium', name: 'Premium', price: 60, icon: <Crown size={22}/>, color: '#D97706',
    tagline: 'For large societies wanting everything',
    maxFlats: 'Unlimited flats',
    features: [
      { text: 'Everything in Standard',        included: true },
      { text: 'Home Services Marketplace',     included: true },
      { text: 'Properties (Buy / Rent)',        included: true },
      { text: 'White-label Branding',          included: true },
      { text: 'Custom Domain / Subdomain',     included: true },
      { text: 'Priority Email & Phone Support',included: true },
      { text: 'Dedicated Account Manager',     included: true },
      { text: 'Custom Feature Requests',       included: true },
      { text: 'API Access',                    included: true },
      { text: 'Data Export (CSV / Excel)',     included: true },
      { text: 'SLA Guarantee',                 included: true },
    ],
  },
];

const calcPrice = (pricePerFlat, flats, cycle) => {
  if (cycle === 'yearly') return Math.round(pricePerFlat * flats * 10);
  return pricePerFlat * flats;
};

export default function Pricing() {
  const router  = useRouter();
  const [cycle, setCycle]   = useState('monthly');
  const [flats, setFlats]   = useState(50);

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'DM Sans, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 40px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontWeight:800, fontSize:20, color:'#2563EB' }}>🏢 SocietyPro</div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={()=>router.push('/register')} style={{ background:'#2563EB', color:'#fff', border:'none', borderRadius:8, padding:'8px 20px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
            Start Free Trial
          </button>
          <button onClick={()=>router.push('/')} style={{ background:'transparent', color:'#64748B', border:'1px solid #E2E8F0', borderRadius:8, padding:'8px 20px', fontWeight:600, cursor:'pointer', fontSize:14 }}>
            Login
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'60px 24px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-block', background:'rgba(37,99,235,0.08)', color:'#2563EB', borderRadius:99, padding:'5px 16px', fontSize:13, fontWeight:700, marginBottom:16 }}>
            Simple, transparent pricing
          </div>
          <h1 style={{ fontSize:42, fontWeight:800, color:'#0F172A', marginBottom:12, lineHeight:1.2 }}>
            Plans for every society
          </h1>
          <p style={{ fontSize:17, color:'#64748B', maxWidth:520, margin:'0 auto 28px' }}>
            Start with a 30-day free trial. No credit card required. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div style={{ display:'inline-flex', background:'#F1F5F9', borderRadius:99, padding:4, marginBottom:28 }}>
            {['monthly','yearly'].map(c=>(
              <button key={c} onClick={()=>setCycle(c)}
                style={{ padding:'8px 24px', borderRadius:99, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:cycle===c?'#2563EB':'transparent', color:cycle===c?'#fff':'#64748B', transition:'all 0.15s' }}>
                {c==='monthly'?'Monthly':'Yearly'} {c==='yearly'&&<span style={{ background:'#16A34A', color:'#fff', fontSize:10, padding:'1px 7px', borderRadius:99, marginLeft:6 }}>2 months FREE</span>}
              </button>
            ))}
          </div>

          {/* Flat slider */}
          <div style={{ display:'flex', alignItems:'center', gap:16, justifyContent:'center', marginBottom:8 }}>
            <span style={{ fontSize:14, color:'#64748B' }}>Flats in your society:</span>
            <input type="range" min="10" max="500" step="10" value={flats} onChange={e=>setFlats(+e.target.value)} style={{ width:200 }}/>
            <span style={{ fontSize:16, fontWeight:800, color:'#0F172A', minWidth:60 }}>{flats} flats</span>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginBottom:48 }}>
          {PLANS.map(p=>{
            const monthly = calcPrice(p.price, flats, 'monthly');
            const total   = calcPrice(p.price, flats, cycle);
            return (
              <div key={p.slug} style={{ background:'#fff', borderRadius:20, padding:28, border: p.popular?`2px solid ${p.color}`:'1px solid #E2E8F0', position:'relative', boxShadow: p.popular?`0 8px 32px ${p.color}20`:'0 2px 8px rgba(0,0,0,0.06)' }}>
                {p.popular && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:p.color, color:'#fff', borderRadius:99, padding:'4px 18px', fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
                    ⭐ Most Popular
                  </div>
                )}
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, color:p.color }}>
                  {p.icon}
                  <span style={{ fontSize:20, fontWeight:800, color:'#0F172A' }}>{p.name}</span>
                </div>
                <div style={{ fontSize:13, color:'#64748B', marginBottom:18 }}>{p.tagline}</div>

                <div style={{ marginBottom:4 }}>
                  <span style={{ fontSize:36, fontWeight:800, color:'#0F172A' }}>₹{total.toLocaleString()}</span>
                  <span style={{ fontSize:13, color:'#64748B' }}>/{cycle==='yearly'?'year':'month'}</span>
                </div>
                <div style={{ fontSize:12, color:'#64748B', marginBottom:6 }}>
                  ₹{p.price}/flat × {flats} flats{cycle==='yearly'?' × 10 months':''}
                </div>
                {cycle==='yearly' && (
                  <div style={{ fontSize:12, color:'#16A34A', fontWeight:700, marginBottom:16 }}>
                    Save ₹{(monthly*2).toLocaleString()} per year!
                  </div>
                )}
                <div style={{ fontSize:12, color:'#64748B', marginBottom:20 }}>Up to {p.maxFlats}</div>

                <button onClick={()=>router.push(`/register?plan=${p.slug}`)}
                  style={{ width:'100%', padding:'12px 0', background:p.popular?p.color:'transparent', color:p.popular?'#fff':p.color, border:`2px solid ${p.color}`, borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:14, marginBottom:20, transition:'all 0.15s' }}
                  onMouseEnter={e=>{ if(!p.popular){ e.currentTarget.style.background=p.color; e.currentTarget.style.color='#fff'; }}}
                  onMouseLeave={e=>{ if(!p.popular){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=p.color; }}}>
                  Start Free Trial →
                </button>

                {p.features.map(f=>(
                  <div key={f.text} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8, opacity: f.included?1:0.4 }}>
                    {f.included ? <CheckCircle size={15} style={{ color:'#16A34A', flexShrink:0 }}/> : <X size={15} style={{ color:'#94A3B8', flexShrink:0 }}/>}
                    <span style={{ fontSize:13, color: f.included?'#1E293B':'#94A3B8' }}>{f.text}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Trust section */}
        <div style={{ textAlign:'center', background:'#fff', borderRadius:16, padding:'32px 24px', border:'1px solid #E2E8F0' }}>
          <div style={{ fontSize:20, fontWeight:800, color:'#0F172A', marginBottom:20 }}>Trusted by societies across India 🇮🇳</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              { value:'30 days', label:'Free trial — no card' },
              { value:'99.9%',   label:'Uptime guarantee' },
              { value:'< 24h',   label:'Support response' },
              { value:'∞',       label:'Data security' },
            ].map(s=>(
              <div key={s.label} style={{ padding:'16px 12px' }}>
                <div style={{ fontSize:28, fontWeight:800, color:'#2563EB' }}>{s.value}</div>
                <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
