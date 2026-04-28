'use client';
import { useState } from 'react';
import { Download, Plus, X, CheckCircle } from 'lucide-react';
import { maintenanceRecords as initialRecords } from '../../lib/data';

export default function Maintenance() {
  const [records, setRecords] = useState(initialRecords);
  const [month, setMonth] = useState('April 2025');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ flat: '', name: '', month: 'April 2025', amount: 2500 });

  const statusColor = s => s === 'Paid' ? 'var(--accent)' : s === 'Overdue' ? 'var(--red)' : 'var(--gold)';
  const statusBadge = s => s === 'Paid' ? 'badge-green' : s === 'Overdue' ? 'badge-red' : 'badge-gold';

  const markPaid = (id) => {
    setRecords(records.map(r => r.id === id
      ? { ...r, status: 'Paid', paidOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), txnId: `TXN${String(id).padStart(3,'0')}` }
      : r
    ));
  };

  const paid    = records.filter(r => r.status === 'Paid').length;
  const pending = records.filter(r => r.status === 'Pending').length;
  const overdue = records.filter(r => r.status === 'Overdue').length;
  const collectedAmt = records.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0);
  const pendingAmt   = records.filter(r => r.status !== 'Paid').reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ maxWidth: 200 }}>
          {['April 2025', 'March 2025', 'February 2025', 'January 2025'].map(m => <option key={m}>{m}</option>)}
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}><Plus size={14} /> Add Record</button>
        <button className="btn btn-gold btn-sm"><Download size={14} /> Export CSV</button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>➕ Add Maintenance Record</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div className="form-grid-4">
            <div className="form-row">
              <label className="field-label">Flat No.</label>
              <input placeholder="A-101" value={form.flat} onChange={e => setForm({ ...form, flat: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Tenant Name</label>
              <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="field-label">Month</label>
              <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })}>
                {['April 2025', 'March 2025', 'February 2025'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="field-label">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => {
            setRecords([...records, { ...form, id: Date.now(), paidOn: '-', status: 'Pending', txnId: '-' }]);
            setForm({ flat: '', name: '', month: 'April 2025', amount: 2500 });
            setShowForm(false);
          }}>Save Record</button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Collected',     value: `₹${collectedAmt.toLocaleString()}`, count: `${paid} flats paid`,           color: 'var(--accent)',  icon: '✅' },
          { label: 'Pending',       value: `₹${pending * 2500}`,                count: `${pending} flats pending`,      color: 'var(--gold)',    icon: '⏳' },
          { label: 'Overdue',       value: `₹${overdue * 2500}`,                count: `${overdue} flats overdue`,      color: 'var(--red)',     icon: '🔴' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="icon-box" style={{ background: `${s.color}20`, fontSize: 20 }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Records table */}
      <div className="card">
        <div className="card-title">
          <span>🔧 Records – {month}</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>₹2,500 / flat / month</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{['Flat', 'Tenant Name', 'Month', 'Amount', 'Paid On', 'Status', 'Txn ID', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td><span className="badge badge-blue" style={{ fontWeight: 700 }}>{r.flat}</span></td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{r.month}</td>
                  <td style={{ fontWeight: 700 }}>₹{r.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{r.paidOn}</td>
                  <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'monospace' }}>{r.txnId}</td>
                  <td>
                    {r.status !== 'Paid'
                      ? <button className="btn btn-primary btn-sm" onClick={() => markPaid(r.id)}><CheckCircle size={13} /> Mark Paid</button>
                      : <button className="btn btn-outline btn-sm">Receipt</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 32, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 13 }}>
          <span>Total collected: <strong style={{ color: 'var(--accent)' }}>₹{collectedAmt.toLocaleString()}</strong></span>
          <span>Balance pending: <strong style={{ color: 'var(--red)' }}>₹{pendingAmt.toLocaleString()}</strong></span>
        </div>
      </div>
    </div>
  );
}
