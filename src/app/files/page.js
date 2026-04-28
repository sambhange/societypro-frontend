'use client';
import { useState } from 'react';
import {
  Upload, Search, Download, Trash2, Eye, Plus, X,
  FileText, FileImage, File, FilePen, FolderOpen,
  Lock, Globe, Star, StarOff, Filter, Calendar,
  ChevronDown, Link, Copy, CheckCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all',         label: 'All Files',          emoji: '📁' },
  { id: 'legal',       label: 'Legal & Registration', emoji: '⚖️' },
  { id: 'financial',   label: 'Financial & Accounts', emoji: '💰' },
  { id: 'maintenance', label: 'Maintenance',          emoji: '🔧' },
  { id: 'meetings',    label: 'Meeting Minutes',      emoji: '📋' },
  { id: 'noc',         label: 'NOC & Certificates',   emoji: '📜' },
  { id: 'rules',       label: 'Society Rules / Bylaws', emoji: '📖' },
  { id: 'forms',       label: 'Forms & Templates',    emoji: '📝' },
  { id: 'photos',      label: 'Photos & Media',       emoji: '🖼️' },
  { id: 'other',       label: 'Other',                emoji: '📂' },
];

const FILE_TYPES = {
  pdf:  { icon: '📄', color: '#DC2626', label: 'PDF'   },
  doc:  { icon: '📝', color: '#2563EB', label: 'Word'  },
  docx: { icon: '📝', color: '#2563EB', label: 'Word'  },
  xls:  { icon: '📊', color: '#16A34A', label: 'Excel' },
  xlsx: { icon: '📊', color: '#16A34A', label: 'Excel' },
  jpg:  { icon: '🖼️', color: '#D97706', label: 'Image' },
  jpeg: { icon: '🖼️', color: '#D97706', label: 'Image' },
  png:  { icon: '🖼️', color: '#D97706', label: 'Image' },
  zip:  { icon: '🗜️', color: '#7C3AED', label: 'ZIP'   },
  txt:  { icon: '📃', color: '#64748B', label: 'Text'  },
};

const getExt   = name => name.split('.').pop().toLowerCase();
const getType  = name => FILE_TYPES[getExt(name)] || { icon: '📂', color: '#64748B', label: 'File' };
const fmtSize  = bytes => bytes >= 1024*1024 ? `${(bytes/1024/1024).toFixed(1)} MB` : `${Math.round(bytes/1024)} KB`;
const fmtDate  = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

