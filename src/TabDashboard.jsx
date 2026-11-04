import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Icons = {
  BarChart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Document: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Wallet: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Calendar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  UpArrow: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  More: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

const Widget = ({ icon, title, subtitle }) => {
  return (
    <div className="!z-5 relative flex flex-row items-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-4 w-full">
      <div className="flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-zinc-800 ml-4">
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
        </div>
      </div>
      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {subtitle}
        </h4>
      </div>
    </div>
  );
};

const TabDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({ recaudado: 0, pagadas: 0, apartadas: 0, clientes: 0 });
  const [movimientos, setMovimientos] = useState([]);

  const [labelsMensual, setLabelsMensual] = useState(['MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT']);
  const [labelsSemanal, setLabelsSemanal] = useState(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']);
  const [labelsDias, setLabelsDias] = useState(['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Hoy']);

  const [chartData, setChartData] = useState({
    bar: [
      { name: 'Pagadas', data: [0, 0, 0, 0, 0, 0, 0], color: '#6AD2FF' },
      { name: 'Apartadas', data: [0, 0, 0, 0, 0, 0, 0], color: '#4318FF' }
    ],
    line: [
      { name: 'Recaudado ($ COP)', data: [0, 0, 0, 0, 0, 0], color: '#4318FF' }
    ],
    diario: [
      { name: 'Boletas del Día', data: [0, 0, 0, 0, 0, 0, 0], color: '#10B981' },
      { name: 'Compras / Clientes', data: [0, 0, 0, 0, 0, 0, 0], color: '#F59E0B' }
    ]
  });

  useEffect(() => {
    fetch('https://sodarasorteosyrifas.com/backend/dashboard_stats.php?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') {
          const d = data.data;
          setStats(d);

          if (d.mensual && Array.isArray(d.mensual.labels) && d.mensual.labels.length > 0) {
            setLabelsMensual(d.mensual.labels);
          }
          if (d.semanal && Array.isArray(d.semanal.labels) && d.semanal.labels.length > 0) {
            setLabelsSemanal(d.semanal.labels);
          }
          if (d.por_dias && Array.isArray(d.por_dias.labels) && d.por_dias.labels.length > 0) {
            setLabelsDias(d.por_dias.labels);
          }

          setChartData({
            bar: [
              {
                name: 'Pagadas',
                data: d.semanal?.pagadas || [0, 0, 0, 0, 0, 0, parseInt(d.pagadas) || 0],
                color: '#6AD2FF'
              },
              {
                name: 'Apartadas',
                data: d.semanal?.apartadas || [0, 0, 0, 0, 0, 0, parseInt(d.apartadas) || 0],
                color: '#4318FF'
              }
            ],
            line: [
              {
                name: 'Recaudado ($ COP)',
                data: d.mensual?.data || [0, 0, 0, 0, 0, parseInt(d.recaudado) || 0],
                color: '#4318FF'
              }
            ],
            diario: [
              {
                name: 'Boletas Movidas',
                data: d.por_dias?.boletas || [0, 0, 0, 0, 0, 0, (parseInt(d.pagadas) || 0) + (parseInt(d.apartadas) || 0)],
                color: '#10B981'
              },
              {
                name: 'Movimientos (Compras)',
                data: d.por_dias?.transacciones || [0, 0, 0, 0, 0, 0, 0],
                color: '#F59E0B'
              }
            ]
          });
        }
      });

    fetch('https://sodarasorteosyrifas.com/backend/obtener_movimientos.php?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') {
          setMovimientos(data.data);
        }
      });
  }, []);

  const lineChartOptionsTotalSpent = {
    legend: { show: false },
    chart: { type: 'line', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0)
      }
    },
    grid: { show: true, borderColor: 'rgba(163, 174, 208, 0.15)' },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '600' } },
      categories: labelsMensual
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: '#A3AED0', fontSize: '11px' },
        formatter: (val) => '$' + Math.round(val).toLocaleString('es-CO')
      }
    }
  };

  const barChartOptionsWeeklyRevenue = {
    chart: { stacked: true, toolbar: { show: false } },
    tooltip: { theme: 'dark' },
    xaxis: {
      categories: labelsSemanal,
      labels: { show: true, style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '600' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      show: true,
      labels: { style: { colors: '#A3AED0', fontSize: '11px' } }
    },
    grid: {
      borderColor: 'rgba(163, 174, 208, 0.2)',
      show: true,
      xaxis: { lines: { show: false } }
    },
    legend: { show: true, position: 'top', labels: { colors: '#A3AED0' } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '28px' } }
  };

  const areaChartOptionsDailyMovements = {
    chart: { type: 'area', toolbar: { show: false } },
    tooltip: { theme: 'dark' },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 95, 100] }
    },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: {
      categories: labelsDias,
      labels: { show: true, style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '600' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      show: true,
      labels: { style: { colors: '#A3AED0', fontSize: '11px' } }
    },
    grid: {
      borderColor: 'rgba(163, 174, 208, 0.2)',
      show: true,
      xaxis: { lines: { show: false } }
    },
    legend: { show: true, position: 'top', labels: { colors: '#A3AED0' } }
  };

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4">
        <Widget icon={<Icons.BarChart />} title="Dinero Recaudado" subtitle={new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(stats.recaudado)} />
        <Widget icon={<Icons.Document />} title="Boletas Pagadas" subtitle={stats.pagadas} />
        <Widget icon={<Icons.Wallet />} title="Boletas Apartadas" subtitle={stats.apartadas} />
        <Widget icon={<Icons.User />} title="Clientes" subtitle={stats.clientes || 0} />
      </div>

      <div className="mt-5 bg-white dark:bg-zinc-900 rounded-[20px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Últimos Movimientos</h4>
            <p className="text-sm text-gray-500">Registro agrupado por cliente • Hora Bogotá, Colombia</p>
          </div>
          <button onClick={() => onNavigate && onNavigate('movimientos')} className="text-brand-500 hover:text-brand-600 font-bold text-sm bg-brand-50 dark:bg-brand-400/10 px-4 py-2 rounded-lg transition-colors cursor-pointer">Ver más</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Cliente</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Fecha y Hora (Bogotá)</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Boletas Compradas</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">
                    No hay movimientos recientes hoy.
                  </td>
                </tr>
              ) : (
                movimientos.slice(0, 5).map((mov, i) => {
                  const listaBoletas = Array.isArray(mov.boletas) && mov.boletas.length > 0
                    ? mov.boletas
                    : String(mov.boleta || '').split(',').map(s => s.trim()).filter(Boolean);

                  return (
                    <tr key={i} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="py-4 pr-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0">
                            {mov.nombre ? mov.nombre.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-navy-700 dark:text-white">{mov.nombre}</p>
                            <p className="text-xs text-gray-500">{mov.telefono}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap align-top">
                        {mov.fecha}
                      </td>
                      <td className="py-4 pr-4 align-top max-w-[420px]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {listaBoletas.length > 1 && (
                            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 px-2 py-0.5 rounded text-[11px] font-extrabold mr-1">
                              {listaBoletas.length} boletas:
                            </span>
                          )}
                          {listaBoletas.map((num, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-bold">
                              #{String(num).padStart(4, '0')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 align-top">
                        {(mov.estado && (mov.estado.toLowerCase() === 'aprobado' || mov.estado.toLowerCase() === 'pagado' || mov.estado.toLowerCase() === 'approved')) ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <Icons.Check /> <span className="text-sm font-bold">Pagado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-orange-500">
                            <span className="text-sm font-bold">Pendiente</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6">
          <div className="mb-4">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Ingresos Mensuales</h4>
            <p className="text-xs text-gray-500">Histórico real de recaudación por mes</p>
          </div>
          <div className="h-[260px] w-full">
            <Chart options={lineChartOptionsTotalSpent} series={chartData.line} type="line" width="100%" height="100%" />
          </div>
        </div>
        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6">
          <div className="mb-4">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Boletas Semanales</h4>
            <p className="text-xs text-gray-500">Boletas pagadas vs. apartadas en los últimos 7 días</p>
          </div>
          <div className="h-[260px] w-full">
            <Chart options={barChartOptionsWeeklyRevenue} series={chartData.bar} type="bar" width="100%" height="100%" />
          </div>
        </div>
      </div>

      {/* Nuevo Gráfico: Movimientos por Días */}
      <div className="mt-5 rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-900 dark:text-white dark:shadow-none p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Movimientos por Días</h4>
            <p className="text-xs text-gray-500">Actividad diaria de boletas y compras registradas (Hora Bogotá)</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            Actualizado en tiempo real
          </span>
        </div>
        <div className="h-[280px] w-full">
          <Chart options={areaChartOptionsDailyMovements} series={chartData.diario} type="area" width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
};

export default TabDashboard;