// lib/data.js — shared mock data for all pages

export const SOCIETY = {
  name: "Sunrise Residency",
  address: "Andheri West, Mumbai – 400053",
  totalFlats: 48,
  wings: ["A", "B", "C", "D"],
  secretary: "Rajesh Kumar",
  email: "secretary@sunriseresidency.in",
  phone: "9820012345",
};

export const tenants = [
  { id: 1,  flat: "A-101", name: "Ramesh Sharma",   phone: "9823456710", email: "ramesh@email.com", members: 4, status: "Active",   dues: 0,    joinDate: "Jan 2021" },
  { id: 2,  flat: "A-102", name: "Priya Mehta",     phone: "9876543210", email: "priya@email.com",  members: 2, status: "Active",   dues: 2500, joinDate: "Mar 2020" },
  { id: 3,  flat: "B-201", name: "Anjali Verma",    phone: "9765432198", email: "anjali@email.com", members: 3, status: "Active",   dues: 0,    joinDate: "Jun 2019" },
  { id: 4,  flat: "B-202", name: "Suresh Patel",    phone: "9654321987", email: "suresh@email.com", members: 5, status: "Inactive", dues: 7500, joinDate: "Feb 2022" },
  { id: 5,  flat: "C-301", name: "Neha Singh",      phone: "9543219876", email: "neha@email.com",   members: 2, status: "Active",   dues: 0,    joinDate: "Aug 2021" },
  { id: 6,  flat: "C-302", name: "Vikram Joshi",    phone: "9432198765", email: "vikram@email.com", members: 3, status: "Active",   dues: 1200, joinDate: "Nov 2020" },
  { id: 7,  flat: "D-401", name: "Meena Iyer",      phone: "9321987654", email: "meena@email.com",  members: 4, status: "Active",   dues: 0,    joinDate: "Apr 2018" },
  { id: 8,  flat: "D-402", name: "Arjun Nair",      phone: "9210987643", email: "arjun@email.com",  members: 2, status: "Active",   dues: 0,    joinDate: "Sep 2023" },
];

export const maintenanceRecords = [
  { id: 1, flat: "A-101", name: "Ramesh Sharma",  month: "April 2025", amount: 2500, paidOn: "2 Apr", status: "Paid",    txnId: "TXN001" },
  { id: 2, flat: "A-102", name: "Priya Mehta",    month: "April 2025", amount: 2500, paidOn: "-",     status: "Pending", txnId: "-" },
  { id: 3, flat: "B-201", name: "Anjali Verma",   month: "April 2025", amount: 2500, paidOn: "1 Apr", status: "Paid",    txnId: "TXN003" },
  { id: 4, flat: "B-202", name: "Suresh Patel",   month: "April 2025", amount: 2500, paidOn: "-",     status: "Overdue", txnId: "-" },
  { id: 5, flat: "C-301", name: "Neha Singh",     month: "April 2025", amount: 2500, paidOn: "3 Apr", status: "Paid",    txnId: "TXN005" },
  { id: 6, flat: "C-302", name: "Vikram Joshi",   month: "April 2025", amount: 2500, paidOn: "-",     status: "Pending", txnId: "-" },
  { id: 7, flat: "D-401", name: "Meena Iyer",     month: "April 2025", amount: 2500, paidOn: "4 Apr", status: "Paid",    txnId: "TXN007" },
  { id: 8, flat: "D-402", name: "Arjun Nair",     month: "April 2025", amount: 2500, paidOn: "5 Apr", status: "Paid",    txnId: "TXN008" },
];

export const announcements = [
  { id: 1, title: "Water Supply Interruption",  body: "Water supply will be interrupted on 30th April from 9AM–1PM for tank cleaning. Please store water in advance.", type: "urgent", date: "28 Apr 2025", by: "Society Admin",  pinned: true  },
  { id: 2, title: "Annual General Meeting",      body: "AGM is scheduled for 5th May at 6:30 PM in the community hall. All flat owners are requested to attend mandatorily.", type: "event",  date: "25 Apr 2025", by: "Secretary",      pinned: true  },
  { id: 3, title: "Holi Celebration Photos",     body: "Photos from our Holi 2025 celebration have been uploaded in the Gallery section. Check them out!", type: "info",   date: "20 Mar 2025", by: "Events Team",    pinned: false },
  { id: 4, title: "Parking Allocation Update",   body: "New parking slot numbering is effective from 1st May. Please refer to the notice board for your assigned slot.", type: "info",   date: "18 Apr 2025", by: "Society Admin",  pinned: false },
  { id: 5, title: "Lift Maintenance Notice",     body: "Wing B lift will be under maintenance on 2nd May from 10AM to 4PM. Please use the staircase during this period.", type: "urgent", date: "29 Apr 2025", by: "Maintenance Dept", pinned: false },
];