const initialFiles = [
  { id:1,  name:'Society_Registration_Certificate.pdf',   category:'legal',       size:524288,   uploadedBy:'Society Admin', date:'2020-04-01', access:'public',  starred:true,  downloads:34, description:'Official registration certificate of the society under Maharashtra Co-operative Societies Act.' },
  { id:2,  name:'Society_Byelaws_2020.pdf',               category:'rules',       size:1048576,  uploadedBy:'Society Admin', date:'2020-04-01', access:'public',  starred:true,  downloads:28, description:'Complete bylaws and rules of the society as approved in the 2020 AGM.' },
  { id:3,  name:'AnnualBudget_FY2024-25.xlsx',            category:'financial',   size:204800,   uploadedBy:'Treasurer',     date:'2024-04-10', access:'public',  starred:false, downloads:19, description:'Approved annual budget for FY 2024-25 with income and expenditure details.' },
  { id:4,  name:'AGM_Minutes_April2024.pdf',              category:'meetings',    size:358400,   uploadedBy:'Secretary',     date:'2024-04-20', access:'public',  starred:false, downloads:22, description:'Minutes of the Annual General Meeting held on 15th April 2024.' },
  { id:5,  name:'AGM_Minutes_April2023.pdf',              category:'meetings',    size:307200,   uploadedBy:'Secretary',     date:'2023-04-22', access:'public',  starred:false, downloads:17, description:'Minutes of the Annual General Meeting held on 18th April 2023.' },
  { id:6,  name:'Maintenance_Bill_April2025.pdf',         category:'maintenance', size:153600,   uploadedBy:'Society Admin', date:'2025-04-01', access:'public',  starred:false, downloads:41, description:'Monthly maintenance bill for April 2025. Includes all charges and dues.' },
  { id:7,  name:'NOC_Renovation_Template.docx',           category:'noc',         size:51200,    uploadedBy:'Society Admin', date:'2024-01-15', access:'public',  starred:true,  downloads:56, description:'NOC application template for flat renovation. Fill and submit to the secretary.' },
  { id:8,  name:'NOC_PetRegistration_Template.docx',      category:'noc',         size:45056,    uploadedBy:'Society Admin', date:'2024-01-15', access:'public',  starred:false, downloads:14, description:'Template for registering pets in the society. Required by society rules.' },
  { id:9,  name:'Audit_Report_FY2023-24.pdf',             category:'financial',   size:716800,   uploadedBy:'Treasurer',     date:'2024-07-01', access:'private', starred:false, downloads:8,  description:'Audited financial statements for FY 2023-24 by CA firm.' },
  { id:10, name:'Emergency_Contact_Directory.pdf',        category:'other',       size:102400,   uploadedBy:'Society Admin', date:'2025-01-01', access:'public',  starred:true,  downloads:62, description:'Emergency contact numbers — police, fire, ambulance, plumber, electrician etc.' },
  { id:11, name:'Parking_Allocation_Chart_2025.pdf',      category:'maintenance', size:204800,   uploadedBy:'Society Admin', date:'2025-01-15', access:'public',  starred:false, downloads:31, description:'Updated parking slot allocation for all flats effective January 2025.' },
  { id:12, name:'Holi2025_Event_Photos.zip',              category:'photos',      size:52428800, uploadedBy:'Events Team',   date:'2025-03-15', access:'public',  starred:false, downloads:48, description:'All photos from Holi 2025 celebration zipped together.' },
  { id:13, name:'Flat_Transfer_Form.docx',                category:'forms',       size:40960,    uploadedBy:'Society Admin', date:'2023-06-01', access:'public',  starred:false, downloads:9,  description:'Form required for transferring flat ownership. Submit with required documents.' },
  { id:14, name:'Tenant_Registration_Form.docx',          category:'forms',       size:38912,    uploadedBy:'Society Admin', date:'2023-06-01', access:'public',  starred:false, downloads:23, description:'Mandatory form for registering new tenants. Police verification included.' },
  { id:15, name:'Insurance_Policy_2024-25.pdf',           category:'legal',       size:819200,   uploadedBy:'Society Admin', date:'2024-06-01', access:'private', starred:false, downloads:5,  description:'Society building insurance policy document for FY 2024-25.' },
];

const today = new Date().toISOString().split('T')[0];
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

