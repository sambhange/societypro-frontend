'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DemoPage() {
  const router = useRouter();
  const [copiedKey, setCopiedKey] = useState('');

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const CopyBtn = ({ text, label }) => (
    <button
      onClick={() => copy(text, label)}
      style={{
        background: copiedKey === label ? '#16A34A' : '#EFF6FF',
        color: copiedKey === label ? '#fff' : '#2563EB',
        border: 'none', borderRadius: 6, padding: '3px 10px',
        fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {copiedKey === label ? '✓ Copied' : 'Copy'}
    </button>
  );

  const CredRow = ({ label, value, copyKey }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid #F1F5F9',
    }}>
      <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{value}</span>
        <CopyBtn text={value} label={copyKey} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F0FDF4 100%)',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: 'white', borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#2563EB', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🏢</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>SocietyPro</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Live Demo</div>
          </div>
        </div>
        <button onClick={() => router.push('/register')} style={{
          background: '#2563EB', color: 'white', border: 'none', borderRadius: 8,
          padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          Register Your Society →
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(37,99,235,0.1)',
            color: '#2563EB', borderRadius: 20, padding: '4px 16px',
            fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.05em',
          }}>
            🎯 LIVE DEMO — USE REAL LOGIN CREDENTIALS BELOW
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: '0 0 12px', lineHeight: 1.2 }}>
            Try SocietyPro for Free
          </h1>
          <p style={{ fontSize: 16, color: '#64748B', margin: 0, maxWidth: 500, marginInline: 'auto' }}>
            Explore the full platform as a Society Admin or as a Resident. No registration needed for the demo.
          </p>
        </div>

        {/* Two demo cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>

          {/* Society Admin Demo */}
          <div style={{
            background: 'white', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              padding: '24px', color: 'white',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏛️</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Society Admin</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Manage your entire society from one dashboard</div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Demo Credentials — Sunrise Residency
              </div>

              <CredRow label="Email" value="admin@sunrise.in" copyKey="admin-email" />
              <CredRow label="Password" value="admin123" copyKey="admin-pass" />

              <div style={{ margin: '20px 0 16px', fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                WHAT YOU CAN DO:
              </div>
              {[
                '📊 View dashboard with live stats',
                '👥 Manage 48 residents & flats',
                '💰 Track maintenance payments',
                '📢 Post announcements & notices',
                '🔧 Handle complaints & requests',
                '🗳️ Run polls & community forums',
                '🅿️ Manage parking slots',
                '📁 Upload society documents',
              ].map(f => (
                <div key={f} style={{ fontSize: 13, color: '#374151', padding: '5px 0', display: 'flex', gap: 8 }}>
                  <span>{f}</span>
                </div>
              ))}

              <button
                onClick={() => router.push('/')}
                style={{
                  width: '100%', marginTop: 20, padding: '13px',
                  background: '#2563EB', color: 'white', border: 'none',
                  borderRadius: 10, fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                → Login as Admin
              </button>
            </div>
          </div>

          {/* Resident Demo */}
          <div style={{
            background: 'white', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #16A34A, #15803D)',
              padding: '24px', color: 'white',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏠</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Resident / Flat Owner</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>View your flat's details, pay dues, raise complaints</div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Demo Residents — Sunrise Residency
              </div>

              {[
                { name: 'Ramesh Sharma', flat: 'A-101', email: 'ramesh@email.com' },
                { name: 'Priya Mehta',   flat: 'A-102', email: 'priya@email.com'  },
                { name: 'Anjali Verma',  flat: 'B-201', email: 'anjali@email.com' },
              ].map((r, i) => (
                <div key={i} style={{
                  background: '#F8FAFC', borderRadius: 10, padding: '12px 14px',
                  marginBottom: 10, border: '1px solid #E2E8F0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Flat {r.flat}</div>
                    </div>
                    <span style={{
                      background: '#DCFCE7', color: '#16A34A', fontSize: 11,
                      fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    }}>Active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{r.email}</span>
                    <CopyBtn text={r.email} label={`res-${i}`} />
                  </div>
                </div>
              ))}

              <div style={{
                background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)',
                borderRadius: 10, padding: '10px 14px', marginTop: 4, marginBottom: 16,
              }}>
                <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 700, marginBottom: 2 }}>🔑 Password for all residents</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                    their flat number (e.g. A-101)
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>WHAT RESIDENTS CAN DO:</div>
              {[
                '📋 View maintenance dues & history',
                '🔧 Raise & track complaints',
                '📢 Read announcements',
                '🗳️ Vote in community polls',
                '💬 Post in community forum',
              ].map(f => (
                <div key={f} style={{ fontSize: 13, color: '#374151', padding: '4px 0' }}>{f}</div>
              ))}

              <button
                onClick={() => router.push('/resident-login')}
                style={{
                  width: '100%', marginTop: 20, padding: '13px',
                  background: '#16A34A', color: 'white', border: 'none',
                  borderRadius: 10, fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                → Login as Resident
              </button>
            </div>
          </div>
        </div>

        {/* Features strip */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '24px 32px',
          border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>Everything your society needs</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>One platform. All features. Starting ₹25/flat/month.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {[
              ['📊','Dashboard & Reports'],
              ['💰','Maintenance Billing'],
              ['🔧','Complaint Tracker'],
              ['📢','Announcements'],
              ['🏛️','Committee Mgmt'],
              ['🗳️','Polls & Voting'],
              ['🅿️','Parking Management'],
              ['👥','Visitor Log'],
              ['📁','Document Store'],
              ['💬','Community Forum'],
              ['🏋️','Facility Booking'],
              ['📱','Resident Portal'],
            ].map(([icon, label]) => (
              <div key={label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, padding: '14px 8px', background: '#F8FAFC',
                borderRadius: 10, border: '1px solid #E2E8F0', textAlign: 'center',
              }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => router.push('/register')} style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '14px 36px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            }}>
              🚀 Register Your Society — Free 30-Day Trial
            </button>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 10 }}>
              No credit card required · Setup in 2 minutes · Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
