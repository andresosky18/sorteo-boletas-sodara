import React, { useState, useEffect } from 'react';
import SorteoBoletas from './SorteoBoletas';
import BuscarBoleta from './BuscarBoleta';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

function App() {
  const [paginaCliente, setPaginaCliente] = useState('sorteo');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sodara_admin_logged_in') === 'true';
  });

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Bloquear F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Bloquear Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Windows/Linux) o Cmd+Option+I/J/C (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // Bloquear Ctrl+U (Ver código fuente)
      if ((e.ctrlKey || e.metaKey) && ['U', 'u'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleLogin = () => {
    localStorage.setItem('sodara_admin_logged_in', 'true');
    setIsAdminLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('sodara_admin_logged_in');
    setIsAdminLoggedIn(false);
  };
  
  const rutaActual = window.location.pathname;

  if (rutaActual === '/sodara-admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleLogin} onNavigate={() => window.location.href = '/'} />;
    }
    return <AdminDashboard onNavigate={handleLogout} />;
  }

  return (
    <>
      {paginaCliente === 'sorteo' && <SorteoBoletas onNavigate={setPaginaCliente} />}
      {paginaCliente === 'boletos' && <BuscarBoleta onNavigate={setPaginaCliente} />}
    </>
  );
}

export default App;

// Cache bust v9


// Cache bust v10


// Cache bust v11


// Cache bust v12


// Cache bust v13


// Cache bust v14


// Cache bust v16


// Cache bust v21


// Cache bust v23


// Cache bust v24


// Cache bust v25


// Cache bust v26


// Cache bust v27


// Cache bust v29


// Cache bust v30

