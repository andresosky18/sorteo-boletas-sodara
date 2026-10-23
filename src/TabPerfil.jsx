import React, { useState, useRef, useEffect } from 'react';

const TabPerfil = ({ onProfileUpdate }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('https://sodarasorteosyrifas.com/backend/obtener_perfil.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setNombre(data.data.nombre || 'Admin');
          setCorreo(data.data.email || ''); 
          if (data.data.foto_perfil && data.data.foto_perfil !== 'null' && data.data.foto_perfil.trim() !== '') {
            setProfileImage('https://sodarasorteosyrifas.com' + data.data.foto_perfil);
          } else {
            setProfileImage(null);
          }
        }
      })
      .catch(err => console.error('Error cargando perfil:', err));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    if (password) {
      formData.append('password', password);
    }
    if (fileInputRef.current.files[0]) {
      formData.append('foto', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch('https://sodarasorteosyrifas.com/backend/guardar_perfil.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if(data.status === 'success') {
        if (data.foto) {
          // El backend nos devuelve algo como /uploads/perfil_123.jpg
          setProfileImage('https://sodarasorteosyrifas.com' + data.foto);
        }
        if (onProfileUpdate) {
          onProfileUpdate();
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert('Error al guardar: ' + (data.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. ¿El servidor PHP está encendido?');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-[1000px] w-full mx-auto font-dm">
      <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none w-full p-8 mt-10">
        <h2 className="text-2xl font-bold text-navy-700 dark:text-white mb-6">Mi Perfil</h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shadow-xl border-4 border-white dark:border-navy-700">
              {profileImage ? (
                <img src={profileImage} alt="profile" onError={() => setProfileImage(null)} className="h-full w-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            <button onClick={() => fileInputRef.current.click()} className="text-sm font-bold text-brand-500 hover:text-brand-600 dark:text-white">Cambiar Foto</button>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Nombres</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Correo Electrónico</label>
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Contraseña Nueva</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="(Dejar en blanco si no cambia)" className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Confirmar Contraseña</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" placeholder="(Dejar en blanco si no cambia)" className="mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
            </div>
            
            <div className="pt-4 flex items-center gap-4">
              <button onClick={handleSave} className="linear rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700">
                Guardar Cambios
              </button>
              {isSaved && <span className="text-sm font-bold text-emerald-500 animate-in fade-in">¡Guardado exitosamente!</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabPerfil;

