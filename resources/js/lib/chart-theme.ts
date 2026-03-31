




export const getChartTheme = (isDark: boolean) => ({
  mode: isDark ? 'dark' : 'light' as const,
  palette: isDark ? 'palette4' : 'palette1',
  monochrome: {
    enabled: false,
  },
});


export const getChartColors = (isDark: boolean) => {
    const base = {
        primary: isDark ? '#60a5fa' : '#3b82f6', // blue-400 / blue-500
        success: isDark ? '#34d399' : '#10b981', // emerald-400 / emerald-500
        warning: isDark ? '#fbbf24' : '#f59e0b', // amber-400 / amber-500
        danger: isDark ? '#f87171' : '#ef4444', // red-400 / red-500
        info: isDark ? '#22d3ee' : '#06b6d4', // cyan-400 / cyan-500
        purple: isDark ? '#a78bfa' : '#8b5cf6', // violet-400 / violet-500
    };

    return {
    ...base,
    background: isDark ? '#1e293b' : '#ffffff', // slate-800 / white
    surface: isDark ? '#334155' : '#f8fafc', // slate-700 / slate-50
    text: isDark ? '#f1f5f9' : '#0f172a', // slate-100 / slate-900
    textMuted: isDark ? '#94a3b8' : '#64748b', // slate-400 / slate-500
    border: isDark ? '#475569' : '#e2e8f0', // slate-600 / slate-200
    grid: isDark ? '#334155' : '#e2e8f0',
  };
};


export const getBaseChartOptions = (isDark: boolean, title?: string) => {
  const colors = getChartColors(isDark);
  
  return {
    chart: {
      type: 'donut' as const,
      fontFamily: 'inherit',
      foreColor: colors.textMuted,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 300 },
    },
    theme: getChartTheme(isDark),
    colors: [colors.primary, colors.success, colors.warning, colors.danger, colors.info, colors.purple],
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              color: colors.textMuted,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text,
              offsetY: 10,
              formatter: (val: number) => val.toString(),
            },
            total: {
              show: true,
              label: title || 'Total',
              fontSize: '11px',
              fontWeight: 400,
              color: colors.textMuted,
              formatter: () => '',
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { show: false },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
      x: { show: false },
      y: {
        formatter: (val: number) => `${val} leads`,
        title: { formatter: () => '' },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: '100%' },
          plotOptions: { pie: { donut: { size: '65%' } } },
        },
      },
    ],
  };
};