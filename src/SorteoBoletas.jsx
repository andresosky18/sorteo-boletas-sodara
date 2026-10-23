import React, { useState } from 'react';

// --- ICONOS VECTORIALES ---
const IconTrophy = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const IconTicket = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>;
const IconHelp = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconBag = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconZap = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

// Recibimos "onNavigate" desde App.jsx


import Catalogo from './Catalogo';
import CheckoutModal from './CheckoutModal';
import { descargarTicketVIP } from './generarTicketVIP';

const SorteoBoletas = ({ onNavigate }) => {
  const [vista, setVista] = useState('catalogo');
  const [sorteo, setSorteo] = useState(null);
  const [vendidas, setVendidas] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(null);
  const [boletasCompradas, setBoletasCompradas] = useState([]);

  
  
  const handleSelectSorteo = (s) => {
    const precioUnit = parseFloat(s.price) || 1000;
    const combosSorteo = Array.isArray(s.combos)
      ? s.combos
      : [
          { cantidad: 5, precio: 5 * precioUnit, subtitulo: 'Boletas al azar', destacado: false },
          { cantidad: 15, precio: 15 * precioUnit, subtitulo: 'Máxima suerte', destacado: true },
          { cantidad: 30, precio: 30 * precioUnit, subtitulo: 'Gran inversión', destacado: false }
        ];
    setSorteo({
      id: s.id,
      nombre: s.title,
      precio: precioUnit,
      totalBoletas: parseInt(s.cantidad) || 100,
      foto: s.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      combos: combosSorteo
    });
    setSeleccionadas([]);
    setVista('detalle');
    setLoading(true);

    // Fetch boletas reales de este sorteo!
    fetch('https://sodarasorteosyrifas.com/backend/boletas.php')
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success') {
          // Filtrar las de este sorteo especifico, idealmente el backend deberia recibir ?sorteo_id=s.id
          // Pero lo hacemos aca por simplicidad o lo que devuelva
          
            const vendidasMap = {};
            data.data.filter(b => b.sorteo_id == s.id || b.sorteo === s.title).forEach(b => {
              vendidasMap[parseInt(b.numero)] = b.estado ? b.estado.toLowerCase() : 'pendiente';
            });
            setVendidas(vendidasMap);

        }
        setLoading(false);
      })
      .catch(() => {
        setVendidas({});
        setLoading(false);
      });
  };




  const [seleccionadas, setSeleccionadas] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [nombreInput, setNombreInput] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');
  const porcentajeVendido = sorteo ? Math.floor((Object.keys(vendidas).length / (sorteo?.totalBoletas || 100)) * 100) : 0;

  const alternarSeleccion = (numero) => {
    if ((vendidas[numero] !== undefined)) return;
    if (seleccionadas.includes(numero)) {
      setSeleccionadas(seleccionadas.filter(n => n !== numero));
    } else {
      setSeleccionadas([...seleccionadas, numero]);
    }
  };

  const seleccionarPaquete = (cantidíad) => {
    const disponibles = Array.from({ length: (sorteo?.totalBoletas || 100) }, (_, i) => i).filter(n => (vendidas[n] === undefined));
    const nuevosSeleccionados = disponibles.sort(() => 0.5 - Math.random()).slice(0, cantidíad);
    setSeleccionadas(nuevosSeleccionados);
  };

  const calcularTotalPagar = () => {
    if (!seleccionadas.length) return 0;
    const comboMatch = (sorteo?.combos || []).find(c => Number(c.cantidad) === seleccionadas.length);
    if (comboMatch && Number(comboMatch.precio) > 0) {
      return Number(comboMatch.precio);
    }
    return seleccionadas.length * (sorteo?.precio || 0);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  };

  
  if (pagoExitoso === 'rechazado') {
    return (
      <div className="min-h-screen bg-[#f8eae8] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-200/50 rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 -right-32 w-80 h-80 bg-red-200/40 rounded-full blur-3xl"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 max-w-[420px] w-full text-center shadow-2xl shadow-red-900/10 border border-white/50 animate-in zoom-in duration-500 relative z-10">
          
          <div className="w-28 h-28 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d32e2e] to-[#a91212] rounded-full shadow-[0_10px_20px_rgba(195,33,33,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <svg className="w-12 h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </div>
          </div>

          <h2 className="text-[28px] font-black text-slate-900 mb-3 tracking-tight">¡Pago Rechazado! ❌</h2>
          <p className="text-slate-500 mb-8 text-[15px] leading-relaxed font-medium">No pudimos procesar tu pago. Por favor intenta con otro método o tarjeta.</p>
          
          <button onClick={() => { setPagoExitoso(null); window.location.reload(); }} className="w-full bg-gradient-to-r from-[#c61717] to-[#a11010] text-white font-bold text-lg py-4 rounded-2xl hover:from-[#b21515] hover:to-[#8f0e0e] transition-all shadow-[0_8px_16px_rgba(161,16,16,0.3)] active:scale-95 active:shadow-sm">
            Volver a intentar
          </button>
        </div>
      </div>
    );
}

