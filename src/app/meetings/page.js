'use client';
import { useState } from 'react';
import { Plus, X, MapPin, Clock, Users, Bell } from 'lucide-react';
import { meetings as initialMeetings } from '../../lib/data';

export default function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', date: '', time: '', venue: '', agenda: '' });

  const save = () => {
    if (!form.title || !form.date) return;
    setMeetings([{ ...form, id: Date.now(), status: 'Upcoming', attendees: 0 }, ...meetings]);
    setForm({ title: '', date: '', time: '', venue: '', agenda: '' });
    setShowForm(false);
  };

  const filtered = meetings.filter(m => filter === 'All' || m.status === filter);

  return (
    <div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        {['All', 'Upcoming', 'Completed'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)} style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> Schedule Meeting
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>📅 Schedule New Meeting</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div className="form-grid-3" style={{ marginBottom: 14 }}>
            <div className="form-row col-span-3">
              <label className="field-label">Meeting Title</label>
              <input placeholder="e.g. Annual General Meeting 2025" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Time</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Venue</label>
              <input placeholder="Community Hall" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
            </div>
            <div className="form-row col-span-3">
              <label className="field-label">Agenda</label>
              <textarea placeholder="Meeting agenda and discussion points..." value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={save}>📅 Save Meeting</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Upcoming',   count: meetings.filter(m => m.status === 'Upcoming').length,   color: 'var(--accent)' },
          { label: 'Completed',  count: meetings.filter(m => m.status === 'Completed').length,  color: 'var(--muted)' },
          { label: 'Total',      count: meetings.length,                                          color: 'var(--accent2)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex: 1, padding: '14px 18px' }}>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.count}</div>
            <div className="stat-label">{s.label} Meetings</div>
          </div>
        ))}
      </div>

      {/* Meeting cards */}
      <div className="grid-2">
        {filtered.map(m => (
          <div key={m.id} className={`meeting-card ${m.status === 'Completed' ? 'done' : ''}`} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--white)', lineHeight: 1.3 }}>{m.title}</div>
              <span className={`badge ${m.status === 'Upcoming' ? 'badge-green' : 'badge-gray'}`}>{m.status}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                📅 {m.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                <Clock size={13} /> {m.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                <MapPin size={13} /> {m.venue}
              </span>
              {m.attendees > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                  <Users size={13} /> {m.attendees} attended
                </span>
              )}
            </div>

            <div style={{ background: '#F1F5F9', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 14 }}>
              <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agenda: </span>
              {m.agenda}
            </div>

            {m.status === 'Upcoming' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm">
                  <Bell size={13} /> Send Reminder
                </button>
                <button className="btn btn-outline btn-sm">Edit</button>
                <button className="btn btn-sm" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold)', border: 'none' }}
                  onClick={() => setMeetings(meetings.map(x => x.id === m.id ? { ...x, status: 'Completed', attendees: 32 } : x))}>
                  Mark Complete
                </button>
              </div>
            )}

            {m.status === 'Completed' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm">View Minutes</button>
                <button className="btn btn-sm" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent2)', border: 'none' }}>Download PDF</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>No meetings in this category.</div>
      )}
    </div>
  );
}
