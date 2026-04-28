'use client';
import { useState } from 'react';
import { Plus, X, Pin, Trash2 } from 'lucide-react';
import { announcements as initialAnnouncements } from '../../lib/data';

export default function Announcements() {
  const [items, setItems] = useState(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', body: '', type: 'info', by: 'Society Admin' });

  const typeColor  = t => t === 'urgent' ? 'var(--red)' : t === 'event' ? 'var(--gold)' : 'var(--accent2)';
  const typeBanner = t => t === 'urgent' ? 'announce-urgent' : t === 'event' ? 'announce-event' : 'announce-info';
  const typeEmoji  = t => t === 'urgent' ? '⚠️' : t === 'event' ? '📅' : 'ℹ️';

  const post = () => {
    if (!form.title || !form.body) return;
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    setItems([{ ...form, id: Date.now(), date: today, pinned: false }, ...items]);
    setForm({ title: '', body: '', type: 'info', by: 'Society Admin' });
    setShowForm(false);
  };

  const remove = id => setItems(items.filter(a => a.id !== id));
  const togglePin = id => setItems(items.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));

  const filtered = items.filter(a => filter === 'All' || a.type === filter.toLowerCase() || (filter === 'Pinned' && a.pinned));
  const sorted   = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {['All', 'Urgent', 'Event', 'Info', 'Pinned'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)} style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> New Announcement
        </button>
      </div>

      {/* Post form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>📢 Post New Announcement</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div className="form-grid-3" style={{ marginBottom: 14 }}>
            <div className="form-row col-span-2">
              <label className="field-label">Title</label>
              <input placeholder="Announcement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="info">ℹ️ Information</option>
                <option value="urgent">⚠️ Urgent</option>
                <option value="event">📅 Event</option>
              </select>
            </div>
            <div className="form-row col-span-2">
              <label className="field-label">Message</label>
              <textarea placeholder="Write the announcement message..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ minHeight: 90 }} />
            </div>
            <div className="form-row">
              <label className="field-label">Posted By</label>
              <input placeholder="Society Admin" value={form.by} onChange={e => setForm({ ...form, by: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={post}>📢 Post Announcement</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'Total',  count: items.length,                          color: 'var(--accent2)' },
          { label: 'Urgent', count: items.filter(a => a.type === 'urgent').length, color: 'var(--red)' },
          { label: 'Pinned', count: items.filter(a => a.pinned).length,    color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex: 1, padding: '14px 18px' }}>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.count}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Announcement list */}
      {sorted.map(a => (
        <div key={a.id} className={`announce-banner ${typeBanner(a.type)}`} style={{ position: 'relative' }}>
          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{typeEmoji(a.type)}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--white)' }}>{a.title}</span>
                {a.pinned && <Pin size={13} style={{ color: 'var(--gold)' }} />}
              </div>
              <span className="badge" style={{ background: `${typeColor(a.type)}20`, color: typeColor(a.type), flexShrink: 0 }}>
                {a.type.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text)', marginTop: 6, lineHeight: 1.6 }}>{a.body}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, display: 'flex', gap: 16, alignItems: 'center' }}>
              <span>📅 {a.date}</span>
              <span>👤 {a.by}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={() => togglePin(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: a.pinned ? 'var(--gold)' : 'var(--muted)' }}>
                  <Pin size={14} />
                </button>
                <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {sorted.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>No announcements found.</div>
      )}
    </div>
  );
}
