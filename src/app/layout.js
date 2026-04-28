'use client';
import '../styles/globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Wrench, Megaphone,
  CalendarDays, ImageIcon, CreditCard, Settings, Bell,
  Building2, ConciergeBell, Ticket, ParkingSquare, ShieldCheck, UserCog, BarChart3, MessagesSquare, FolderOpen, CalendarCheck, BellRing
} from 'lucide-react';
import { SOCIETY } from '../lib/data';

const NAV = [
  { href: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard, group: 'main' },
  { href: '/tenants',       label: 'Tenants',         icon: Users,           group: 'main' },
  { href: '/maintenance',   label: 'Maintenance',     icon: Wrench,          group: 'main' },
  { href: '/announcements', label: 'Announcements',   icon: Megaphone,       group: 'main' },
  { href: '/meetings',      label: 'Meetings',        icon: CalendarDays,    group: 'main' },
  { href: '/gallery',       label: 'Gallery',         icon: ImageIcon,       group: 'main' },
  { href: '/payments',      label: 'Payments',        icon: CreditCard,      group: 'main' },
  { href: '/complaints',    label: 'Complaint Box',   icon: Ticket,          group: 'main' },
  { href: '/parking',       label: 'Parking',         icon: ParkingSquare,   group: 'main' },
  { href: '/visitors',      label: 'Visitor Log',     icon: ShieldCheck,     group: 'main' },
  { href: '/committee',     label: 'Committee',       icon: UserCog,         group: 'main' },
  { href: '/polls',         label: 'Polls & Voting',  icon: BarChart3,       group: 'main' },
  { href: '/forum',         label: 'Discussion Forum',icon: MessagesSquare,  group: 'main' },
  { href: '/files',         label: 'File Repository', icon: FolderOpen,      group: 'main' },
  { href: '/facilities',    label: 'Facility Booking',icon: CalendarCheck,   group: 'main' },
  { href: '/notifications', label: 'SMS Alerts',      icon: BellRing,        group: 'main' },
  { href: '/properties',    label: 'Properties',      icon: Building2,       group: 'marketplace' },
  { href: '/services',      label: 'Home Services',   icon: ConciergeBell,   group: 'marketplace' },
];

function Sidebar({ pathname }) {
  const isLogin = pathname === '/' || pathname === '/login';
  if (isLogin) return null;

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-name">🏢 {SOCIETY.name}</div>
        <div className="logo-sub">Society Management</div>
      </div>

      <nav className="nav-group">
        <div className="nav-label">Society</div>
        {NAV.filter(n => n.group === 'main').map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className={`nav-item ${pathname === href ? 'active' : ''}`}>
              <Icon size={17} />
              {label}
            </div>
          </Link>
        ))}
        <div className="nav-label" style={{ marginTop: 8 }}>Marketplace</div>
        {NAV.filter(n => n.group === 'marketplace').map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className={`nav-item ${pathname === href ? 'active' : ''}`}>
              <Icon size={17} />
              {label}
            </div>
          </Link>
        ))}
      </nav>

      <div style={{ padding: '0 10px', marginBottom: 8 }}>
        <Link href="/settings">
          <div className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
            <Settings size={17} />
            Settings
          </div>
        </Link>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">{SOCIETY.secretary}</div>
        <div className="sidebar-role">Society Secretary</div>
      </div>
    </aside>
  );
}

function TopBar({ pathname }) {
  const isLogin = pathname === '/' || pathname === '/login';
  if (isLogin) return null;

  const labels = {
    '/dashboard':     { title: 'Dashboard',      sub: `Overview · ${SOCIETY.name}` },
    '/tenants':       { title: 'Tenants',         sub: 'Manage all flat owners and tenants' },
    '/maintenance':   { title: 'Maintenance',     sub: 'Monthly maintenance payment records' },
    '/announcements': { title: 'Announcements',   sub: 'Post and manage society notices' },
    '/meetings':      { title: 'Meetings',        sub: 'Schedule and track society meetings' },
    '/gallery':       { title: 'Photo Gallery',   sub: 'Society events and function photos' },
    '/payments':      { title: 'Payments',        sub: 'UPI & payment collection history' },
    '/complaints':    { title: 'Complaint Box',   sub: 'Raise and manage resident complaints' },
    '/notifications': { title: 'SMS Alerts',         sub: 'Send SMS and WhatsApp alerts to all residents' },
    '/facilities':    { title: 'Facility Booking',   sub: 'Book community hall, gym, pool and more' },
    '/files':         { title: 'File Repository',    sub: 'Society documents, forms, circulars and media' },
    '/forum':         { title: 'Discussion Forum',  sub: 'Community discussions, suggestions and help' },
    '/polls':         { title: 'Polls & Voting',    sub: 'Create polls and collect resident votes' },
    '/committee':     { title: 'Committee Members', sub: 'Society committee — roles, contacts and tenure' },
    '/visitors':      { title: 'Visitor Management', sub: 'Gate keeper log — track all visitors' },
    '/parking':       { title: 'Parking Manager',  sub: 'Vehicle registration and slot management' },
    '/properties':    { title: 'Properties',       sub: 'Flats for sale and rent in the society' },
    '/services':      { title: 'Home Services',    sub: 'Book painting, plumbing, beauty and more' },
  };
  const info = labels[pathname] || { title: 'Society App', sub: '' };

  return (
    <div className="topbar">
      <div>
        <div className="page-title">{info.title}</div>
        <div className="page-sub">{info.sub}</div>
      </div>
      <div className="topbar-actions">
        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--muted)' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 8, height: 8, background: 'var(--red)',
            borderRadius: '50%', display: 'block'
          }} />
        </div>
        <div className="avatar">A</div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/' || pathname === '/login';

  return (
    <html lang="en">
      <head>
        <title>Society Management – {SOCIETY.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <div className="layout">
          <Sidebar pathname={pathname} />
          <main className={isLogin ? '' : 'main-content'} style={isLogin ? {} : {}}>
            {!isLogin && <TopBar pathname={pathname} />}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
