export const translations = {
  en: {
    // Sidebar
    brandName: 'Time Control',
    profileRole: 'THE FINANCIAL ARCHITECT',
    navOverview: 'Overview',
    navLogs: 'Logs',
    navRates: 'Rates',
    navAnalytics: 'Analytics',
    proPlanTitle: 'PRO PLAN',
    proPlanDesc: 'Unlock advanced reporting and team tracking.',
    proPlanBtn: 'Upgrade Pro',
    support: 'Support',
    signOut: 'Sign Out',

    // Dashboard header
    greeting: '¡Hello Damián!',
    todayTarget: "TODAY'S TARGET",

    // Timer card
    statusRunning: 'CURRENTLY WORKING',
    statusPaused: 'PAUSED',
    statusIdle: 'IDLE',
    projectTitle: 'Financial Audit System',
    projectSubtitle: 'Design Strategy & Wireframing',
    taskProgress: 'TASK PROGRESS',
    addNote: 'Add Note',
    addNotePrompt: 'Enter or edit note for this record:',
    viewNoteTitle: 'View note',

    // Stats
    dailyProgress: 'Daily Progress',
    dailyProgressDesc: 'Summary of your current session and earnings',
    manualLoad: 'Manual Entry (Forgotten)',
    loadBtn: 'Load',
    registerNonWorking: 'Register non-working day',
    totalTime: 'TOTAL TIME',
    earnings: 'EARNINGS',
    rateLabel: 'Rate ($/hr):',
    historicalBal: 'HIST. BALANCE',
    extraLabel: 'Extra (h):',
    totalBtn: 'Total $',

    // Recent Activities
    recentActivities: 'Recent Activities',
    viewHistory: 'View History',
    viewLess: 'View Less',
    noActivity: 'No activity records yet.',
    activityLabel: (rec) => `Session: ${rec.totalTime} | Break: ${rec.pauseDuration} | Earnings: $ ${Number(rec.earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    deleteTitle: 'Delete record',
  },
  es: {
    // Sidebar
    brandName: 'Control de Horario',
    profileRole: 'EL ARQUITECTO FINANCIERO',
    navOverview: 'Resumen',
    navLogs: 'Registros',
    navRates: 'Tarifas',
    navAnalytics: 'Análisis',
    proPlanTitle: 'PLAN PRO',
    proPlanDesc: 'Desbloquea reportes avanzados y seguimiento de equipo.',
    proPlanBtn: 'Mejorar a Pro',
    support: 'Soporte',
    signOut: 'Cerrar Sesión',

    // Dashboard header
    greeting: '¡Hola Damián!',
    todayTarget: 'OBJETIVO DEL DÍA',

    // Timer card
    statusRunning: 'TRABAJANDO AHORA',
    statusPaused: 'EN PAUSA',
    statusIdle: 'INACTIVO',
    projectTitle: 'Sistema de Auditoría Financiera',
    projectSubtitle: 'Estrategia de Diseño y Wireframing',
    taskProgress: 'PROGRESO',
    addNote: 'Agregar Nota',
    addNotePrompt: 'Ingresa o edita la nota para este registro:',
    viewNoteTitle: 'Ver nota',

    // Stats
    dailyProgress: 'Progreso Diario',
    dailyProgressDesc: 'Resumen de tu sesión actual y ganancias',
    manualLoad: 'Carga Manual (Olvidos)',
    loadBtn: 'Cargar',
    registerNonWorking: 'Registrar día no trabajado',
    totalTime: 'TIEMPO TOTAL',
    earnings: 'GANANCIAS',
    rateLabel: 'Tarifa ($/hr):',
    historicalBal: 'BAL. HISTÓRICO',
    extraLabel: 'Extra (h):',
    totalBtn: 'Total $',

    // Recent Activities
    recentActivities: 'Actividades Recientes',
    viewHistory: 'Ver Historial',
    viewLess: 'Ver Menos',
    noActivity: 'Actividad sin registros aún.',
    activityLabel: (rec) => `Jornada: ${rec.totalTime} | Pausa: ${rec.pauseDuration} | Ganancia: $ ${Number(rec.earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    deleteTitle: 'Eliminar registro',
  },
};
