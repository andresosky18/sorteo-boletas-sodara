import React, { useState, useEffect } from 'react';

const TabMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetch('https://sodarasorteosyrifas.com/backend/obtener_movimientos.php?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') {
          setMovimientos(data.data);
        }
      });
  }, []);

  const totalPages = Math.ceil(movimientos.length / itemsPerPage) || 1;
  const currentItems = movimientos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6 w-full h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">Todos los Movimientos</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Agrupado inteligentemente por comprador • Hora oficial de Bogotá (UTC-5)
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider pr-4">CLIENTE</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider pr-4">FECHA Y HORA (BOGOTÁ)</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider pr-4">BOLETAS COMPRADAS</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-600 dark:text-white uppercase tracking-wider">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((mov, i) => {
              const listaBoletas = Array.isArray(mov.boletas) && mov.boletas.length > 0
                ? mov.boletas
                : String(mov.boleta || '').split(',').map(s => s.trim()).filter(Boolean);

              return (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-4 pr-4 border-b border-gray-50 dark:border-white/5 align-top">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {mov.nombre && mov.nombre.length > 0 ? mov.nombre.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate uppercase">{mov.nombre}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{mov.telefono}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 border-b border-gray-50 dark:border-white/5 text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap align-top">
                    {mov.fecha}
                  </td>
                  <td className="py-4 pr-4 border-b border-gray-50 dark:border-white/5 align-top max-w-[420px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {listaBoletas.length > 1 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 mr-1">
                          {listaBoletas.length} boletas:
                        </span>
                      )}
                      {listaBoletas.map((num, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        >
                          #{num}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 border-b border-gray-50 dark:border-white/5 align-top">
                    {(mov.estado && (mov.estado.toLowerCase() === 'aprobado' || mov.estado.toLowerCase() === 'pagado' || mov.estado.toLowerCase() === 'approved')) ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        Pagado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        Apartada
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">No hay movimientos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Página {currentPage} de {totalPages} ({movimientos.length} movimientos agrupados)
        </p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabMovimientos;