if (pagoExitoso && pagoExitoso !== 'rechazado') {

    return (
      <div className="min-h-screen bg-[#eaf8f1] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-200/50 rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 -right-32 w-80 h-80 bg-green-200/40 rounded-full blur-3xl"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 max-w-[420px] w-full text-center shadow-2xl shadow-green-900/10 border border-white/50 animate-in zoom-in duration-500 relative z-10">
          
          <div className="w-28 h-28 mx-auto mb-6 relative">
            {/* 3D Checkmark Simulation */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2ed366] to-[#12a945] rounded-full shadow-[0_10px_20px_rgba(33,195,84,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <svg className="w-12 h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
            </div>
          </div>

          <h2 className="text-[28px] font-black text-slate-900 mb-3 tracking-tight">¡Pago Exitoso! 🎉</h2>
          <p className="text-slate-500 mb-8 text-[15px] leading-relaxed font-medium">Tu pago se ha procesado exitosamente. Las boletas ahora te pertenecen y te hemos enviado un comprobante al correo.</p>
          
          <div className="bg-white rounded-2xl p-5 mb-8 text-left shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Transacción</span>
              <span className="font-mono text-slate-700 font-semibold text-sm">{pagoExitoso.id ? pagoExitoso.id.split('-')[0] : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Referencia</span>
              <span className="font-mono text-slate-700 font-semibold text-sm">{pagoExitoso.reference ? pagoExitoso.reference.substring(0, 15) + '...' : 'N/A'}</span>
            </div>
          </div>

          <button
            onClick={() => descargarTicketVIP({
              sorteo: sorteo?.nombre || 'GRAN SORTEO SODARA',
              numeros: boletasCompradas.length > 0 ? boletasCompradas : ['00'],
              cliente: nombreInput || 'Participante Oficial',
              referencia: pagoExitoso.reference || pagoExitoso.id || 'SODARA-VIP',
              estado: 'Aprobado'
            })}
            className="w-full mb-3 bg-gradient-to-r from-[#eab308] to-[#ca8a04] text-slate-950 font-black text-base py-4 rounded-2xl hover:from-[#facc15] hover:to-[#eab308] transition-all shadow-[0_8px_20px_rgba(234,179,8,0.35)] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🎟️ Descargar Boleta VIP (Imagen)</span>
          </button>
          
          <button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-[#17c654] to-[#10a141] text-white font-bold text-lg py-4 rounded-2xl hover:from-[#15b24b] hover:to-[#0e8f39] transition-all shadow-[0_8px_16px_rgba(16,161,65,0.3)] active:scale-95 active:shadow-sm">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }
  
  

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24 md:pb-0">
      
      {/* NAVBAR DESKTOP */}
      <nav className="hidden md:flex bg-white border-b border-slate-100 h-16 items-centermsticky top-0 z-40">
        <div className="max-w-6xl mx-auto w-full px-6 flex justify-between items-center">
          
          <div className="text-2xl font-black tracking-tighter text-slate-900 w-1/4">
            <img src="/logo_Negroo_Final.png" alt="Logo" className="h-11 rounded-lg object-contain" />
          </div>

          <div className="flex gap-8 text-sm font-bold text-slate-500 h-full">
            <button onClick={() => setVista('catalogo')} className="h-full flex items-center px-2 text-blue-600 border-b-2 border-blue-600 hover:text-slate-800 transition-colors">
                Catálogo de Sorteos
              </button>
            {/* ESTE BOTÃ“N AHORA NAVEGA A BUSCAR BOLETA */}
            <button onClick={() => onNavigate('boletos')} className="h-full flex items-center px-2 hover:text-blue-600 transition-colors">
              Mis Boletos
            </button>
            <button onClick={() => window.open('https://wa.me/573229415976?text=Hola,%20necesito%20soporte', '_blank')} className="h-full flex items-center px-2 hover:text-blue-600 transition-colors">Soporte</button>
          </div>

          <div className="w-1/4 flex justify-end"></div>
        </div>
      </nav>

      {/* HEADER MÃ“VIL */}
      <div className="md:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-40 flex justify-center items-center">
        <div className="text-xl font-black tracking-tighter text-slate-900">
          <img src="/logo_Negroo_Final.png" alt="Logo" className="h-11 rounded-lg object-contain" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
  {vista === 'catalogo' ? (
    <Catalogo onSelectSorteo={handleSelectSorteo} />
  ) : (
    <>
      
        
        {/* HERO BANNER */}
        <div className="w-full h-[200px] md:h-[350px] bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-lg flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${sorteo?.foto})` }}></div>
          
          <div className="relative z-20 text-center px-4 w-full flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{sorteo?.nombre || "Cargando sorteo..."}</h1>
            <p className="text-blue-400 font-bold md:text-lg">Gran Sorteo • {sorteo?.totalBoletas || 100} Boletas</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Progreso</span>
                  <span className="text-lg font-black text-slate-900 leading-none">{porcentajeVendido}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${porcentajeVendido}%` }}></div>
                </div>
              </div>
            </div>

            {(sorteo?.combos && sorteo.combos.length > 0) && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <IconZap />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">Combos Rápidos (Recomendado)</h3>
                  </div>
                  
                  <div className={`grid grid-cols-1 ${sorteo.combos.length === 2 ? 'sm:grid-cols-2' : sorteo.combos.length >= 4 ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
                    {sorteo.combos.map((combo, idx) => {
                      const cant = Number(combo.cantidad) || 1;
                      const precioCombo = Number(combo.precio) > 0 ? Number(combo.precio) : cant * (sorteo?.precio || 0);
                      const subtitulo = combo.subtitulo || 'Boletas al azar';
                      const esDestacado = Boolean(combo.destacado);

                      if (esDestacado) {
                        return (
                          <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col items-center text-center shadow-md relative transform sm:-translate-y-1">
                            <div className="absolute -top-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full whitespace-nowrap">
                              El más vendido
                            </div>
                            <div className="text-3xl font-black text-white mb-1 mt-2">x{cant}</div>
                            <div className="text-xs font-semibold text-slate-400 mb-4">{subtitulo}</div>
                            <div className="text-lg font-bold text-white mb-4">{formatearPrecio(precioCombo)}</div>
                            <button onClick={() => seleccionarPaquete(cant)} className="w-full py-2.5 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm mt-auto">
                              Elegir Combo
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center shadow-sm hover:border-slate-300 transition-colors">
                          <div className="text-3xl font-black text-slate-900 mb-1">x{cant}</div>
                          <div className="text-xs font-semibold text-slate-500 mb-4">{subtitulo}</div>
                          <div className="text-lg font-bold text-slate-800 mb-4">{formatearPrecio(precioCombo)}</div>
                          <button onClick={() => seleccionarPaquete(cant)} className="w-full py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors mt-auto">
                            Elegir Combo
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center py-4">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-semibold">O si prefieres</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </>
            )}

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-bold text-lg text-slate-900">Selecciona tus números en la grilla</h3>
                <div className="flex gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-white border border-slate-300 rounded-full"></div> Libre</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-900 rounded-full"></div> Tuya</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-100 rounded-full"></div> Ocupada</span>
                </div>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3">
                {Array.from({ length: (sorteo?.totalBoletas || 100) }).map((_, index) => {
                  const num = index.toString().padStart(2, '0');
                  const estadoVendida = vendidas[index];
                  const vendidía = estadoVendida !== undefined;
                  const isAprobada = estadoVendida === 'aprobado' || estadoVendida === 'pagado';
                  const seleccionadía = seleccionadas.includes(index);

                  return (
                    <button
                      key={index}
                      onClick={() => alternarSeleccion(index)}
                      disabled={vendidía}
                      className={`
                        aspect-square rounded-xl text-sm md:text-base font-bold transition-all flex items-center justify-center border
                        ${isAprobada ? 'bg-[#4318FF] text-white cursor-not-allowed border-transparent opacity-90' : vendidía ? 'bg-amber-500 text-white cursor-not-allowed border-transparent opacity-90' : seleccionadía
                            ? 'bg-slate-900 text-white border-slate-900 transform scale-105 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                        }
                      `}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]">
                
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <IconBag /> Tu Carrito
                  </h2>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                    {seleccionadas.length} boletas
                  </span>
                </div>
                
                <div className="mb-6 min-h-[100px]">
                  {seleccionadas.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center border-2 border-dashed border-slate-100 rounded-2xl py-8 px-4 bg-slate-50/50">
                      Aún no has elegido tus números.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {seleccionadas.map(num => (
                        <span key={num} className="relative bg-[#0f172a] text-white px-3.5 py-1.5 rounded-md font-bold text-sm tracking-wider flex items-center justify-center overflow-hidden">
                          <span className="absolute -left-1.5 w-3 h-3 bg-white rounded-full"></span>
                          <span className="absolute -right-1.5 w-3 h-3 bg-white rounded-full"></span>
                          {num.toString().padStart(4, '0')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 py-4 mb-4">
                  <div className="flex justify-between text-slate-500 text-sm mb-3">
                    <span>Precio unitario:</span>
                    <span className="text-slate-700">{formatearPrecio((sorteo?.precio || 0))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-600">Total a pagar:</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      {formatearPrecio(calcularTotalPagar())}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Nombre Completo" value={nombreInput} onChange={(e) => setNombreInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-semibold placeholder:text-slate-400"/>
                  <input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={10} placeholder="Número de WhatsApp (10 dígitos)" value={whatsappInput} onChange={(e) => setWhatsappInput(e.target.value.replace(/\D/g, ''))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-semibold placeholder:text-slate-400"/>
                </div>

                <button onClick={() => setIsCheckoutOpen(true)} disabled={seleccionadas.length === 0 || !nombreInput.trim() || !whatsappInput.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                    <IconLock /> Pagar de forma segura
                  </button>

              </div>
            </div>
          </div>

        </div>
      
    </>
  )}
  <CheckoutModal isOpen={isCheckoutOpen} initialName={nombreInput} initialPhone={whatsappInput} 
        onClose={() => setIsCheckoutOpen(false)} 
        seleccionadas={seleccionadas} 
        sorteo={sorteo}
        totalOverride={calcularTotalPagar()}
        onSuccess={(tx) => { setBoletasCompradas([...seleccionadas]); setIsCheckoutOpen(false); setSeleccionadas([]); setPagoExitoso(tx); }} 
      />

      {/* Botón flotante de WhatsApp */}
      <a 
        href="https://wa.me/573229415976?text=Hola,%20necesito%20ayuda%20con%20un%20sorteo" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-110 z-50 flex items-center justify-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-bold px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Necesitas ayuda?
        </span>
      </a>
</main>


      {/* MENU INFERIOR MÃ“VIL */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 pb-6 pt-2 px-6">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <button onClick={() => setVista('catalogo')} className="flex flex-col items-center gap-1 w-16 transition-colors text-blue-600">
            <IconTrophy />
            <span className="text-[10px] font-semibold">Sorteo</span>
          </button>
          
          {/* ESTE BOTÃ“N AHORA NAVEGA A BUSCAR BOLETA */}
          <button onClick={() => onNavigate('boletos')} className="flex flex-col items-center gap-1 w-16 transition-colors text-slate-400 hover:text-blue-600">
            <IconTicket />
            <span className="text-[10px] font-semibold">Mis Boletos</span>
          </button>
          
          <button onClick={() => window.open('https://wa.me/573229415976?text=Hola,%20necesito%20soporte', '_blank')} className="flex flex-col items-center gap-1 w-16 transition-colors text-slate-400 hover:text-blue-600"><IconHelp /><span className="text-[10px] font-semibold">Soporte</span></button>
        </div>
      </div>

    </div>
  );
};

export default SorteoBoletas;
