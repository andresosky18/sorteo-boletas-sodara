import React, { useState } from 'react';

const CheckoutModal = ({ isOpen, onClose, seleccionadas, sorteo, totalOverride, onSuccess, initialName, initialPhone }) => {
  const [formData, setFormData] = useState({
    nombre: initialName || '',
    telefono: initialPhone || '',
    cc: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  
  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, nombre: initialName || prev.nombre, telefono: initialPhone || prev.telefono }));
    }
  }, [isOpen, initialName, initialPhone]);


  if (!isOpen) return null;

  const total = (typeof totalOverride === 'number' && totalOverride > 0)
    ? totalOverride
    : seleccionadas.length * sorteo.precio;
  const totalCents = Math.round(total * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono' || name === 'cc') {
      // Solo permitir números (sin letras, espacios ni símbolos)
      const soloNumeros = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: soloNumeros });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!/^\d{6,12}$/.test(formData.cc)) {
      alert("Por favor ingresa un número de cédula válido (solo números, entre 6 y 12 dígitos).");
      return;
    }
    if (!/^\d{10}$/.test(formData.telefono)) {
      alert("Por favor ingresa un número de Celular / WhatsApp válido de 10 dígitos.");
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      alert("Por favor ingresa un correo electrónico válido (ejemplo: tu@correo.com).");
      return;
    }

    setLoading(true);

    // Guardar en la base de datos
    try {
      const response = await fetch('https://sodarasorteosyrifas.com/backend/procesar_checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sorteo_id: sorteo.id,
          boletas: seleccionadas,
          total: total
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Redirigir a Wompi
        const reference = data.referencia;
            const signature = data.signature; // Referencia unica generada por el backend
        const wompiPublicKey = 'pub_prod_fU37VIuvDm0DXqypBdL5wikGNYqroI8m';
        
        const checkout = new window.WidgetCheckout({
          currency: 'COP',
          amountInCents: totalCents,
          reference: reference,
          publicKey: wompiPublicKey,
          signature: { integrity: signature }
        });
        
        checkout.open(function (result) {
          if (result.transaction.status === 'APPROVED') {
            setLoading(false);
            
            fetch('https://sodarasorteosyrifas.com/backend/verificar_pago.php?id=' + result.transaction.id)
              .then(res => res.json())
              .then(() => onSuccess(result.transaction))
              .catch(() => onSuccess(result.transaction));

          } else {
            onSuccess('rechazado');
          }
        });
      } else {
        alert("Error al procesar: " + data.message);
        setLoading(false);
      }
    } catch (error) {
      alert("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Finalizar Compra</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
            <p className="text-sm font-semibold text-blue-800 mb-1">Resumen del pedido</p>
            <div className="flex justify-between items-end">
              <span className="text-xs text-blue-600 font-medium">{seleccionadas.length} boletas seleccionadas</span>
              <span className="text-2xl font-black text-blue-900">
                {new Intl.NumberFormat("es-CO", {style: "currency", currency: "COP", maximumFractionDigits: 0}).format(total)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {seleccionadas.map(num => (
                <span key={num} className="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded shadow-sm border border-blue-100">#{String(num).padStart(4, '0')}</span>
              ))}
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
              <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400" placeholder="Ej: Juan Pérez" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Cédula (CC)</label>
              <input required type="text" inputMode="numeric" pattern="[0-9]{6,12}" maxLength={12} name="cc" value={formData.cc} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400" placeholder="Ej: 1000123456 (Solo números)" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Celular / WhatsApp</label>
              <input required type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400" placeholder="Ej: 3001234567 (10 dígitos)" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400" placeholder="Ej: juan@correo.com" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button form="checkout-form" type="submit" disabled={loading} className="w-full bg-[#0010F7] hover:bg-[#000CD1] text-white font-bold text-lg py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Pagar con Wompi</>
            )}
          </button>
          <div className="text-center mt-3 flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Pagos 100% seguros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
