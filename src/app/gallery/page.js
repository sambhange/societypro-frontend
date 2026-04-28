'use client';
import { useState } from 'react';
import { X, Plus, Upload, Image } from 'lucide-react';
import { galleryEvents as initialEvents } from '../../lib/data';

const TAG_COLORS = {
  Festival:    { bg: 'rgba(239,68,68,0.15)',    color: 'var(--red)' },
  Celebration: { bg: 'rgba(245,158,11,0.15)',   color: 'var(--gold)' },
  Sports:      { bg: 'rgba(59,130,246,0.15)',   color: 'var(--accent2)' },
  Kids:        { bg: 'rgba(0,198,167,0.15)',    color: 'var(--accent)' },
  Green:       { bg: 'rgba(0,198,167,0.15)',    color: 'var(--accent)' },
};

export default function Gallery() {
  const [events, setEvents] = useState(initialEvents);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ emoji: '🎉', title: '', date: '', tag: 'Celebration', description: '' });

  const tags = ['All', ...new Set(events.map(e => e.tag))];

  const filtered = events.filter(e => filter === 'All' || e.tag === filter);

  const addEvent = () => {
    if (!form.title) return;
    setEvents([{ ...form, id: Date.now(), photos: 0 }, ...events]);
    setForm({ emoji: '🎉', title: '', date: '', tag: 'Celebration', description: '' });
    setShowForm(false);
  };

  const tagStyle = tag => TAG_COLORS[tag] || { bg: 'rgba(100,116,139,0.15)', color: 'var(--muted)' };

  return (
    <div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-blue btn-sm" onClick={() => setShowForm(!showForm)}><Plus size={14} /> New Event</button>
          <button className="btn btn-primary btn-sm"><Upload size={14} /> Upload Photos</button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>🎉 Add New Event Album</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div className="form-grid-3" style={{ marginBottom: 14 }}>
            <div className="form-row">
              <label className="field-label">Emoji</label>
              <input placeholder="🎉" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
            </div>
            <div className="form-row col-span-2">
              <label className="field-label">Event Title</label>
              <input placeholder="Holi 2025" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Category</label>
              <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
                {['Festival', 'Celebration', 'Sports', 'Kids', 'Green', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row col-span-2">
              <label className="field-label">Description</label>
              <input placeholder="Short description of the event" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addEvent}>Create Album</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Events', count: events.length,                                  color: 'var(--accent2)' },
          { label: 'Total Photos', count: events.reduce((s, e) => s + e.photos, 0),       color: 'var(--accent)' },
          { label: 'This Year',    count: events.filter(e => e.date?.includes('2025')).length, color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex: 1, padding: '14px 18px' }}>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.count}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid-3">
        {filtered.map(e => {
          const ts = tagStyle(e.tag);
          return (
            <div key={e.id} className="photo-card" onClick={() => setSelected(e)}>
              <div className="photo-thumb">{e.emoji}</div>
              <div className="photo-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--white)' }}>{e.title}</div>
                  <span className="badge" style={{ background: ts.bg, color: ts.color }}>{e.tag}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{e.date}</div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                  <Image size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {e.photos} Photos
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{e.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>No events in this category.</div>
      )}

      {/* Album modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>{selected.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--white)' }}>{selected.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                {selected.date} · {selected.photos} photos · {selected.tag}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 6 }}>{selected.description}</div>
            </div>

            {/* Placeholder photo grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
              {Array(selected.photos > 0 ? Math.min(selected.photos, 9) : 6).fill(0).map((_, i) => (
                <div key={i} style={{
                  height: 90, background: '#E2E8F0', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, cursor: 'pointer'
                }}>
                  {['🎨','🎉','🏆','🪔','🧁','🌳','📸','🎊','🏅'][i % 9]}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Upload size={14} /> Upload Photos
              </button>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Share Album</button>
              <button className="btn btn-outline" onClick={() => setSelected(null)} style={{ justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
