import React, { useState, useEffect } from 'react';

const Icons = {
  HeartOutline: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  HeartSolid: () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Add: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
};

const SorteoCard = ({ sorteo, onEdit, onDelete, onToggle }) => {
  const [heart, setHeart] = useState(false);
  return (
    <div className="relative flex flex-col rounded-[20px] bg-white shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:text-white dark:shadow-none p-4 w-full h-full">
      <div className="h-full w-full flex flex-col">
        <div className="relative w-full">
          {sorteo.image ? (
            <img src={sorteo.image} alt={sorteo.title} className="mb-3 h-48 w-full rounded-xl object-cover shadow-md" />
          ) : (
            <div className={`mb-3 h-48 w-full rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-navy-700 dark:to-navy-900 shadow-md`} />
          )}
          <button
            onClick={() => setHeart(!heart)}
            className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer shadow-sm"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full hover:bg-gray-50 dark:text-navy-900">
              {heart ? <Icons.HeartSolid /> : <Icons.HeartOutline />}
            </div>
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between px-1">
          <div className="mb-2 w-full">
            <p className="text-lg font-bold text-navy-700 dark:text-white truncate" title={sorteo.title}>{sorteo.title}</p>
            <p className="mt-1 text-sm font-medium text-gray-600">Boletas: {sorteo.cantidad}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <p className="mb-1 text-sm font-bold text-brand-500 dark:text-white">
              Premio: {sorteo.price}
            </p>
            {(sorteo.startDate && sorteo.endDate) && (
              <p className="text-xs text-gray-400">
                {sorteo.startDate} - {sorteo.endDate}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
              <button onClick={() => onToggle(sorteo.id, (sorteo.estado || 'activo') === 'activo' ? 'inactivo' : 'activo')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${(sorteo.estado || 'activo') === 'activo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'}`}>
                {(sorteo.estado || 'activo') === 'activo' ? '👁 Activo' : '🙈 Oculto'}
              </button>
              <button onClick={() => onDelete(sorteo.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
                <Icons.Trash />
              </button>
              <button onClick={() => onEdit(sorteo)} className="linear rounded-xl bg-brand-900 px-3 py-1.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90">
                Editar
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const MiniCalendar = ({ activeRanges }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getActiveSorteo = (day) => {
    return activeRanges.find(range => day >= range.start && day <= range.end);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="relative flex w-full flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:text-white dark:shadow-none p-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
        </h4>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full bg-lightPrimary text-brand-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-white/20">
            <Icons.ChevronLeft />
          </button>
          <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full bg-lightPrimary text-brand-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-white/20">
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
          <div key={day} className="text-sm font-bold text-gray-400">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 w-full"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const activeSorteo = getActiveSorteo(day);
          const isActive = !!activeSorteo;
          return (
            <div key={day} className="flex h-10 w-full items-center justify-center group relative">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                isActive 
                  ? 'text-brand-500 bg-brand-50 dark:bg-brand-400/10 shadow-sm cursor-pointer border border-brand-200' 
                  : 'text-navy-700 dark:text-white hover:bg-lightPrimary dark:hover:bg-zinc-800'
              }`}>
                {day}
              </div>
              {isActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 w-48 bg-white dark:bg-navy-800 rounded-xl shadow-2xl p-2 border border-gray-100 dark:border-white/10">
                  {activeSorteo.image && <img src={activeSorteo.image} className="w-full h-24 object-cover rounded-lg mb-2" />}
                  <span className="text-xs font-bold text-navy-700 dark:text-white text-center truncate w-full">{activeSorteo.title}</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-navy-800"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TaskCard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Subir banners del nuevo sorteo", checked: false },
    { id: 2, text: "Contactar ganador Moto Yamaha", checked: false },
    { id: 3, text: "Actualizar política de términos", checked: true },
    { id: 4, text: "Revisar pagos en tránsito", checked: false }
  ]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, checked: false }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="relative flex flex-col rounded-[20px] bg-white shadow-3xl shadow-shadow-500 dark:bg-zinc-900 dark:text-white dark:shadow-none p-6 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lightPrimary text-brand-500 dark:bg-zinc-800 dark:text-white">
            <Icons.Check />
          </div>
          <h2 className="text-lg font-bold text-navy-700 dark:text-white">Tareas Rápidas</h2>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Nueva tarea..." 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTask(e);
          }}
          className="flex-1 rounded-xl bg-lightPrimary px-4 py-2 text-sm text-navy-700 outline-none dark:bg-black dark:text-white border-none"
        />
        <button type="button" onClick={handleAddTask} className="rounded-xl bg-brand-500 p-2 text-white hover:bg-brand-600 transition-colors">
          <Icons.Add />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map(task => (
          <div key={task.id} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={task.checked}
                onChange={() => toggleTask(task.id)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:checked:bg-brand-500"
              />
              <p className={`text-base font-bold text-navy-700 dark:text-white ${task.checked ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                {task.text}
              </p>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
  
const TabSorteos = () => {
  const [sorteos, setSorteos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSorteos = async () => {
    try {
      const res = await fetch('https://sodarasorteosyrifas.com/backend/obtener_sorteos.php?t=' + Date.now());
      const data = await res.json();
      if (data.status === 'success') {
        setSorteos(data.data);
      }
    } catch (error) {
      console.error('Error fetching sorteos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSorteos();
  }, []);

  const activeRanges = sorteos
    .filter(s => s.endDate)
    .map(s => {
      const endDay = parseInt(s.endDate.split('-')[2]);
      return {
        start: endDay,
        end: endDay,
        title: s.title,
        image: s.image
      };
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSorteo, setEditingSorteo] = useState(null);
  
  const getCombosPorDefecto = (precioBase = 1000) => {
    const p = parseFloat(precioBase) || 1000;
    return [
      { cantidad: 5, precio: 5 * p, subtitulo: 'Boletas al azar', destacado: false },
      { cantidad: 15, precio: 15 * p, subtitulo: 'Máxima suerte', destacado: true },
      { cantidad: 30, precio: 30 * p, subtitulo: 'Gran inversión', destacado: false }
    ];
  };

  const [formData, setFormData] = useState({
    title: '', price: '', cantidad: '', image: '', startDate: '', endDate: '',
    combos: getCombosPorDefecto(1000)
  });
  const [fileToUpload, setFileToUpload] = useState(null);

  const openCreate = () => {
    setEditingSorteo(null);
    setFormData({
      title: '', price: '', cantidad: '', image: '', startDate: '', endDate: '',
      combos: getCombosPorDefecto(1000)
    });
    setFileToUpload(null);
    setIsModalOpen(true);
  };

  const openEdit = (sorteo) => {
    setEditingSorteo(sorteo);
    const combosIniciales = Array.isArray(sorteo.combos)
      ? sorteo.combos.map(c => ({
          cantidad: Number(c.cantidad) || 5,
          precio: Number(c.precio) || (Number(c.cantidad || 5) * (parseFloat(sorteo.price) || 1000)),
          subtitulo: c.subtitulo ?? 'Boletas al azar',
          destacado: Boolean(c.destacado)
        }))
      : getCombosPorDefecto(sorteo.price);

    setFormData({
      title: sorteo.title,
      price: sorteo.price,
      cantidad: sorteo.cantidad,
      image: sorteo.image,
      startDate: sorteo.startDate || '',
      endDate: sorteo.endDate || '',
      combos: combosIniciales
    });
    setFileToUpload(null);
    setIsModalOpen(true);
  };

  const handlePriceChange = (nuevoPrecioStr) => {
    const viejoPrecio = parseFloat(formData.price) || 1000;
    const nuevoPrecio = parseFloat(nuevoPrecioStr) || 0;
    const nuevosCombos = (formData.combos || []).map(c => {
      // Si el precio del combo era exactamente cantidad * viejoPrecio, actualizarlo automáticamente
      if (nuevoPrecio > 0 && Math.abs((Number(c.precio) || 0) - (Number(c.cantidad) * viejoPrecio)) < 1) {
        return { ...c, precio: Number(c.cantidad) * nuevoPrecio };
      }
      return c;
    });
    setFormData({ ...formData, price: nuevoPrecioStr, combos: nuevosCombos });
  };

  const handleAddCombo = () => {
    const p = parseFloat(formData.price) || 1000;
    const nuevaCant = 10;
    setFormData({
      ...formData,
      combos: [
        ...(formData.combos || []),
        { cantidad: nuevaCant, precio: nuevaCant * p, subtitulo: 'Boletas al azar', destacado: false }
      ]
    });
  };

  const handleRemoveCombo = (idx) => {
    setFormData({
      ...formData,
      combos: (formData.combos || []).filter((_, i) => i !== idx)
    });
  };

  const handleUpdateCombo = (idx, field, value) => {
    const p = parseFloat(formData.price) || 1000;
    const actualizados = (formData.combos || []).map((c, i) => {
      if (i !== idx) return c;
      if (field === 'cantidad') {
        const cantNum = parseInt(value, 10) || 0;
        const eraAuto = Math.abs((Number(c.precio) || 0) - ((Number(c.cantidad) || 0) * p)) < 1;
        return {
          ...c,
          cantidad: value,
          precio: eraAuto ? cantNum * p : c.precio
        };
      }
      return { ...c, [field]: value };
    });
    setFormData({ ...formData, combos: actualizados });
  };

  const handleToggle = async (id, nuevoEstado) => {
    try {
      setSorteos(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
      const formData = new FormData();
      formData.append('id', id);
      formData.append('estado', nuevoEstado);
      const res = await fetch('https://sodarasorteosyrifas.com/backend/cambiar_estado_sorteo.php', {
        method: 'POST',
        body: formData
      });
      // Ya no hacemos fetchSorteos() aqui para evitar que parpadee si el servidor tarda en refrescar cache
    } catch (error) {}
  };

  const handleDeleteSorteo = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar definitivamente este sorteo? Si tenía boletas vendidas o pagos registrados, también serán eliminados del sistema.')) return;
    try {
      const res = await fetch('https://sodarasorteosyrifas.com/backend/eliminar_sorteo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchSorteos();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error de red al eliminar');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const combosLimpios = (formData.combos || [])
      .filter(c => Number(c.cantidad) > 0)
      .map(c => ({
        cantidad: Number(c.cantidad),
        precio: Number(c.precio) || 0,
        subtitulo: String(c.subtitulo || 'Boletas al azar').trim(),
        destacado: Boolean(c.destacado)
      }));

    if (editingSorteo) {
      const fd = new FormData();
      fd.append('id', editingSorteo.id);
      fd.append('nombre', formData.title);
      fd.append('precio', formData.price);
      fd.append('cantidad', formData.cantidad);
      fd.append('fecha_inicio', formData.startDate || '');
      fd.append('fecha_fin', formData.endDate || '');
      fd.append('combos', JSON.stringify(combosLimpios));
      if (fileToUpload) {
        fd.append('foto', fileToUpload);
      }
      fetch('https://sodarasorteosyrifas.com/backend/editar_sorteo.php', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(data => {
          if (data.status === 'success') {
            setSorteos(sorteos.map(s => s.id === editingSorteo.id ? { ...s, ...formData, combos: combosLimpios, image: data.fotoUrl || s.image } : s));
            setIsModalOpen(false);
            setIsSubmitting(false);
          } else {
            alert('Error: ' + data.message);
            setIsSubmitting(false);
          }
        })
        .catch(() => {
          alert('Error de red');
          setIsSubmitting(false);
        });
    } else {
      const fd = new FormData();
      fd.append('nombre', formData.title);
      fd.append('precio', formData.price);
      fd.append('cantidad', formData.cantidad);
      fd.append('fecha', formData.endDate || formData.startDate || '');
      fd.append('combos', JSON.stringify(combosLimpios));
      if (fileToUpload) {
        fd.append('foto', fileToUpload);
      }

      try {
        const res = await fetch('https://sodarasorteosyrifas.com/backend/crear_sorteo.php', {
          method: 'POST',
          body: fd
        });
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data.status === 'success') {
            fetchSorteos();
            setIsModalOpen(false);
            setIsSubmitting(false);
          } else {
            alert('Error creando sorteo: ' + data.message);
            setIsSubmitting(false);
          }
        } catch (e) {
          console.error('Respuesta cruda del servidor:', text);
          alert('Error del servidor: ' + text.substring(0, 150));
          setIsSubmitting(false);
        }
      } catch (err) {
        alert('Error de conexión al crear sorteo.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3 font-dm relative">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        
        <div className="mb-4 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Sorteos Activos
          </h4>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <button onClick={openCreate} className="linear flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2 text-sm font-bold text-white transition duration-200 hover:bg-navy-800 dark:bg-brand-500 dark:hover:bg-brand-400">
              <Icons.Add /> Crear Sorteo
            </button>
          </div>
        </div>

        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Cargando sorteos...</p>
          ) : sorteos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No hay sorteos creados. Haz clic en 'Crear Sorteo'.</p>
          ) : (
            sorteos.map(s => <SorteoCard key={s.id} sorteo={s} onEdit={openEdit} onDelete={handleDeleteSorteo} onToggle={handleToggle} />)
          )}
        </div>
      </div>

      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1 flex flex-col gap-5">
        <MiniCalendar activeRanges={activeRanges} />
        <TaskCard />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-navy-900/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-2xl rounded-[20px] bg-white dark:bg-zinc-900 p-6 shadow-3xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} type="button" className="absolute right-4 top-4 text-gray-500 hover:text-navy-700 dark:text-white dark:hover:text-gray-300">
              <Icons.Close />
            </button>
            <h3 className="text-xl font-bold text-navy-700 dark:text-white mb-6">
              {editingSorteo ? 'Editar Sorteo' : 'Crear Nuevo Sorteo'}
            </h3>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Portada del Sorteo</label>
                <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    {formData.image ? (
                      <div className="mb-4 relative group">
                        <img src={formData.image} alt="Preview" className="mx-auto h-32 w-auto rounded-lg object-cover shadow" />
                      </div>
                    ) : (
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-black mb-4 text-gray-500">
                        <Icons.Upload />
                      </div>
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-brand-500 hover:text-brand-600">
                        <span>Sube una foto</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG, WEBP (Max 10MB)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Nombre del Sorteo</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-transparent p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white focus:border-brand-500" placeholder="Ej. Yamaha MT-09 2026" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-navy-700 dark:text-white">Precio de Boleta</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => handlePriceChange(e.target.value)} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-transparent p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white focus:border-brand-500" placeholder="Ej. 1000" />
                </div>
                <div>
                  <label className="text-sm font-bold text-navy-700 dark:text-white">Cant. Boletas</label>
                  <input required type="number" value={formData.cantidad} onChange={e => setFormData({...formData, cantidad: e.target.value})} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-transparent p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white focus:border-brand-500" placeholder="Ej. 1000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-navy-700 dark:text-white">Fecha de Inicio</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-transparent p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-gray-400 focus:border-brand-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-navy-700 dark:text-white">Fecha Fin</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-transparent p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-gray-400 focus:border-brand-500" />
                </div>
              </div>

              {/* Editor Dinámico de Combos Rápidos */}
              <div className="mt-2 rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-gray-50/60 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-bold text-navy-700 dark:text-white block">
                      ⚡ Combos Rápidos ({(formData.combos || []).length})
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Agrega 2, 3, 8 o los combos que desees. Edita cantidad (x5), precio, texto y cuál es el más vendido.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCombo}
                    className="flex items-center gap-1 rounded-xl bg-brand-500 px-3 py-2 text-xs font-bold text-white hover:bg-brand-600 transition-colors shrink-0 cursor-pointer"
                  >
                    + Agregar Combo
                  </button>
                </div>

                {(formData.combos || []).length === 0 ? (
                  <p className="text-xs text-center py-4 text-gray-500">
                    Sin combos rápidos. Haz clic en "+ Agregar Combo" para añadir uno.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
                    {(formData.combos || []).map((combo, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center rounded-xl bg-white dark:bg-zinc-900 p-3 border border-gray-200 dark:border-white/10 shadow-sm">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Boletas (x)</label>
                          <div className="flex items-center rounded-lg border border-gray-200 dark:border-white/10 px-2 h-9">
                            <span className="text-xs font-black text-gray-400 mr-1">x</span>
                            <input
                              type="number"
                              min="1"
                              value={combo.cantidad}
                              onChange={e => handleUpdateCombo(idx, 'cantidad', e.target.value)}
                              className="w-full bg-transparent text-sm font-bold outline-none dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Precio Combo ($)</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={combo.precio}
                            onChange={e => handleUpdateCombo(idx, 'precio', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-white/10 px-2.5 h-9 bg-transparent text-sm font-bold outline-none dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Subtítulo</label>
                          <input
                            type="text"
                            value={combo.subtitulo}
                            onChange={e => handleUpdateCombo(idx, 'subtitulo', e.target.value)}
                            placeholder="Ej. Boletas al azar"
                            className="w-full rounded-lg border border-gray-200 dark:border-white/10 px-2.5 h-9 bg-transparent text-xs font-medium outline-none dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex flex-col items-center justify-center">
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Más vendido</label>
                          <input
                            type="checkbox"
                            checked={Boolean(combo.destacado)}
                            onChange={e => handleUpdateCombo(idx, 'destacado', e.target.checked)}
                            className="h-4 w-4 accent-brand-500 cursor-pointer"
                            title="Destacar como 'EL MÁS VENDIDO'"
                          />
                        </div>

                        <div className="sm:col-span-1 flex justify-end items-center pt-3 sm:pt-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveCombo(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar este combo"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed  rounded-xl bg-brand-500 py-3 text-base font-bold text-white transition duration-200 hover:bg-brand-600 active:scale-[0.98] shadow-md shadow-brand-500/20">
                {editingSorteo ? 'Guardar Cambios' : 'Subir Sorteo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSorteos;
