// ── Universal Export Utility ──────────────────────────────────────────────────
// Works in browser — no libraries needed for CSV
// For Excel (.xlsx) uses SheetJS via CDN

// ── Export to CSV ─────────────────────────────────────────────────────────────
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    alert('No data to export!');
    return;
  }

  // Get headers from first object keys
  const headers = Object.keys(data[0]);

  // Build CSV content
  const csvRows = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const val = row[header] ?? '';
        // Wrap in quotes if contains comma, newline or quote
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') || str.includes('\n') || str.includes('"')
          ? `"${str}"`
          : str;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  // Trigger download
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ── Export to Excel (.xlsx) via SheetJS CDN ──────────────────────────────────
export const exportToExcel = async (data, filename = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    alert('No data to export!');
    return;
  }

  try {
    // Load SheetJS dynamically
    if (!window.XLSX) {
      await new Promise((resolve, reject) => {
        const script    = document.createElement('script');
        script.src      = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload   = resolve;
        script.onerror  = reject;
        document.head.appendChild(script);
      });
    }

    const XLSX      = window.XLSX;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook  = XLSX.utils.book_new();

    // Auto column width
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length, ...data.map(row => String(row[key] ?? '').length)) + 2
    }));
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (err) {
    console.error('Excel export failed:', err);
    // Fallback to CSV
    exportToCSV(data, filename);
  }
};

// ── Print / PDF export ────────────────────────────────────────────────────────
export const printTable = (title, data) => {
  if (!data || data.length === 0) {
    alert('No data to print!');
    return;
  }

  const headers = Object.keys(data[0]);
  const rows    = data.map(row =>
    `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`
  ).join('');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2   { color: #2563EB; margin-bottom: 8px; }
          p    { color: #64748B; margin-bottom: 16px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #0F172A; color: white; padding: 10px 12px; text-align: left; }
          td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
          tr:nth-child(even) { background: #F8FAFC; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <p>Generated on ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
        <button onclick="window.print()" style="background:#2563EB;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;margin-bottom:16px;">🖨️ Print</button>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
};

// ── Export Button Component ───────────────────────────────────────────────────
// Usage: <ExportButtons data={myData} filename="maintenance" title="Maintenance Report"/>
export const ExportButtons = ({ data, filename, title, style = {} }) => {
  return (
    <div style={{ display:'flex', gap:8, ...style }}>
      <button
        onClick={() => exportToCSV(data, filename)}
        style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
          background:'rgba(22,163,74,0.1)', color:'#16A34A',
          border:'1px solid rgba(22,163,74,0.3)', borderRadius:8,
          cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:'inherit' }}>
        📄 CSV
      </button>
      <button
        onClick={() => exportToExcel(data, filename, title)}
        style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
          background:'rgba(37,99,235,0.1)', color:'#2563EB',
          border:'1px solid rgba(37,99,235,0.2)', borderRadius:8,
          cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:'inherit' }}>
        📊 Excel
      </button>
      <button
        onClick={() => printTable(title || filename, data)}
        style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
          background:'rgba(100,116,139,0.1)', color:'#64748B',
          border:'1px solid rgba(100,116,139,0.2)', borderRadius:8,
          cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:'inherit' }}>
        🖨️ Print
      </button>
    </div>
  );
};
