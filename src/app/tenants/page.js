'use client';
import { useState } from 'react';
import { Search, Plus, X, Phone, Mail, Users, Home } from 'lucide-react';
import { tenants as initialTenants } from '../../lib/data';

export default function Tenants() {
  const [tenants, setTenants] = useState(initialTenants);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ flat: '', name: '', phone: '', email: '', members: '', status: 'Active' });

  const filtered = tenants.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.flat.toLowerCase().includes(q) || t.phone.includes(q);
    const matchFilter = filter === 'All' || t.status === filter || (filter === 'Dues' && t.dues > 0);
    return matchSearch && matchFilter;
  });

  const addTenant = () => {
    if (!form.flat || !form.name) return;
    setTenants([...tenants, { ...form, id: Date.now(), dues: 0, joinDate: 'Apr 2025', members: Number(form.members) || 1 }]);
    setForm({ flat: '', name: '', phone: '', email: '', members: '', status: 'Active' });
    setShowForm(false);
  };

  return (
    <div>
      {/* Actions bar */}
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input placeholder="Search tenant, flat or phone..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        {['All', 'Active', 'Inactive', 'Dues'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)} style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> Add Tenant
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>➕ Add New Tenant</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div className="form-grid-4">
            <div className="form-row">
              <label className="field-label">Flat Number</label>
              <input placeholder="A-101" value={form.flat} onChange={e => setForm({ ...form, flat: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Full Name</label>
              <input placeholder="Ramesh Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Phone</label>
              <input placeholder="9820012345" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Members</label>
              <input type="number" placeholder="4" value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} />
            </div>
            <div className="form-row col-span-2">
              <label className="field-label">Email</label>
              <input type="email" placeholder="name@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={addTenant} style={{ marginTop: 4 }}>Save Tenant</button>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'Total',    count: tenants.length,                           color: 'var(--accent2)' },
          { label: 'Active',   count: tenants.filter(t => t.status === 'Active').length, color: 'var(--accent)' },
          { label: 'With Dues',count: tenants.filter(t => t.dues > 0).length,   color: 'var(--red)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex: 1, padding: '14px 18px' }}>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.count}</div>
            <div className="stat-label">{s.label} Tenants</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-title">
          <span>👥 All Tenants ({filtered.length})</span>
          <span className="tag">₹2,500 / month per flat</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Flat No.', 'Tenant Name', 'Phone', 'Email', 'Members', 'Status', 'Dues', 'Join Date', 'Action'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><span className="badge badge-blue" style={{ fontWeight: 700 }}>{t.flat}</span></td>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{t.phone}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{t.email}</td>
                  <td><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} style={{ color: 'var(--muted)' }} />{t.members}</span></td>
                  <td><span className={`badge ${t.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{t.status}</span></td>
                  <td>
                    {t.dues > 0
                      ? <span style={{ color: 'var(--red)', fontWeight: 700 }}>₹{t.dues.toLocaleString()}</span>
                      : <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Clear</span>}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{t.joinDate}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(t)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>No tenants found.</div>
          )}
        </div>
      </div>

      {/* Tenant detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--white)' }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Flat {selected.flat} · Joined {selected.joinDate}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[
                { icon: <Home size={15} />,  label: 'Flat',     value: selected.flat },
                { icon: <Users size={15} />, label: 'Members',  value: selected.members },
                { icon: <Phone size={15} />, label: 'Phone',    value: selected.phone },
                { icon: <Mail size={15} />,  label: 'Email',    value: selected.email },
              ].map(f => (
                <div key={f.label} style={{ background: '#F1F5F9', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>{f.icon} {f.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: selected.dues > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(0,198,167,0.1)', borderRadius: 10 }}>
              <span style={{ fontWeight: 600, color: selected.dues > 0 ? 'var(--red)' : 'var(--accent)' }}>Outstanding Dues</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: selected.dues > 0 ? 'var(--red)' : 'var(--accent)' }}>
                {selected.dues > 0 ? `₹${selected.dues.toLocaleString()}` : 'Clear ✓'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Send Message</button>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>View History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
