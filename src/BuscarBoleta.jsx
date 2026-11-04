import React, { useState } from 'react';
import { descargarTicketVIP } from './generarTicketVIP';

// --- ICONOS VECTORIALES ---
const IconTrophy = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const IconTicket = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>;
const IconHelp = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>;
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;

const BuscarBoleta = ({ onNavigate }) => {
  const [telefono, setTelefono] = useState('');
  const [estadoBusqueda, setEstadoBusqueda] = useState('idle'); 
  const [boletasEncontradas, setBoletasEncontradas] = useState([]);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (!telefono) return;
    setEstadoBusqueda('loading');
    
    fetch('https://sodarasorteosyrifas.com/backend/buscar_boletas_cliente.php?q=' + encodeURIComponent(telefono))
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success' && data.data.length > 0) {
          const normalized = data.data.map(b => ({
            id: 'ORD-' + b.id,
            referencia: b.referencia || ('ORD-' + b.id),
            numero: b.numero,
            sorteo: b.sorteo || 'GRAN SORTEO SODARA',
            cliente: b.cliente || 'Participante Oficial',
            fecha: b.fecha || 'N/A',
            estado: b.estado || 'Pendiente'
          }));
          setBoletasEncontradas(normalized);
          setEstadoBusqueda('success');
        } else {
          setEstadoBusqueda('error');
        }
      })
      .catch(() => {
        setEstadoBusqueda('error');
      });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24 md:pb-0">
      
      {/* NAVBAR DESKTOP */}
      <nav className="hidden md:flex bg-white border-b border-slate-100 h-16 items-center sticky top-0 z-40">
        <div className="max-w-6xl mx-auto w-full px-6 flex justify-between items-center">
          
          <div onClick={() => onNavigate('sorteo')} className="w-1/4 cursor-pointer">
            <img src="https://sodarasorteosyrifas.com/logo_Negroo_Final.png" alt="Logo" className="h-12 md:h-14 rounded-lg object-contain drop-shadow-sm ml-2" />
          </div>

          <div className="flex gap-8 text-sm font-bold text-slate-500 h-full">
            <button onClick={() => onNavigate('sorteo')} className="h-full flex items-center px-2 hover:text-blue-600 transition-colors">
              Sorteo Activo
            </button>
            <button className="h-full flex items-center px-2 text-blue-600 border-b-2 border-blue-600">
              Mis Boletos
            </button>
            <button onClick={() => window.open('https://wa.me/573229415976?text=Hola,%20necesito%20soporte', '_blank')} className="h-full flex items-center px-2 hover:text-blue-600 transition-colors">Soporte</button>
          </div>

          <div className="w-1/4 flex justify-end"></div>
        </div>
      </nav>

      {/* HEADER MÓVIL */}
      <div className="md:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-40 flex justify-center items-center">
        <div onClick={() => onNavigate('sorteo')} className="cursor-pointer">
          <img src="https://sodarasorteosyrifas.com/logo_Negroo_Final.png" alt="Logo" className="h-12 md:h-14 rounded-lg object-contain drop-shadow-sm ml-2" />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Encuentra tus Boletas
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Puedes buscar tus boletas ingresando tu correo electrónico, tu cédula o tu número de celular. (Ej: info@correo.com o 3001234567)
          </p>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-xl mx-auto mb-12">
          <form onSubmit={manejarBusqueda} className="flex relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </div>
            <input 
              type="text" 
              placeholder="Correo, Cédula o Celular"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-transparent pl-12 pr-32 py-4 rounded-xl text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              maxLength="50"
            />
            <button 
              type="submit"
              disabled={estadoBusqueda === 'loading' || !telefono}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {estadoBusqueda === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Buscar'
              )}
            </button>
          </form>
        </div>

        <div className="min-h-[300px]">
          {estadoBusqueda === 'idle' && (
            <div className="text-center flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
              <div className="mb-4 text-slate-300">
                <IconTicket />
              </div>
              <p className="font-semibold">Busca tus boletas para ver su estado</p>
            </div>
          )}

          {estadoBusqueda === 'error' && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center max-w-md mx-auto border border-red-100">
              <div className="mb-3 text-red-500">
                <IconAlert />
              </div>
              <h3 className="font-bold text-lg mb-1">No encontramos boletas</h3>
              <p className="text-sm opacity-80 font-medium">Revisa que el dato ingresado esté correcto o intenta con otro medio de contacto.</p>
            </div>
          )}

          {estadoBusqueda === 'success' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Encontramos <span className="text-blue-600">{boletasEncontradas.length}</span> boletas
                </h2>
                <button
                  onClick={() => descargarTicketVIP({
                    sorteo: boletasEncontradas[0]?.sorteo || 'GRAN SORTEO SODARA',
                    numeros: boletasEncontradas.map(b => b.numero),
                    cliente: boletasEncontradas[0]?.cliente || 'Participante Oficial',
                    referencia: boletasEncontradas[0]?.referencia || boletasEncontradas[0]?.id,
                    fecha: boletasEncontradas[0]?.fecha,
                    estado: boletasEncontradas.some(b => b.estado.toLowerCase() === 'aprobado' || b.estado.toLowerCase() === 'pagado') ? 'Aprobado' : boletasEncontradas[0]?.estado
                  })}
                  className="bg-gradient-to-r from-[#eab308] to-[#ca8a04] hover:from-[#facc15] hover:to-[#eab308] text-slate-950 font-black text-sm px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🎟️ Descargar Ticket VIP Completo</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boletasEncontradas.map((boleta, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">BOLETA</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">#{String(boleta.numero).padStart(4, '0')}</p>
                      </div>
                      
                      {boleta.estado.toLowerCase() === 'aprobado' || boleta.estado.toLowerCase() === 'pagado' ? (
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-sm border border-emerald-100">
                          <IconCheckCircle />
                          <span>Pagada</span>
                        </div>
                      ) : (
                        <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-sm border border-amber-100">
                          <IconClock />
                          <span>Pendiente</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                      <div className="text-slate-500 font-medium">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">FECHA DE COMPRA</span>
                        {boleta.fecha}
                      </div>
                      <button
                        onClick={() => descargarTicketVIP({
                          sorteo: boleta.sorteo,
                          numeros: [boleta.numero],
                          cliente: boleta.cliente,
                          referencia: boleta.referencia || boleta.id,
                          fecha: boleta.fecha,
                          estado: boleta.estado
                        })}
                        className="bg-slate-900 hover:bg-slate-800 text-[#facc15] font-bold text-xs px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                      >
                        <span>🎟️ Descargar VIP</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <p className="text-blue-800 font-semibold mb-2">¿Quieres aumentar tus probabilidades de ganar?</p>
                <button onClick={() => onNavigate('sorteo')} className="text-blue-600 font-bold hover:underline">Volver al sorteo y comprar más boletas &rarr;</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MENU INFERIOR MÓVIL */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 pb-6 pt-2 px-6">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <button onClick={() => onNavigate('sorteo')} className="flex flex-col items-center gap-1 w-16 transition-colors text-slate-400 hover:text-blue-600">
            <IconTrophy />
            <span className="text-[10px] font-semibold">Sorteos</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 w-16 transition-colors text-blue-600">
            <IconTicket />
            <span className="text-[10px] font-semibold">Mis Boletos</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 w-16 transition-colors text-slate-400 hover:text-blue-600">
            <IconHelp />
            <span className="text-[10px] font-semibold">Ayuda</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuscarBoleta;

console.log('v8 cache buster');