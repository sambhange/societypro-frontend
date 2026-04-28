'use client';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { announcements, maintenanceRecords, meetings, monthlyCollection, SOCIETY } from '../../lib/data';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 12 }}>
      <p style={{ color: 'var(--muted)' }}>{label}</p>
      <p style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

export default function Dashboard() {
  const paid    = maintenanceRecords.filter(r => r.status === 'Paid').length;
  const pending = maintenanceRecords.filter(r => r.status === 'Pending').length;
  const overdue = maintenanceRecords.filter(r => r.status === 'Overdue').length;

  const stats = [
    { label: 'Total Flats',         value: SOCIETY.totalFlats, badge: `${SOCIETY.wings.length} Wings`,    color: 'var(--accent)',  icon: '🏢' },
    { label: 'Active Tenants',      value: 44,                 badge: '91.6% occupancy',                  color: 'var(--accent2)', icon: '👥' },
    { label: 'Pending Dues',        value: '₹18,200',          badge: `${pending + overdue} flats`,        color: 'var(--red)',     icon: '💰' },
    { label: 'Monthly Collection',  value: '₹92,500',          badge: '↑ 4% vs last month',               color: 'var(--gold)',    icon: '📈' },
  ];

  const typeColor = t => t === 'urgent' ? 'var(--red)' : t === 'event' ? 'var(--gold)' : 'var(--accent2)';
  const typeEmoji = t => t === 'urgent' ? '⚠️' : t === 'event' ? '📅' : 'ℹ️';

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-badge" style={{ background: `${s.color}20`, color: s.color }}>{s.badge}</div>
          </div>
        ))}
      </div>

      {/* Chart + Announcements */}
      <div className="grid-2">
        {/* Monthly collection chart */}
        <div className="card">
          <div className="card-title">
            <span>📊 Monthly Collection</span>
            <span className="tag">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyCollection} barSize={28}>
              <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="collected" radius={[6, 6, 0, 0]}>
                {monthlyCollection.map((_, i) => (
                  <Cell key={i} fill={i === monthlyCollection.length - 1 ? 'var(--accent)' : 'var(--border)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live announcements */}
        <div className="card">
          <div className="card-title">
            <span>📢 Live Announcements</span>
            <Link href="/announcements"><span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>View all →</span></Link>
          </div>
          {announcements.slice(0, 3).map(a => (
            <div key={a.id} className={`announce-banner announce-${a.type === 'urgent' ? 'urgent' : a.type === 'event' ? 'event' : 'info'}`}>
              <span style={{ fontSize: 18 }}>{typeEmoji(a.type)}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--white)' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{a.body.slice(0, 65)}...</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{a.date} · {a.by}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance + Meetings */}
      <div className="grid-2">
        {/* Maintenance summary */}
        <div className="card">
          <div className="card-title">
            <span>🔧 Maintenance – April 2025</span>
            <Link href="/maintenance"><span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>View all →</span></Link>
          </div>
          {[
            { label: 'Paid',    count: paid,    color: 'var(--accent)', emoji: '✅' },
            { label: 'Pending', count: pending, color: 'var(--gold)',   emoji: '⏳' },
            { label: 'Overdue', count: overdue, color: 'var(--red)',    emoji: '🔴' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(30,45,69,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{s.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{s.label} Flats</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
            </div>
          ))}
          <div style={{ marginTop: 14, textAlign: 'right' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total collected this month: </span>
            <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: 15 }}>₹{paid * 2500}/-</span>
          </div>
        </div>

        {/* Upcoming meetings */}
        <div className="card">
          <div className="card-title">
            <span>📅 Upcoming Meetings</span>
            <Link href="/meetings"><span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>View all →</span></Link>
          </div>
          {meetings.filter(m => m.status === 'Upcoming').map(m => (
            <div key={m.id} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(30,45,69,0.4)' }}>
              <div style={{ minWidth: 48, height: 48, background: 'rgba(0,198,167,0.12)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 800 }}>{m.date.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{m.date.split(' ')[1]}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--white)' }}>{m.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{m.time} · {m.venue}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{m.agenda.slice(0, 55)}...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
