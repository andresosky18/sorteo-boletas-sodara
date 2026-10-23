import React, { useState, useEffect } from 'react';

const Icons = {
  Chat: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Ticket: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Warning: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  Trash: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
};

const STORAGE_KEY = 'sodara_support_tickets_v1';

const obtenerFechaBogota = () => {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date());
  } catch (e) {
    return new Date().toLocaleString('es-CO');
  }
};

const TabSoporte = () => {
  const [urgencia, setUrgencia] = useState('NORMAL');
  const [modulo, setModulo] = useState('Consulta general');
  const [descripcion, setDescripcion] = useState('');
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets]);

  // Número exclusivo para Soporte Técnico desde el panel Admin (3142595669)
  const numeroSoporte = "573142595669";

  const handleEnviarSoporte = (e) => {
    e.preventDefault();
    const detalleTexto = descripcion.trim() || 'Solicitud de soporte desde el panel administrador';
    const ticketId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaBogota = obtenerFechaBogota();

    const nuevoTicket = {
      id: ticketId,
      urgencia,
      modulo,
      descripcion: detalleTexto,
      fecha: fechaBogota,
      estado: 'Abierto'
    };

    setTickets(prev => [nuevoTicket, ...prev]);

    const mensajeBase = `*[TICKET #${ticketId} - PRIORIDAD ${urgencia}]*\n*Módulo:* ${modulo}\n*Fecha (Bogotá):* ${fechaBogota}\n*Detalle:* "${detalleTexto}"`;
    const linkWhatsApp = `https://wa.me/${numeroSoporte}?text=${encodeURIComponent(mensajeBase)}`;
    window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');
    setDescripcion('');
  };

  const toggleEstadoTicket = (id) => {
    setTickets(prev =>
      prev.map(t => t.id === id ? { ...t, estado: t.estado === 'Abierto' ? 'Resuelto' : 'Abierto' } : t)
    );
  };

  const eliminarTicket = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="grid h-full grid-cols-1 gap-5 xl:grid-cols-2 font-dm">
      <div className="flex flex-col gap-5">
        
        {/* Encabezado */}
        <div className="relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:shadow-none p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lightPrimary text-brand-500 dark:bg-zinc-800 dark:text-white">
              <Icons.Chat />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Centro de Soporte</h4>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Línea directa de soporte técnico (+57 314 259 5669).</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:shadow-none p-8">
          <form className="flex flex-col gap-6" onSubmit={handleEnviarSoporte}>
            
            {/* Prioridad */}
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white mb-3 block">1. Nivel de Prioridad</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['NORMAL', 'URGENTE', 'CRÍTICO'].map(lvl => (
                  <label key={lvl} className={`flex items-center justify-center py-3 rounded-xl cursor-pointer font-bold text-sm transition-all border-2 ${
                    urgencia === lvl 
                      ? 'border-brand-500 bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-white' 
                      : 'border-transparent bg-lightPrimary text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-white/5'
                  }`}>
                    <input type="radio" name="urgencia" className="hidden" value={lvl} onChange={() => setUrgencia(lvl)} />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>

            {/* Modulo */}
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white mb-3 block">2. ¿En dónde necesitas ayuda?</label>
              <select 
                className="w-full flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 text-navy-700 dark:text-white focus:border-brand-500 dark:bg-zinc-900"
                value={modulo} onChange={(e) => setModulo(e.target.value)}
              >
                <option value="Consulta general">Consulta general / Otra duda</option>
                <option value="Fallo en pasarela">Fallo en pasarela / Pagos</option>
                <option value="Error visual web">Error visual en la web</option>
                <option value="Sorteos">Configuración de sorteos</option>
              </select>
            </div>

            {/* Descripcion */}
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white mb-3 block">3. Describe el problema</label>
              <textarea 
                className="w-full flex rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 text-navy-700 dark:text-white focus:border-brand-500 min-h-[120px]"
                placeholder="Escribe los detalles aquí..." 
                value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="linear flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 cursor-pointer"
              >
                <Icons.Chat /> Enviar por WhatsApp y Crear Ticket
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Recomendaciones */}
        <div className="relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:shadow-none p-8">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-6 flex items-center gap-2">
            <Icons.Warning /> Antes de escribir
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3"><div className="text-brand-500"><Icons.Check /></div> <span>Para problemas con pagos, ten a la mano la <b>referencia del banco</b> o voucher.</span></li>
            <li className="flex items-start gap-3"><div className="text-brand-500"><Icons.Check /></div> <span>Si el problema es de un cliente específico, indica los <b>números de boleta</b> involucrados.</span></li>
            <li className="flex items-start gap-3"><div className="text-brand-500"><Icons.Check /></div> <span>La prioridad <b>Crítica</b> solo aplica si la página web entera está caída o no se puede comprar en absoluto.</span></li>
          </ul>
        </div>

        {/* Historial de Tickets */}
        <div className="relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:shadow-none p-8 h-full min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Historial de Tickets</h4>
            {tickets.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-300">
                {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
              </span>
            )}
          </div>

          {tickets.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-lightPrimary dark:bg-zinc-800 p-8">
              <div className="mb-2 text-gray-400 dark:text-gray-500"><Icons.Ticket /></div>
              <p className="text-lg font-bold text-navy-700 dark:text-white">No tienes tickets abiertos</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cualquier reporte enviado aparecerá registrado aquí al instante.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-lightPrimary/60 dark:bg-zinc-800/80 p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-navy-700 text-white dark:bg-white dark:text-zinc-900">
                        #{t.id}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        t.urgencia === 'CRÍTICO'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          : t.urgencia === 'URGENTE'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>
                        {t.urgencia}
                      </span>
                      <span className="text-xs font-bold text-navy-700 dark:text-gray-200">
                        {t.modulo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleEstadoTicket(t.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          t.estado === 'Resuelto'
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}
                        title="Haz clic para cambiar estado"
                      >
                        {t.estado}
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarTicket(t.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Eliminar ticket"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    {t.descripcion}
                  </p>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    📅 {t.fecha} (Hora Bogotá)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabSoporte;
