'use client';
import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle, AlertCircle, Clock, Download, X } from 'lucide-react';
import { payments as initialPayments } from '../../lib/data';

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState('All');
  const [showUPI, setShowUPI] = useState(null);

  const statusColor  = s => s === 'Success' ? 'var(--accent)' : s === 'Overdue' ? 'var(--red)' : 'var(--gold)';
  const statusBadge  = s => s === 'Success' ? 'badge-green' : s === 'Overdue' ? 'badge-red' : 'badge-gold';
  const modeIcon = m => m === 'UPI' ? <Smartphone size={14} /> : m === 'Cash' ? <Banknote size={14} /> : <CreditCard size={14} />;

  const filtered = payments.filter(p => filter === 'All' || p.status === filter);
  const collected = payments.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);
  const pending   = payments.filter(p => p.status !== 'Success').reduce((s, p) => s + p.amount, 0);

  const handlePayNow = (id) => {
    setPayments(payments.map(p => p.id === id
      ? { ...p, status: 'Success', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), mode: 'UPI', txnId: `PAY${String(id).padStart(3,'0')}` }
      : p
    ));
    setShowUPI(null);
  };

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {['All', 'Success', 'Pending', 'Overdue'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button className="btn btn-gold btn-sm" style={{ marginLeft: 'auto' }}><Download size={14} /> Export Statement</button>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Collected',  value: `₹${collected.toLocaleString()}`,  badge: `${payments.filter(p=>p.status==='Success').length} payments`,   color: 'var(--accent)',  icon: '✅' },
          { label: 'Pending Amount',   value: `₹${pending.toLocaleString()}`,     badge: `${payments.filter(p=>p.status!=='Success').length} flats`,        color: 'var(--gold)',    icon: '⏳' },
          { label: 'UPI Transactions', value: `${payments.filter(p=>p.mode==='UPI').length}`,  badge: 'via Razorpay',             color: 'var(--accent2)', icon: '📱' },
          { label: 'Cash Payments',    value: `${payments.filter(p=>p.mode==='Cash').length}`, badge: 'manually recorded',        color: 'var(--muted)',   icon: '💵' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-badge" style={{ background: `${s.color}20`, color: s.color }}>{s.badge}</div>
          </div>
        ))}
      </div>

      {/* UPI/Razorpay info banner */}
      <div className="announce-banner announce-info" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 22 }}>💳</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>Razorpay + UPI Integration Ready</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Connect your Razorpay account to enable online UPI, card, and net banking payments. Tenants can pay directly from the mobile app.
            <span style={{ color: 'var(--accent2)', fontWeight: 600, marginLeft: 8, cursor: 'pointer' }}>Configure now →</span>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="card">
        <div className="card-title">
          <span>💰 Payment History</span>
          <span className="tag">April 2025</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{['Flat', 'Tenant', 'Amount', 'Date', 'Mode', 'Status', 'Txn ID', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="badge badge-blue" style={{ fontWeight: 700 }}>{p.flat}</span></td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ fontWeight: 700, color: 'var(--white)' }}>₹{p.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{p.date}</td>
                  <td>
                    {p.mode !== '-' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
                        {modeIcon(p.mode)} {p.mode}
                      </span>
                    )}
                  </td>
                  <td><span className={`badge ${statusBadge(p.status)}`}>{p.status}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'monospace' }}>{p.txnId}</td>
                  <td>
                    {p.status === 'Success' && (
                      <button className="btn btn-outline btn-sm">Receipt</button>
                    )}
                    {p.status !== 'Success' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowUPI(p)}>
                          <Smartphone size={13} /> Pay via UPI
                        </button>
                        <button className="btn btn-sm" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold)', border: 'none' }}
                          onClick={() => setPayments(payments.map(x => x.id === p.id ? { ...x, status: 'Success', date: 'Today', mode: 'Cash', txnId: `CASH${p.id}` } : x))}>
                          Cash
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 32, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 13 }}>
          <span>Collected: <strong style={{ color: 'var(--accent)' }}>₹{collected.toLocaleString()}</strong></span>
          <span>Pending: <strong style={{ color: 'var(--red)' }}>₹{pending.toLocaleString()}</strong></span>
          <span>Total: <strong style={{ color: 'var(--white)' }}>₹{(collected + pending).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* UPI payment modal */}
      {showUPI && (
        <div className="modal-overlay" onClick={() => setShowUPI(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--white)' }}>UPI Payment</div>
              <button onClick={() => setShowUPI(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {/* Fake QR */}
              <div style={{ width: 160, height: 160, margin: '0 auto 16px', background: 'var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                📱
              </div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>Scan & Pay via UPI</div>
              <div style={{ fontWeight: 800, fontSize: 24, color: 'var(--accent)', marginBottom: 8 }}>₹{showUPI.amount.toLocaleString()}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {showUPI.name} · Flat {showUPI.flat} · April 2025 Maintenance
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>UPI: secretary@sunrise.upi</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '16px 0' }}>
              {['GPay', 'PhonePe', 'Paytm'].map(app => (
                <button key={app} className="btn" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent2)', border: 'none', justifyContent: 'center', fontSize: 12, padding: '8px 0' }}>
                  {app === 'GPay' ? '💳' : app === 'PhonePe' ? '📲' : '💰'} {app}
                </button>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={() => handlePayNow(showUPI.id)}>
              <CheckCircle size={15} /> Confirm Payment Received
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
