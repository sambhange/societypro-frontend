'use client';
import '../styles/globals.css';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Wrench, Megaphone,
  CalendarCheck, Image, CreditCard, Ticket,
  ParkingSquare, ShieldCheck, UserCog, BarChart3,
  MessagesSquare, FolderOpen, Building2, ConciergeBell,
  BellRing, LogOut, Settings, IndianRupee
} from 'lucide-react';

const NAV = [
  { href:'/accounting',    label:'Accounting',        icon:IndianRupee,    group:'main'        },
  { href:'/dashboard',     label:'Dashboard',          icon:LayoutDashboard,group:'main'        },
  { href:'/tenants',       label:'Tenants',            icon:Users,          group:'main'        },
  { href:'/maintenance',   label:'Maintenance',        icon:Wrench,         group:'main'        },
  { href:'/payments',      label:'Payments',           icon:CreditCard,     group:'main'        },
  { href:'/announcements', label:'Announcements',      icon:Megaphone,      group:'main'        },
  { href:'/meetings',      label:'Meetings',           icon:CalendarCheck,  group:'main'        },
  { href:'/gallery',       label:'Gallery',            icon:Image,          group:'main'        },
  { href:'/complaints',    label:'Complaint Box',      icon:Ticket,         group:'main'        },
  { href:'/parking',       label:'Parking',            icon:ParkingSquare,  group:'main'        },
  { href:'/visitors',      label:'Visitor Log',        icon:ShieldCheck,    group:'main'        },
  { href:'/committee',     label:'Committee',          icon:UserCog,        group:'main'        },
  { href:'/polls',         label:'Polls & Voting',     icon:BarChart3,      group:'main'        },
  { href:'/forum',         label:'Discussion Forum',   icon:MessagesSquare, group:'main'        },
  { href:'/files',         label:'File Repository',    icon:FolderOpen,     group:'main'        },
  { href:'/facilities',    label:'Facility Booking',   icon:Building2,      group:'main'        },
  { href:'/notifications', label:'SMS Alerts',         icon:BellRing,       group:'main'        },
  { href:'/properties',    label:'Properties',         icon:Building2,      group:'marketplace' },
  { href:'/services',      label:'Home Services',      icon:ConciergeBell,  group:'marketplace' },
];

const PAGE_INFO = {
  '/accounting':    { title:'Accounting',          sub:'Income, expenses, GST invoices and balance sheet'  },
  '/dashboard':     { title:'Dashboard',            sub:'Overview of your society'                          },
  '/tenants':       { title:'Tenant Management',    sub:'Manage all residents and flat owners'              },
  '/maintenance':   { title:'Maintenance',          sub:'Track and manage maintenance billing'              },
  '/payments':      { title:'Payments',             sub:'Payment records and Razorpay integration'          },
  '/announcements': { title:'Announcements',        sub:'Post notices and alerts to residents'              },
  '/meetings':      { title:'Meetings',             sub:'Schedule and manage society meetings'              },
  '/gallery':       { title:'Photo Gallery',        sub:'Society events and photo albums'                   },
  '/complaints':    { title:'Complaint Box',        sub:'Resident complaints and ticket tracking'           },
  '/parking':       { title:'Parking Manager',      sub:'Slot allocation and vehicle registration'          },
  '/visitors':      { title:'Visitor Management',   sub:'Gate entry log and visitor tracking'               },
  '/committee':     { title:'Committee Members',    sub:'Society committee roles and contacts'              },
  '/polls':         { title:'Polls & Voting',       sub:'Create polls and collect resident votes'           },
  '/forum':         { title:'Discussion Forum',     sub:'Community discussions and suggestions'             },
  '/files':         { title:'File Repository',      sub:'Society documents, forms and circulars'            },
  '/facilities':    { title:'Facility Booking',     sub:'Book community hall, gym, pool and more'           },
  '/notifications': { title:'SMS Alerts',           sub:'Send SMS and WhatsApp alerts to residents'         },
  '/properties':    { title:'Properties',           sub:'Buy and rent listings in your society'             },
  '/services':      { title:'Home Services',        sub:'Book home services for residents'                  },
  '/settings':      { title:'Settings',             sub:'Society profile, account and billing'              },
};

// ── Pages that show NO sidebar (full-page layouts) ───────────────────────────
const NO_LAYOUT_PAGES = [
  '/',
  '/login',
  '/register',
  '/pricing',
  '/superadmin',
  '/onboarding',
  '/resident-login',
  '/resident',
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();

  // Check if current page should have NO sidebar
  const noLayout = NO_LAYOUT_PAGES.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  );

  if (noLayout) {
    return (
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        </head>
        <body>{children}</body>
      </html>
    );
  }

  const pageInfo = PAGE_INFO[pathname] || { title:'SocietyPro', sub:'' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('society');
    localStorage.removeItem('user');
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <div className="layout">

          {/* ── Sidebar ── */}
          <aside className="sidebar">
            {/* Logo */}
            <div className="logo">
              <div className="logo-name">🏢 SocietyPro</div>
              <div className="logo-sub">Society Management</div>
            </div>

            {/* Navigation */}
            <nav className="nav-group">
              <div className="nav-label">Main Menu</div>
              {NAV.filter(n => n.group === 'main').map(item => {
                const Icon   = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`nav-item ${active ? 'active' : ''}`}>
                      <Icon size={16}/>
                      {item.label}
                    </div>
                  </Link>
                );
              })}

              <div className="nav-label" style={{ marginTop:12 }}>Marketplace</div>
              {NAV.filter(n => n.group === 'marketplace').map(item => {
                const Icon   = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`nav-item ${active ? 'active' : ''}`}>
                      <Icon size={16}/>
                      {item.label}
                    </div>
                  </Link>
                );
              })}

              <div className="nav-label" style={{ marginTop:12 }}>Account</div>
              <Link href="/settings">
                <div className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
                  <Settings size={16}/>
                  Settings
                </div>
              </Link>
            </nav>

            {/* Footer with logout */}
            <div className="sidebar-footer">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="sidebar-user">Admin</div>
                  <div className="sidebar-role">Society Secretary</div>
                </div>
                <button onClick={handleLogout} title="Logout"
                  style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.15)',
                    borderRadius:8, cursor:'pointer', color:'#DC2626', padding:'7px 10px',
                    display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700,
                    flexShrink:0, transition:'all 0.15s', fontFamily:'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(220,38,38,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(220,38,38,0.08)'}>
                  <LogOut size={14}/> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="main-content">
            {/* Topbar */}
            <div className="topbar">
              <div>
                <div className="page-title">{pageInfo.title}</div>
                {pageInfo.sub && <div className="page-sub">{pageInfo.sub}</div>}
              </div>
              <div className="topbar-actions">
                <div className="avatar" title="Settings" onClick={() => router.push('/settings')}>
                  AD
                </div>
              </div>
            </div>
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