export default function FileRepository() {
  const [files, setFiles]           = useState(initialFiles);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [sortBy, setSortBy]         = useState('date');
  const [filterAccess, setFilterAccess] = useState('all');
  const [showForm, setShowForm]     = useState(false);
  const [selected, setSelected]     = useState(null);
  const [copied, setCopied]         = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [form, setForm] = useState({
    name:'', category:'other', access:'public', description:'', uploadedBy:'Society Admin', size: 102400,
  });

  const filtered = files.filter(f => {
    const q = search.toLowerCase();
    const matchSearch  = !search || f.name.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q);
    const matchCat     = category === 'all' || f.category === category;
    const matchAccess  = filterAccess === 'all' || f.access === filterAccess;
    const matchStarred = !showStarred || f.starred;
    return matchSearch && matchCat && matchAccess && matchStarred;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name')      return a.name.localeCompare(b.name);
    if (sortBy === 'size')      return b.size - a.size;
    if (sortBy === 'downloads') return b.downloads - a.downloads;
    return new Date(b.date) - new Date(a.date);
  });

  const toggleStar = (id) => {
    setFiles(files.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
    if (selected?.id === id) setSelected(p => ({ ...p, starred: !p.starred }));
  };

  const deleteFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const download = (id) => {
    setFiles(files.map(f => f.id === id ? { ...f, downloads: f.downloads + 1 } : f));
    if (selected?.id === id) setSelected(p => ({ ...p, downloads: p.downloads + 1 }));
  };

  const addFile = () => {
    if (!form.name) return;
    setFiles([{ ...form, id: Date.now(), date: today, downloads: 0, starred: false }, ...files]);
    setForm({ name:'', category:'other', access:'public', description:'', uploadedBy:'Society Admin', size:102400 });
    setShowForm(false);
  };

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    total:     files.length,
    public:    files.filter(f => f.access === 'public').length,
    private:   files.filter(f => f.access === 'private').length,
    totalSize: files.reduce((s, f) => s + f.size, 0),
    downloads: files.reduce((s, f) => s + f.downloads, 0),
  };

  return (
    <div>
      {/* Top bar */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, maxWidth:320 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
          <input placeholder="Search files and documents..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }}/>
        </div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ maxWidth:160 }}>
          <option value="date">📅 Latest First</option>
          <option value="name">🔤 Name A–Z</option>
          <option value="size">📦 Largest First</option>
          <option value="downloads">⬇️ Most Downloaded</option>
        </select>
        {['all','public','private'].map(a => (
          <button key={a} className={`btn btn-sm ${filterAccess===a?'btn-primary':'btn-outline'}`} onClick={()=>setFilterAccess(a)}>
            {a==='public'?<><Globe size={12}/> Public</> : a==='private'?<><Lock size={12}/> Private</> : 'All'}
          </button>
        ))}
        <button className={`btn btn-sm ${showStarred?'btn-gold':'btn-outline'}`} onClick={()=>setShowStarred(!showStarred)}>
          ⭐ Starred
        </button>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowForm(!showForm)}>
          <Upload size={14}/> Upload File
        </button>
      </div>

      {/* Category sidebar + content */}
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20 }}>

        {/* Left: category list */}
        <div>
          <div className="card" style={{ padding:'10px 0', marginBottom:0 }}>
            <div style={{ padding:'8px 16px 6px', fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px' }}>Categories</div>
            {CATEGORIES.map(c => {
              const count = c.id === 'all' ? files.length : files.filter(f=>f.category===c.id).length;
              return (
                <div key={c.id} onClick={()=>setCategory(c.id)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 16px', cursor:'pointer', borderRadius:8, margin:'1px 6px',
                    background: category===c.id ? 'rgba(37,99,235,0.08)' : 'transparent',
                    borderLeft: `3px solid ${category===c.id ? 'var(--accent)' : 'transparent'}`,
                    transition:'all 0.12s' }}
                  onMouseEnter={e=>{ if(category!==c.id) e.currentTarget.style.background='#F8FAFC'; }}
                  onMouseLeave={e=>{ if(category!==c.id) e.currentTarget.style.background='transparent'; }}>
                  <span style={{ fontSize:13, display:'flex', alignItems:'center', gap:8, color: category===c.id?'var(--accent)':'var(--text)', fontWeight: category===c.id?700:400 }}>
                    <span style={{ fontSize:16 }}>{c.emoji}</span> {c.label}
                  </span>
                  {count > 0 && <span style={{ fontSize:11, background: category===c.id?'rgba(37,99,235,0.15)':'#F1F5F9', color: category===c.id?'var(--accent)':'var(--muted)', borderRadius:99, padding:'1px 8px', fontWeight:600 }}>{count}</span>}
                </div>
              );
            })}

            {/* Storage summary */}
            <div style={{ margin:'12px 10px 6px', background:'#F8FAFC', borderRadius:10, padding:'12px 14px', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:11, color:'var(--muted)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Storage Used</div>
              <div style={{ fontWeight:800, fontSize:16, color:'var(--accent)' }}>{fmtSize(stats.totalSize)}</div>
              <div style={{ height:5, background:'#E2E8F0', borderRadius:99, marginTop:6, overflow:'hidden' }}>
                <div style={{ height:'100%', width:'34%', background:'var(--accent)', borderRadius:99 }}/>
              </div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>34% of 300 MB</div>
            </div>
          </div>
        </div>

        {/* Right: file grid + stats */}
        <div>
          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
            {[
              { label:'Total Files',  value:stats.total,    color:'var(--accent)',  icon:'📁' },
              { label:'Public',       value:stats.public,   color:'var(--accent2)', icon:'🌐' },
              { label:'Private',      value:stats.private,  color:'var(--gold)',    icon:'🔒' },
              { label:'Downloads',    value:stats.downloads,color:'var(--red)',     icon:'⬇️' },
            ].map((s,i)=>(
              <div key={i} className="stat-card" style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload form */}
          {showForm && (
            <div className="card" style={{ marginBottom:18 }}>
              <div className="card-title">
                <span>📤 Upload New File</span>
                <button onClick={()=>setShowForm(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={18}/></button>
              </div>

              {/* Drag drop area */}
              <div style={{ border:'2px dashed var(--border)', borderRadius:10, padding:'28px', textAlign:'center', marginBottom:16, background:'#F8FAFC', cursor:'pointer' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='rgba(37,99,235,0.04)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='#F8FAFC'; }}>
                <Upload size={28} style={{ color:'var(--muted)', marginBottom:8 }}/>
                <div style={{ fontWeight:600, color:'var(--text)', marginBottom:4 }}>Click to upload or drag & drop</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>PDF, Word, Excel, Images, ZIP — Max 50 MB</div>
              </div>

              <div className="form-grid-3" style={{ marginBottom:14 }}>
                <div className="form-row col-span-2">
                  <label className="field-label">File Name</label>
                  <input placeholder="Society_Document_2025.pdf" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                </div>
                <div className="form-row">
                  <label className="field-label">Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {CATEGORIES.filter(c=>c.id!=='all').map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <label className="field-label">Access</label>
                  <select value={form.access} onChange={e=>setForm({...form,access:e.target.value})}>
                    <option value="public">🌐 Public — All residents</option>
                    <option value="private">🔒 Private — Admin only</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="field-label">Uploaded By</label>
                  <input value={form.uploadedBy} onChange={e=>setForm({...form,uploadedBy:e.target.value})}/>
                </div>
                <div className="form-row col-span-3">
                  <label className="field-label">Description</label>
                  <textarea placeholder="Brief description of this document..." style={{ minHeight:60 }} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
                </div>
              </div>
              <button className="btn btn-primary" onClick={addFile}><Upload size={14}/> Upload File</button>
            </div>
          )}

          {/* File list */}
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700, fontSize:14.5, color:'var(--white)' }}>
                {CAT_MAP[category]?.emoji} {CAT_MAP[category]?.label} ({sorted.length})
              </span>
            </div>

            {sorted.length === 0 && (
              <div style={{ textAlign:'center', padding:'50px 0', color:'var(--muted)' }}>
                <FolderOpen size={40} style={{ opacity:0.3, marginBottom:10 }}/>
                <div>No files found</div>
              </div>
            )}

            {sorted.map((f, idx) => {
              const ft  = getType(f.name);
              const cat = CAT_MAP[f.category] || CAT_MAP.other;
              return (
                <div key={f.id}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 20px',
                    borderBottom: idx<sorted.length-1?'1px solid var(--border)':'none',
                    cursor:'pointer', transition:'background 0.1s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  onClick={()=>setSelected(f)}>

                  {/* File icon */}
                  <div style={{ width:42, height:42, borderRadius:10, background:`${ft.color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                    {ft.icon}
                  </div>

                  {/* File info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontWeight:600, fontSize:13.5, color:'var(--white)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
                      {f.starred && <Star size={13} style={{ color:'var(--gold)', flexShrink:0 }} fill="var(--gold)"/>}
                      {f.access === 'private' && <Lock size={12} style={{ color:'var(--muted)', flexShrink:0 }}/>}
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)', display:'flex', gap:12, flexWrap:'wrap' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}>{cat.emoji} {cat.label}</span>
                      <span>{fmtSize(f.size)}</span>
                      <span>📅 {fmtDate(f.date)}</span>
                      <span>👤 {f.uploadedBy}</span>
                      <span>⬇️ {f.downloads} downloads</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:6, flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-sm" style={{ background:`${ft.color}12`, color:ft.color, border:'none', padding:'6px 12px' }}
                      onClick={()=>download(f.id)}>
                      <Download size={13}/>
                    </button>
                    <button className="btn btn-sm" style={{ background: f.starred?'rgba(217,119,6,0.12)':'#F1F5F9', color:f.starred?'var(--gold)':'var(--muted)', border:'none', padding:'6px 10px' }}
                      onClick={()=>toggleStar(f.id)}>
                      <Star size={13} fill={f.starred?'var(--gold)':'none'}/>
                    </button>
                    <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none', padding:'6px 10px' }}
                      onClick={()=>deleteFile(f.id)}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* File detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:500 }}>
            {(() => {
              const ft  = getType(selected.name);
              const cat = CAT_MAP[selected.category] || CAT_MAP.other;
              return (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                    <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                      <div style={{ width:54, height:54, borderRadius:14, background:`${ft.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{ft.icon}</div>
                      <div>
                        <div style={{ fontWeight:800, fontSize:16, color:'var(--white)', lineHeight:1.3 }}>{selected.name}</div>
                        <div style={{ fontSize:12, color:'var(--muted)', marginTop:3, display:'flex', gap:8 }}>
                          <span style={{ background:`${ft.color}12`, color:ft.color, padding:'1px 8px', borderRadius:99, fontWeight:600 }}>{ft.label}</span>
                          <span>{fmtSize(selected.size)}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={()=>setSelected(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)' }}><X size={20}/></button>
                  </div>

                  {selected.description && (
                    <div style={{ background:'#F8FAFC', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13.5, lineHeight:1.7, color:'var(--text)', border:'1px solid var(--border)', borderLeft:`3px solid ${ft.color}` }}>
                      {selected.description}
                    </div>
                  )}

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                    {[
                      { label:'Category',    value:`${cat.emoji} ${cat.label}` },
                      { label:'Uploaded By', value:selected.uploadedBy },
                      { label:'Upload Date', value:fmtDate(selected.date) },
                      { label:'File Size',   value:fmtSize(selected.size) },
                      { label:'Downloads',   value:`${selected.downloads} times` },
                      { label:'Access',      value:selected.access === 'public' ? '🌐 Public' : '🔒 Private' },
                    ].map(d => (
                      <div key={d.label} style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 14px', border:'1px solid var(--border)' }}>
                        <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>{d.label}</div>
                        <div style={{ fontWeight:600, fontSize:13.5, color:'var(--white)' }}>{d.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Share link */}
                  <div style={{ background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                    <Link size={14} style={{ color:'var(--accent)', flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:'var(--muted)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      https://sunrise.society/files/{selected.id}
                    </span>
                    <button className="btn btn-sm" style={{ background: copied?'rgba(37,99,235,0.15)':'#F1F5F9', color:copied?'var(--accent)':'var(--muted)', border:'1px solid var(--border)', flexShrink:0 }}
                      onClick={copyLink}>
                      {copied ? <><CheckCircle size={12}/> Copied!</> : <><Copy size={12}/> Copy</>}
                    </button>
                  </div>

                  <div style={{ display:'flex', gap:10 }}>
                    <button className="btn btn-primary" style={{ flex:2, justifyContent:'center' }} onClick={()=>download(selected.id)}>
                      <Download size={14}/> Download
                    </button>
                    <button className="btn btn-sm" style={{ flex:1, justifyContent:'center', background: selected.starred?'rgba(217,119,6,0.12)':'#F1F5F9', color:selected.starred?'var(--gold)':'var(--muted)', border:`1px solid ${selected.starred?'var(--gold)':'var(--border)'}` }}
                      onClick={()=>toggleStar(selected.id)}>
                      <Star size={13} fill={selected.starred?'var(--gold)':'none'}/> {selected.starred?'Starred':'Star'}
                    </button>
                    <button className="btn btn-sm" style={{ background:'rgba(220,38,38,0.08)', color:'var(--red)', border:'none', padding:'8px 14px' }}
                      onClick={()=>deleteFile(selected.id)}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
