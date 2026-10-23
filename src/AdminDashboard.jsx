import React, { useState, useEffect, useRef } from 'react';
import TabDashboard from './TabDashboard';
import TabBoletas from './TabBoletas';
import TabClientes from './TabClientes';
import TabMovimientos from './TabMovimientos';
import TabSorteos from './TabSorteos';
import TabSoporte from './TabSoporte';
import TabPerfil from './TabPerfil';
import { Joyride, STATUS } from "react-joyride";

const Icons = {
  Home: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  BarChart: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Bell: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  PieChart: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  Box: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  LogOut: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Sun: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Menu: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Logo: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Info: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

const AdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  const tourSteps = [
    { target: '.tour-step-dashboard', content: 'Aquí verás un resumen financiero de tus ganancias y una lista de tareas personales.', disableBeacon: true },
    { target: '.tour-step-sorteos', content: 'Aquí puedes crear nuevas rifas, subir fotos y ocultarlas de tu tienda pública.' },
    { target: '.tour-step-boletos', content: 'Aquí controlas todos los números (Apartados y Pagados).' },
    { target: '.tour-step-clientes', content: 'Tu base de datos CRM. Cada persona que compre quedará guardada aquí.' },
    { target: '.tour-step-soporte', content: '¿Problemas? Envíanos un ticket por WhatsApp desde aquí y te ayudamos.' }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setIsTutorialOpen(false);
    }
  };
  
  
  const [profileData, setProfileData] = useState({
      nombre: 'Admin',
      foto: 'https://sodarasorteosyrifas.com/logo_Negroo_Final.png'
    });

  const fetchProfile = () => {
    fetch('https://sodarasorteosyrifas.com/backend/obtener_perfil.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProfileData({
            nombre: data.data.nombre || 'Admin',
            foto: data.data.foto_perfil && data.data.foto_perfil !== 'null' && data.data.foto_perfil.trim() !== '' ? 'https://sodarasorteosyrifas.com' + data.data.foto_perfil : 'https://sodarasorteosyrifas.com/logo_Negroo_Final.png'
          });
        }
      })
      .catch(err => console.error('Error:', err));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const NavButton = ({ id, label, Icon, className }) => {
    const isActive = activeTab === id;
    return (
      <li className={`my-1 w-full ${className || ''}`} onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}>
        <div className={`relative flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-4'} px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isActive ? 'bg-gray-100 dark:bg-white/5' : ''}`}>
          <div className={`flex items-center text-xl shrink-0 ${isActive ? 'text-brand-500 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            <Icon />
          </div>
          {!isSidebarCollapsed && (
            <p className={`text-sm font-medium ${isActive ? 'text-navy-700 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
              {label}
            </p>
          )}
        </div>
      </li>
    );
  };

  return (
    <>
      <Joyride 
        steps={tourSteps}
        run={isTutorialOpen}
        continuous={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{ options: { primaryColor: '#4318FF', zIndex: 10000, textColor: '#333' }, tooltipTitle: { color: '#000' } }}
      />
      <div className="flex min-h-screen w-full bg-lightPrimary dark:bg-black font-dm transition-colors duration-200">
      <div className="flex min-h-screen w-full relative">
        
        {/* SIDEBAR DUCK UI STYLE */}
        <aside className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white dark:bg-black shadow-xl dark:shadow-none transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'} ${isSidebarCollapsed ? 'w-[90px]' : 'w-[280px]'}`}>
          <div className={`mt-8 flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 pl-8 pr-4'}`}>
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-navy-900 dark:bg-brand-500 text-white shadow-md cursor-pointer" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <img src={profileData.foto} onError={(e) => { e.target.onerror = null; e.target.src="https://sodarasorteosyrifas.com/logo_Negroo_Final.png"; }} alt='logo' className='h-full w-full object-cover' />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="text-lg font-bold text-navy-700 dark:text-white tracking-tight">{profileData.nombre.includes('Duck') ? 'Sodara Admin' : profileData.nombre}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
              </div>
            )}
          </div>
          
          <div className={`mt-8 mb-4 ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
            <div className={`flex h-10 w-full items-center rounded-xl bg-lightPrimary text-navy-700 dark:bg-zinc-900/50 dark:text-white ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}>
              <Icons.Search />
              {!isSidebarCollapsed && (
                <input type="text" placeholder="Search..." className="ml-3 block h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400" />
              )}
            </div>
          </div>

          {!isSidebarCollapsed && <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-4"></div>}

          <ul className="mb-auto flex flex-col gap-1 w-full relative">
            <NavButton id="dashboard" className="tour-step-dashboard" label="Dashboard" Icon={Icons.Home} />
            <NavButton id="sorteos" className="tour-step-sorteos" label="Sorteos" Icon={Icons.Box} />
            <NavButton id="boletos" className="tour-step-boletos" label="Boletas" Icon={Icons.PieChart} />
            <NavButton id="clientes" className="tour-step-clientes" label="Clientes" Icon={Icons.BarChart} />
              <NavButton id="movimientos" className="tour-step-movimientos" label="Movimientos" Icon={Icons.PieChart} />
            <NavButton id="soporte" className="tour-step-soporte" label="Soporte" Icon={Icons.Bell} />
          </ul>

          <div className="mt-auto flex flex-col gap-2 pb-6">
            {!isSidebarCollapsed && <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-4 mx-4 w-[calc(100%-32px)]"></div>}
            
            <button onClick={() => { if (onNavigate) onNavigate(); else window.location.href = '/'; }} className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-4 px-6'} py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400 hover:text-navy-700 dark:hover:text-white`}>
              <Icons.LogOut />
              {!isSidebarCollapsed && <span className="text-sm font-medium">Salir</span>}
            </button>
            
            <div className={`flex items-center mt-2 ${isSidebarCollapsed ? 'justify-center flex-col gap-3 py-2' : 'justify-between px-6 py-3'}`}>
              <div className={`flex items-center gap-3 text-gray-500 dark:text-gray-400 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                {isDarkMode ? <Icons.Moon /> : <Icons.Sun />}
                <span className="text-sm font-medium">{isDarkMode ? 'Dark mode' : 'Light mode'}</span>
              </div>
              <div className="relative inline-block w-10 h-6 rounded-full cursor-pointer bg-[#c5b5f8] dark:bg-zinc-800 transition-colors shrink-0" onClick={toggleDarkMode}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'translate-x-4 bg-black dark:bg-white' : 'translate-x-0 bg-black dark:bg-white'}`}>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ÁREA CENTRAL */}
        <main className={`h-full flex-none transition-all duration-300 w-full ${isSidebarCollapsed ? 'xl:ml-[90px] xl:w-[calc(100%-90px)]' : 'xl:ml-[280px] xl:w-[calc(100%-280px)]'} relative`}>
          {isTutorialOpen && <div className="fixed inset-0 z-30 bg-black/60 pointer-events-auto animate-in fade-in" onClick={() => setIsTutorialOpen(false)}></div>}
          <div className="h-full">
            
            {/* TOP NAVBAR (MATCHING IMAGE) */}
            <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between mx-4 md:mx-6 mb-6 bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/20 dark:border-white/10 transition-all">
              <div className="ml-[6px]">
                <div className="h-6 w-[224px] pt-1">
                  <span className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white cursor-pointer">Páginas</span>
                  <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white"> / </span>
                  <span className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white">{activeTab}</span>
                </div>
                <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
                  <span className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">{activeTab}</span>
                </p>
              </div>

              {/* Exact Topbar Pill */}
              <div className="relative mt-[3px] flex h-[60px] flex-grow items-center justify-end gap-2 rounded-full bg-white dark:bg-zinc-900 shadow-xl shadow-shadow-500 dark:shadow-none px-2 py-2 md:flex-grow-0 xl:w-[400px] xl:gap-2">
                
                {/* Search in Topbar */}
                <div className="flex h-full flex-grow items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-black dark:text-white overflow-hidden px-4">
                  <span className="text-gray-400 dark:text-white"><Icons.Search /></span>
                  <input type="text" placeholder="Search..." className="ml-2 block h-full w-full bg-transparent text-sm font-medium text-navy-700 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-white" />
                </div>

                {/* Mobile Menu Icon */}
                <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden shrink-0 mx-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <Icons.Menu />
                </span>

                <div className="relative flex items-center justify-center">
                  <button onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsTutorialOpen(false); }} className="cursor-pointer text-gray-400 dark:text-white hover:text-brand-500 transition-colors shrink-0 mx-1">
                    <Icons.Bell />
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute top-12 -right-16 w-80 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-white/10 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
                        <h4 className="text-base font-bold text-navy-700 dark:text-white">Novedades</h4>
                        <span className="text-xs font-bold text-brand-500 bg-brand-50 dark:bg-black px-2 py-1 rounded-md">2 Nuevas</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-start cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors">
                          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0"><Icons.Home /></div>
                          <div>
                            <p className="text-sm font-bold text-navy-700 dark:text-white">¡¡Nuevo Dashboard!</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explora las nuevas estadísticas y el modo oscuro mejorado.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors">
                          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><Icons.Box /></div>
                          <div>
                            <p className="text-sm font-bold text-navy-700 dark:text-white">Ventas Exitosas</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">El sorteo de Yamaha MT-09 alcanzóóó las 10,000 boletas.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative flex items-center justify-center">
                  <button onClick={() => { setIsTutorialOpen(!isTutorialOpen); setIsNotificationsOpen(false); }} className={`cursor-pointer transition-colors shrink-0 mx-1 ${isTutorialOpen ? 'text-brand-500' : 'text-gray-400 dark:text-white hover:text-brand-500'}`}>
                    <Icons.Info />
                  </button>
                  
                </div>
                
                <button className="cursor-pointer text-gray-400 dark:text-white hover:text-brand-500 transition-colors shrink-0 mx-1" onClick={toggleDarkMode}>
                  <Icons.Moon />
                </button>

                {/* Topbar Profile Avatar */}
                <div onClick={() => setActiveTab('perfil')} className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer shrink-0 ml-1 overflow-hidden">
                  <img src={profileData.foto} onError={(e) => { e.target.onerror = null; e.target.src="https://sodarasorteosyrifas.com/logo_Negroo_Final.png"; }} alt="profile" className="h-full w-full object-cover" />
                </div>
              </div>
            </nav>

            {/* TAB CONTENT */}
            <div className="pt-2 mx-auto mb-auto h-full min-h-[84vh] p-4 max-w-[1600px]">
              {activeTab === 'dashboard' && <TabDashboard onNavigate={(tab) => setActiveTab(tab)} />}
              {activeTab === 'boletos' && <TabBoletas />}
              {activeTab === 'clientes' && <TabClientes />}
                {activeTab === 'movimientos' && <TabMovimientos />}
              {activeTab === 'sorteos' && <TabSorteos />}
              {activeTab === 'soporte' && <TabSoporte />}
              {activeTab === 'perfil' && <TabPerfil onProfileUpdate={fetchProfile} />}
            </div>

            {/* FOOTER */}
            <div className="p-3">
              <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
              </div>
            </div>

          </div>
        </main>

        {/* Overlay oscuro para móvil */}
        {isMobileMenuOpen && <div className="fixed inset-0 bg-navy-900/60 z-40 xl:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>}
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;

