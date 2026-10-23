import React, { useState, useEffect } from 'react';

const Catalogo = ({ onSelectSorteo }) => {
  const [sorteos, setSorteos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://sodarasorteosyrifas.com/backend/obtener_sorteos.php?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success') {
          setSorteos(data.data.filter(s => (s.estado && s.estado.toLowerCase() === 'activo') || !s.estado));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  };

  return (
    <div className="py-4">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Sorteos Disponibles</h1>
      <p className="text-slate-500 font-medium mb-8">Elige el sorteo en el que deseas participar y gana increíbles premios.</p>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold">Cargando sorteos...</div>
      ) : sorteos.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-bold">No hay sorteos activos en este momento.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorteos.map(s => (
            <div key={s.id} onClick={() => onSelectSorteo(s)} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer flex flex-col group border border-slate-100">
              <div className="h-48 relative overflow-hidden bg-slate-200">
                <img src={s.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-600 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Activo
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-2">{s.title}</h3>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Precio Boleta</p>
                    <p className="text-lg font-black text-blue-600">{formatearPrecio(s.price)}</p>
                  </div>
                  <button className="bg-slate-900 text-white rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-slate-800 transition-colors">
                    Participar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalogo;
