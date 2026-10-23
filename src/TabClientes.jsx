
import React, { useState, useEffect } from 'react';

const Icons = {
  More: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
};

const TopCreatorTable = () => {
  const [clientes, setClientes] = useState([]);
  
  useEffect(() => {
    fetch('https://sodarasorteosyrifas.com/backend/clientes.php')
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success') {
          setClientes(data.data);
        }
      });
  }, []);

  
  const exportToCSV = () => {
    const headers = ['Cliente', 'Email', 'Telefono', 'Boletas Asignadas', 'Total Invertido'];
    const rows = clientes.map(c => [
      c.name,
      c.email,
      c.phone,
      c.boletas || 0,
      c.invertido || 0
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clientes_sodara.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name) => {
    if(!name) return '';
    const parts = name.split(' ');
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };


  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6 w-full h-full">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">Top Clientes</h4>
        <button onClick={exportToCSV} className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white font-bold transition duration-200 hover:cursor-pointer hover:bg-green-600 shadow-md">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar a Excel
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider pr-4">CLIENTE</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider pr-4">WHATSAPP / CELULAR</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider pr-4">BOLETAS ASIGNADAS</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider">TOTAL INVERTIDO</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((row, i) => (
              <tr key={i}>
                <td className="py-4 pr-4 border-b border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0 ${'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-white'}`}>
                      {getInitials(row.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-700 dark:text-white">{row.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-4 border-b border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-green-500">co</span>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{row.phone}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 border-b border-gray-50 dark:border-white/5">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 px-2 py-1 text-xs font-bold text-navy-700 dark:text-white">
                        {row.boletas || 0} boleta(s)
                    </span>
                  </div>
                </td>
                <td className="py-4 text-sm font-bold text-navy-700 dark:text-white border-b border-gray-50 dark:border-white/5">
                  {new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(row.invertido || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabClientes = () => {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] w-full mx-auto font-dm">
      <div className="grid grid-cols-1 gap-5">
        <TopCreatorTable />
      </div>
    </div>
  );
};

export default TabClientes;

