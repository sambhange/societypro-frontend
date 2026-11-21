'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const _raw = process.env.NEXT_PUBLIC_API_URL || '';
const API_BASE = (_raw.replace(/^["'\s]+|["'\s]+$/g, '') || '').startsWith('http')
  ? _raw.replace(/^["'\s]+|["'\s]+$/g, '')
  : 'https://societypro-backend-production-e249.up.railway.app';

export default function Dashboard() {
  const [stats,    setStats]    = useState(null);
  const [society,  setSociety]  = useState(null);
  const [user,     setUser]     = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // Load user & society from localStorage
    try {
      const u = localStorage.getItem('user');
      const s = localStorage.getItem('society');
      if (u) setUser(JSON.parse(u));
      if (s) setSociety(JSON.parse(s));
    } catch(_) {}

    // Fetch live stats from backend
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/dashboard`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};

  const statCards = [
    { label: 'Total Flats',        value: s.total_flats    ?? society?.total_flats ?? '—', badge: society?.plan ? `${society.plan} plan` : 'trial plan',      color: '#4F46E5', icon: '🏢' },
    { label: 'Active Residents',   value: s.total_tenants  ?? 0,                           badge: 'registered',                                                color: '#059669', icon: '👥' },
    { label: 'Pending Dues',       value: s.pending_dues   ?? 0,                           badge: 'maintenance requests',                                      color: '#DC2626', icon: '🔧' },
    { label: 'Open Complaints',    value: s.open_complaints ?? 0,                          badge: 'to resolve',                                                color: '#D97706', icon: '📋' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>⏳</div>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome banner */}
      {society?.name && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.10) 100%)',
          border: '1px solid rgba(79,70,229,0.2)',
          borderRadius: 14, padding: '18px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--white)' }}>
              🏢 {society.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              {[society.city, society.state].filter(Boolean).join(', ')}
              {society.total_flats ? ` · ${society.total_flats} flats` : ''}
              {society.plan ? ` · ${society.plan} plan` : ''}
            </div>
          </div>
          <div style={{
            background: 'rgba(79,70,229,0.2)', borderRadius: 10,
            padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#818CF8',
          }}>
            {user?.role === 'secretary' ? '🔑 Secretary' : user?.role || 'Admin'}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((c, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{c.icon}</div>
            <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-badge" style={{ background: `${c.color}20`, color: c.color }}>{c.badge}</div>
          </div>
        ))}
      </div>

      {/* Quick actions + getting-started */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title"><span>⚡ Quick Actions</span></div>
          {[
            { href: '/tenants',       icon: '👤', label: 'Add Resident',       desc: 'Register a new flat owner or tenant' },
            { href: '/maintenance',   icon: '💰', label: 'Record Payment',      desc: 'Log maintenance or dues payment' },
            { href: '/announcements', icon: '📢', label: 'Post Announcement',   desc: 'Send a notice to all residents' },
            { href: '/complaints',    icon: '📋', label: 'View Complaints',     desc: 'See open resident complaints' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0', borderBottom: '1px solid rgba(30,45,69,0.4)',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(79,70,229,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  flexShrink: 0,
                }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--white)' }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{a.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 16 }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="card">
          <div className="card-title"><span>🚀 Getting Started</span></div>
          {[
            { done: true,  step: 'Society registered',      desc: 'Your account is set up and active' },
            { done: (s.total_tenants > 0), step: 'Add your first resident', desc: 'Go to Tenants → Add Resident', href: '/tenants' },
            { done: false, step: 'Set up maintenance dues',  desc: 'Go to Maintenance → Billing', href: '/maintenance' },
            { done: false, step: 'Post an announcement',     desc: 'Go to Announcements → New Post', href: '/announcements' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 0', borderBottom: '1px solid rgba(30,45,69,0.4)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: item.done ? 'rgba(5,150,105,0.15)' : 'rgba(79,70,229,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>
                {item.done ? '✅' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: item.done ? 'var(--muted)' : 'var(--white)' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
              {item.href && !item.done && (
                <Link href={item.href}>
                  <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600 }}>Go →</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Collection summary */}
      <div className="card" style={{ marginTop: 0 }}>
        <div className="card-title">
          <span>💰 Collection Summary</span>
          <Link href="/maintenance"><span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>View all →</span></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginTop: 8 }}>
          {[
            { label: 'Total Collected',  value: `₹${(s.total_collected || 0).toLocaleString()}`, color: '#059669' },
            { label: 'Collection Rate',  value: `${s.collection_rate  || 0}%`,                   color: '#4F46E5' },
            { label: 'Pending Dues',     value: s.pending_dues   ?? 0,                            color: '#D97706', suffix: ' requests' },
            { label: 'Open Complaints',  value: s.open_complaints ?? 0,                           color: '#DC2626', suffix: ' open' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 10,
              padding: '14px 18px', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>
                {item.value}{item.suffix || ''}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
