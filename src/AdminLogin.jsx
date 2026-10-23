import React, { useState } from 'react';

const AdminLogin = ({ onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const manejarIngreso = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const correo = e.target[0].value;
    const password = e.target[1].value;

    try {
      const response = await fetch('https://sodarasorteosyrifas.com/backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        onLogin();
      } else {
        setErrorMsg(data.message || 'Error en login');
      }
    } catch (err) {
      setErrorMsg('Error de red al intentar iniciar sesión.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-lightPrimary dark:bg-black font-dm transition-colors duration-200">
      
      

      {/* Contenedor Principal */}
      <div className="flex w-full">
        {/* Lado Izquierdo (Formulario Horizon Style) */}
        <div className="flex h-full w-full items-center justify-center px-4 md:w-1/2 lg:w-5/12">
          <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <div className="mb-8 flex justify-center w-full">
                <img src="https://sodarasorteosyrifas.com/logo_Negroo_Final.png" alt="Sodara Logo" className="h-24 md:h-32 rounded-2xl object-contain drop-shadow-md" />
              </div>
              <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Iniciar Sesión
            </h4>
            <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
              Ingresa tu correo y contraseña para acceder al panel.
            </p>

            {/* Notificación de Error */}
            {errorMsg && (
              <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 border border-red-200 dark:border-red-500/20 flex items-start animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-200">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={manejarIngreso}>
              {/* Email */}
              <div className="mb-3">
                <label className="text-sm text-navy-700 dark:text-white font-bold ml-1.5 mb-1 block">Correo*</label>
                <input
                  type="email"
                  placeholder="admin@ejemplo.com"
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 text-navy-700 dark:text-white focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3 relative">
                <label className="text-sm text-navy-700 dark:text-white font-bold ml-1.5 mb-1 block">Contraseña*</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 caracteres"
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 pr-12 text-sm outline-none border-gray-200 dark:border-white/10 text-navy-700 dark:text-white focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3 right-4 text-gray-400 hover:text-brand-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </div>

              {/* Checkbox & Forgot */}
              <div className="mb-4 flex items-center justify-between px-2">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:checked:bg-brand-500 transition-all" />
                  <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">Recordarme</p>
                </label>
                <a className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors" href="#">
                  ¿Olvidaste la clave?
                </a>
              </div>
              
              <button type="submit" className="mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-bold text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 shadow-md shadow-brand-500/20">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>

        {/* Lado Derecho (Imagen / Color Sólido) */}
        <div className="hidden h-full w-1/2 md:flex lg:w-7/12 items-center justify-center bg-brand-500 dark:bg-brand-400 rounded-bl-[120px] relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
           <div className="relative z-10 text-center px-12">
             <h2 className="text-4xl font-bold text-white mb-4">Sodara Admin Panel</h2>
             <p className="text-white/80 font-medium text-lg">Gestiona todos tus sorteos, clientes y finanzas desde un único lugar seguro.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