export const meetings = [
  { id: 1, title: "Annual General Meeting",      date: "5 May 2025",  time: "6:30 PM", venue: "Community Hall",  agenda: "Budget review, election of new committee members, maintenance fee revision for FY2025-26", status: "Upcoming",  attendees: 44 },
  { id: 2, title: "Emergency Security Meeting",  date: "1 May 2025",  time: "7:00 PM", venue: "Garden Area",     agenda: "CCTV installation plan, night security guard hiring, gate lock system upgrade", status: "Upcoming",  attendees: 0  },
  { id: 3, title: "Garden Maintenance Meeting",  date: "15 Mar 2025", time: "5:00 PM", venue: "Community Hall",  agenda: "New plants, budget allocation, maintenance schedule and contractor selection", status: "Completed", attendees: 32 },
  { id: 4, title: "Holi Event Planning",         date: "20 Feb 2025", time: "6:00 PM", venue: "Terrace Area",    agenda: "Holi celebration planning, budget approval, decoration and food committee formation", status: "Completed", attendees: 28 },
];

export const galleryEvents = [
  { id: 1, emoji: "🎨", title: "Holi 2025",           date: "14 Mar 2025", photos: 24, tag: "Festival",     description: "Colourful Holi celebration with all residents" },
  { id: 2, emoji: "🎉", title: "New Year Party",       date: "1 Jan 2025",  photos: 38, tag: "Celebration",  description: "New Year countdown party at the terrace" },
  { id: 3, emoji: "🏆", title: "Sports Day 2024",      date: "15 Nov 2024", photos: 51, tag: "Sports",       description: "Annual inter-wing sports competition" },
  { id: 4, emoji: "🪔", title: "Diwali Night",         date: "1 Nov 2024",  photos: 45, tag: "Festival",     description: "Diwali rangoli and lighting decoration" },
  { id: 5, emoji: "🧁", title: "Children's Day",       date: "14 Nov 2024", photos: 29, tag: "Kids",         description: "Fun activities and games for children" },
  { id: 6, emoji: "🌳", title: "Tree Plantation Drive",date: "5 Jun 2024",  photos: 17, tag: "Green",        description: "Society's annual green initiative" },
];

export const payments = [
  { id: 1, flat: "A-101", name: "Ramesh Sharma",  amount: 2500, date: "2 Apr 2025",  mode: "UPI",   status: "Success",  txnId: "PAY001" },
  { id: 2, flat: "B-201", name: "Anjali Verma",   amount: 2500, date: "1 Apr 2025",  mode: "NEFT",  status: "Success",  txnId: "PAY003" },
  { id: 3, flat: "C-301", name: "Neha Singh",     amount: 2500, date: "3 Apr 2025",  mode: "UPI",   status: "Success",  txnId: "PAY005" },
  { id: 4, flat: "D-401", name: "Meena Iyer",     amount: 2500, date: "4 Apr 2025",  mode: "Cash",  status: "Success",  txnId: "PAY007" },
  { id: 5, flat: "D-402", name: "Arjun Nair",     amount: 2500, date: "5 Apr 2025",  mode: "UPI",   status: "Success",  txnId: "PAY008" },
  { id: 6, flat: "A-102", name: "Priya Mehta",    amount: 2500, date: "-",           mode: "-",     status: "Pending",  txnId: "-" },
  { id: 7, flat: "B-202", name: "Suresh Patel",   amount: 5000, date: "-",           mode: "-",     status: "Overdue",  txnId: "-" },
  { id: 8, flat: "C-302", name: "Vikram Joshi",   amount: 2500, date: "-",           mode: "-",     status: "Pending",  txnId: "-" },
];

export const monthlyCollection = [
  { month: "Oct", collected: 88000, target: 100000 },
  { month: "Nov", collected: 92000, target: 100000 },
  { month: "Dec", collected: 85000, target: 100000 },
  { month: "Jan", collected: 95000, target: 100000 },
  { month: "Feb", collected: 98000, target: 100000 },
  { month: "Mar", collected: 92500, target: 100000 },
];
