import React, { useState, useEffect } from 'react';

const Icons = {
  Search: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  WhatsApp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MessageSquare: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  FileText: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
};


const TabBoletas = () => {
  const [vista, setVista] = useState('lista');
  const [listaSorteos, setListaSorteos] = useState([]);
  const [boletasVendidas, setBoletasVendidas] = useState([]);
  const [sorteo, setSorteo] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [liberando, setLiberando] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://sodarasorteosyrifas.com/backend/obtener_sorteos.php?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success') {
          setListaSorteos(data.data);
        }
      });
  }, []);

  const cargarBoletas = (s) => {
    fetch('https://sodarasorteosyrifas.com/backend/boletas.php?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success') {
          const filtradas = data.data.filter(b => b.sorteo_id == s.id || b.sorteo === s.title || b.sorteo === s.titulo);
          setBoletasVendidas(filtradas);
        }
      });
  };

  const handleSelectSorteo = (s) => {
    const sorteoObj = { 
      id: s.id,
      totalBoletas: parseInt(s.cantidad) || 1000, 
      titulo: s.title,
      precio: parseFloat(s.price) || 0
    };
    setSorteo(sorteoObj);
    setVista('grid');
    cargarBoletas(s);
  };

  const handleLiberarBoleta = async (ticket) => {
    if (!ticket || !sorteo) return;
    if (!window.confirm(`¿Seguro que deseas liberar la boleta #${ticket.num}? Quedará disponible nuevamente para la venta.`)) {
      return;
    }
    setLiberando(true);
    try {
      const res = await fetch('https://sodarasorteosyrifas.com/backend/liberar_boleta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticket.raw?.id || '',
          sorteo_id: sorteo.id,
          numero: parseInt(ticket.num, 10)
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBoletasVendidas(prev => prev.filter(b => parseInt(b.numero, 10) !== parseInt(ticket.num, 10)));
      } else {
        alert('Error al liberar: ' + (data.message || 'Desconocido'));
      }
    } catch (e) {
      alert('Error de conexión al liberar la boleta');
    } finally {
      setLiberando(false);
    }
  };

  const handleEnviarCorreoReal = async (ticket) => {
    if (!ticket) return;
    let emailDestino = ticket.raw?.email || '';
    if (!emailDestino) {
      emailDestino = window.prompt('Ingresa el correo electrónico al que deseas enviar el comprobante:', '') || '';
      if (!emailDestino.trim()) return;
    }
    setSendingEmail(true);
    try {
      const res = await fetch('https://sodarasorteosyrifas.com/backend/reenviar_correo_boleta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailDestino.trim(),
          nombre: ticket.owner || 'Participante',
          sorteo: sorteo?.titulo || 'Gran Sorteo Sodara',
          numero: ticket.num,
          referencia: ticket.raw?.referencia || ('ORD-' + (ticket.raw?.id || ticket.num))
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('¡Correo enviado con éxito a ' + emailDestino + '!');
        setShowEmailPreview(false);
      } else {
        alert('Error: ' + (data.message || 'No se pudo enviar el correo'));
      }
    } catch (e) {
      alert('Error de conexión al enviar el correo');
    } finally {
      setSendingEmail(false);
    }
  };

  const boletasVendidasMap = {};
  boletasVendidas.forEach(b => {
    boletasVendidasMap[parseInt(b.numero)] = b;
  });

  const tickets = sorteo ? Array.from({length: sorteo.totalBoletas}).map((_, i) => {
    const num = i.toString().padStart(4, '0');
    const boleta = boletasVendidasMap[i];
    
    let state = 'Libre';
    let owner = 'Libre';
    let initial = '';

    if (boleta) {
       const estado = boleta.estado ? boleta.estado.toLowerCase() : '';
       if (estado === 'aprobado' || estado === 'pagado') {
         state = 'Pagada';
       } else {
         state = 'Apartada';
       }
       owner = boleta.cliente || 'Desconocido';
       initial = owner.substring(0, 2).toUpperCase();
    }

    return { num, state, owner, initial, raw: boleta };
  }) : [];

  const filteredTickets = searchQuery.trim()
    ? tickets.filter(t => t.num.includes(searchQuery.trim()) || t.owner.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : tickets;

  const [selectedTicket, setSelectedTicket] = useState(null);

  const displayTicket = selectedTicket ? tickets.find(t => t.num === selectedTicket.num) || tickets[0] : tickets[0];

  if (vista === 'lista') {
    return (
      <div className="animate-in fade-in duration-500 max-w-[1600px] w-full mx-auto font-dm">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-6">Selecciona un Sorteo para ver sus Boletas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listaSorteos.map(s => (
            <div key={s.id} onClick={() => handleSelectSorteo(s)} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg cursor-pointer transition-all dark:bg-zinc-900 dark:border-white/10">
              <div className="h-32 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                <img src={s.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39'} className="w-full h-full object-cover" alt="portada" />
              </div>
              <h5 className="font-bold text-navy-700 dark:text-white text-lg">{s.title}</h5>
              <p className="text-sm text-gray-500">{s.cantidad} Boletas emitidas</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (

    <div className="animate-in fade-in duration-500 max-w-[1600px] w-full mx-auto font-dm">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT PANEL - TICKETS GRID */}
        <div className="xl:col-span-2 space-y-6">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <button onClick={() => setVista('lista')} className="text-sm font-bold text-brand-500 hover:underline mb-1 inline-block">&larr; Volver a Sorteos</button>
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">Panel de Boletas</h4>
                <p className="text-sm font-medium text-gray-500 mt-1">Sorteo: {sorteo.titulo}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <Icons.Search />
                  </div>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar boleta..." className="block w-full rounded-xl border-none bg-lightPrimary dark:bg-zinc-800 py-2.5 pl-10 pr-4 text-sm font-medium text-navy-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Libres</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Apartadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4318FF] dark:bg-[#6AD2FF]"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Pagadas</span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredTickets.map(t => {
                  const isSelected = displayTicket && displayTicket.num === t.num;
                  
                  let baseStyle = "flex flex-col items-center justify-center rounded-xl py-2 px-1 cursor-pointer transition-all border-2 text-center h-16 relative overflow-hidden";
                  let colorStyle = "";
                  
                  if (t.state === 'Pagada') {
                    colorStyle = isSelected 
                      ? "bg-[#4318FF] dark:bg-[#6AD2FF] border-[#4318FF] dark:border-[#6AD2FF] text-white shadow-lg shadow-[#4318FF]/30 scale-105" 
                      : "bg-[#4318FF]/10 border-transparent hover:bg-[#4318FF]/20 dark:bg-[#6AD2FF]/10 dark:hover:bg-[#6AD2FF]/20";
                  } else if (t.state === 'Apartada') {
                    colorStyle = isSelected 
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105" 
                      : "bg-amber-50 border-transparent hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20";
                  } else {
                    colorStyle = isSelected 
                      ? "bg-gray-800 border-gray-800 text-white shadow-lg shadow-gray-800/30 scale-105 dark:bg-white dark:border-white dark:text-black" 
                      : "bg-gray-50 border-gray-100 hover:border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:border-white/5 dark:hover:border-white/20 text-navy-700 dark:text-white";
                  }

                  return (
                    <div key={t.num} onClick={() => setSelectedTicket(t)} className={`${baseStyle} ${colorStyle}`}>
                      <span className={`text-sm font-bold ${isSelected ? (t.state === 'Libre' ? 'dark:text-black text-white' : 'text-white') : (t.state === 'Pagada' ? 'text-[#4318FF] dark:text-[#6AD2FF]' : (t.state === 'Apartada' ? 'text-amber-500' : 'text-gray-500'))}`}>
                        #{t.num}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - TICKET DETAILS */}
        <div className="xl:col-span-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6 sticky top-6">
            
      {/* EMAIL PREVIEW MODAL (NUEVO DISEÑO AMARILLO OFICIAL) */}
      {showEmailPreview && displayTicket && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-[550px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] bg-[#f5f5f5]">
            
            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Vista Previa del Correo Oficial
              </h3>
              <button onClick={() => setShowEmailPreview(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Icons.X />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-[#f5f5f5] font-sans p-4">
              
              {/* Header Amarillo Oficial */}
              <div className="bg-[#eab308] rounded-t-[30px] p-[30px] text-center relative overflow-hidden">
                <img
                  src="/logo_Negroo_Final.png?v=3"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://sodarasorteosyrifas.com/logo_Negroo_Final.png?v=3"; }}
                  className="max-h-[90px] rounded-xl mx-auto block"
                  alt="Sodara Logo"
                />
              </div>

              {/* White Greeting */}
              <div className="bg-white px-[30px] pt-[30px] pb-[10px] text-left">
                <h1 className="text-[26px] font-extrabold text-[#111] m-0 mb-[10px]">✨ ¡QUE EMPIECE LA EMOCIÓN! 🍀</h1>
                <p className="text-[15px] text-[#666] m-0 leading-relaxed">
                  Hola <strong>{displayTicket.owner}</strong>, tus números ya están listos para entrar en juego:
                </p>
              </div>

              {/* Ticket Box */}
              <div className="bg-white px-[30px] pb-[25px] pt-[15px]">
                <div className="bg-[#f8f9fa] border border-[#eee] rounded-xl px-[20px] py-[15px] mb-[10px]">
                  <span className="text-[18px] font-extrabold text-[#111]">🎟️ #{displayTicket.num}</span>
                </div>
                <p className="text-[#111] font-bold mt-[20px] text-[16px]">🎯 Tu participación está confirmada.</p>
              </div>

              <div className="pt-[20px]">
                {/* Summary Card */}
                <div className="bg-white rounded-[20px] p-[30px] mb-[20px] shadow-sm">
                  <h2 className="text-[18px] font-extrabold text-[#111] m-0 mb-[20px]">Resumen de tu compra</h2>
                  
                  <div className="flex justify-between mb-[15px] text-[13px]">
                    <span className="text-[#888]">Sorteo</span>
                    <span className="text-[#111] font-bold">{sorteo?.titulo}</span>
                  </div>
                  <div className="flex justify-between mb-[15px] text-[13px]">
                    <span className="text-[#888]">Referencia</span>
                    <span className="text-[#111] font-bold">{displayTicket.raw?.referencia || ('ORD-' + (displayTicket.raw?.id || displayTicket.num))}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#888]">Estado</span>
                    <span className="text-[#111] font-bold">Pagado y Confirmado</span>
                  </div>

                  <div className="mt-[25px] text-[15px] text-[#555] leading-relaxed space-y-3">
                    <p>Ahora viene esa parte emocionante...<br/>imaginar que uno de tus números podría ser el ganador. ✨</p>
                    <p>Cruza los dedos 🤞🏼, confía en tu suerte y prepárate para vivir la emoción de SODARA.</p>
                    <p>🍀 Porque nunca sabes cuándo un número puede llevarte a un gran premio.</p>
                    <p>Gracias por elegirnos y ser parte de esta experiencia. 🎉</p>
                    <p className="font-extrabold text-[#111] text-[18px] text-center pt-3">✨ ¡MUCHÍSIMA SUERTE! ✨</p>
                  </div>

                  <a href="https://sodarasorteosyrifas.com" target="_blank" rel="noreferrer" className="block w-full bg-[#eab308] text-[#111] font-extrabold text-[15px] py-[16px] rounded-[30px] mt-[25px] text-center hover:bg-[#facc15] transition-colors">
                    Ir a la tienda
                  </a>
                </div>

                <div className="text-center py-[15px]">
                  <p className="text-[#999] text-[12px] mb-[12px]">Para dudas o soporte, contáctanos a info@sodarasorteosyrifas.com</p>
                  <h3 className="text-[#111] text-[17px] font-black m-0">SODARA — La emoción de ganar.</h3>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center gap-3 shrink-0">
              <span className="text-xs text-gray-500 truncate">
                {displayTicket.raw?.email ? `Destino: ${displayTicket.raw.email}` : 'Sin correo registrado (se pedirá al enviar)'}
              </span>
              <div className="flex gap-3">
                <button onClick={() => setShowEmailPreview(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cerrar
                </button>
                <button 
                  disabled={sendingEmail}
                  onClick={() => handleEnviarCorreoReal(displayTicket)} 
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#111] text-white hover:bg-black transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  {sendingEmail ? 'Enviando...' : 'Enviar Correo Real'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {displayTicket ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-navy-700 dark:text-white uppercase tracking-wider">Detalles del Boleto</h4>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lightPrimary text-brand-500 dark:bg-zinc-800 dark:text-white">
                  <Icons.Shield />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-4xl font-bold text-navy-700 dark:text-white">#{displayTicket.num}</h1>
                {displayTicket.state === 'Pagada' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 text-xs font-bold text-emerald-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Pagada & Auditada
                  </span>
                )}
                {displayTicket.state === 'Apartada' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 px-3 py-1 text-xs font-bold text-amber-500">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> Pendiente Pago
                  </span>
                )}
                {displayTicket.state === 'Libre' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-black px-3 py-1 text-xs font-bold text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div> Disponible
                  </span>
                )}
              </div>

              {displayTicket.state !== 'Libre' ? (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-lightPrimary dark:bg-black p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4318FF] text-white font-bold shadow-md text-lg">
                        {displayTicket.initial}
                      </div>
                      <div>
                        <p className="text-base font-bold text-navy-700 dark:text-white">{displayTicket.owner}</p>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Icons.WhatsApp /> {displayTicket.raw?.telefono || "N/A"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const tel = (displayTicket.raw?.telefono || '').replace(/\D/g, '');
                        if (tel) window.open(`https://wa.me/57${tel}?text=${encodeURIComponent(`Hola ${displayTicket.owner}, te escribimos de Sodara Sorteos respecto a tu boleta #${displayTicket.num}`)}`, '_blank');
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-brand-500 shadow-sm transition-all hover:scale-105"
                      title="Escribir por WhatsApp"
                    >
                      <Icons.MessageSquare />
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                      <span className="text-sm font-medium text-gray-500">Sorteo</span>
                      <span className="text-sm font-bold text-navy-700 dark:text-white">{sorteo.titulo}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                      <span className="text-sm font-medium text-gray-500">Valor pagado</span>
                      <span className="text-sm font-bold text-emerald-500">{new Intl.NumberFormat("es-CO", {style: "currency", currency: "COP", maximumFractionDigits: 0}).format(sorteo.precio)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                      <span className="text-sm font-medium text-gray-500">Método de pago</span>
                      <span className="text-sm font-bold text-navy-700 dark:text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#4318FF]"></div> {displayTicket.state}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                      <span className="text-sm font-medium text-gray-500">Fecha de compra</span>
                      <span className="text-sm font-medium text-navy-700 dark:text-white">{displayTicket.raw?.fecha || "N/A"}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-sm font-medium text-gray-500">Boletas vinculadas</span>
                      <span className="text-sm font-bold text-brand-500">#{displayTicket.num}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowEmailPreview(true)} className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition-all hover:bg-brand-600 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> 
                      Ver / Enviar comprobante por Correo
                    </button>
                    <button
                      disabled={liberando}
                      onClick={() => handleLiberarBoleta(displayTicket)}
                      className="flex-1 rounded-xl bg-red-50 dark:bg-red-900/20 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Icons.X /> {liberando ? 'Liberando...' : `Liberar #${displayTicket.num}`}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                    <Icons.Check />
                  </div>
                  <h5 className="text-lg font-bold text-navy-700 dark:text-white mb-2">Boleto Disponible</h5>
                  <p className="text-sm font-medium text-gray-500 mb-6">Este boleto aún no ha sido reservado ni pagado por ningún cliente.</p>
                  
                  <button className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition-all hover:bg-brand-600 shadow-lg shadow-brand-500/30">
                    Asignar Manualmente
                  </button>
                </div>
              )}
            </div>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBoletas;
