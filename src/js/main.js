// Constantes
const THEME_KEY = 'dashboard-theme';
const DARK_CLASS = 'dark';

// Estado de la aplicación
const state = {
  theme: localStorage.getItem(THEME_KEY) || 'light',
  isLoading: false,
  error: null,
  orders: [],
  isSidebarOpen: false
};

// Elementos DOM
const elements = {
  themeToggle: document.getElementById('theme-toggle'),
  ordersTableBody: document.getElementById('orders-table-body'),
  loadingSpinner: document.getElementById('loading-spinner'),
  errorMessage: document.getElementById('error-message'),
  menuToggle: document.getElementById('menu-toggle'),
  sidebar: document.getElementById('sidebar'),
  sidebarNav: document.querySelector('.sidebar-nav'),
  sidebarOverlay: document.getElementById('sidebar-overlay')
};

// Manejadores de eventos
function handleThemeToggle() {
  const isDark = document.body.classList.toggle(DARK_CLASS);
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function handleKeyDown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleThemeToggle();
  }
}

function handleMenuToggle() {
  state.isSidebarOpen = !state.isSidebarOpen;
  updateSidebarState();
}

function handleOverlayClick() {
  state.isSidebarOpen = false;
  updateSidebarState();
}

function handleEscapeKey(event) {
  if (event.key === 'Escape' && state.isSidebarOpen) {
    state.isSidebarOpen = false;
    updateSidebarState();
  }
}

function handleSidebarClick(event) {
  // Solo cerrar si el clic fue directamente en el sidebar o sidebar-nav
  // y no en sus elementos hijos (excepto el sidebar-nav)
  if (event.target === elements.sidebar || event.target === elements.sidebarNav) {
    state.isSidebarOpen = false;
    updateSidebarState();
  }
}

// Funciones de actualización de UI
function updateThemeIcon(isDark) {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  const themeText = document.querySelector('.theme-text');
  
  if (sunIcon && moonIcon) {
    sunIcon.style.display = isDark ? 'block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'block';
  }

  if (themeText) {
    themeText.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }
}

function renderOrderRow(order) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${order.orderNumber}</td>
    <td>${order.purchaseDate}</td>
    <td>
      <div class="user-info">
        <span>${order.customer}</span>
      </div>
    </td>
    <td>
      <div class="event-info">
        <span>${order.event}</span>
      </div>
    </td>
    <td>${order.amount}</td>
  `;
  return tr;
}

function renderOrders(orders) {
  if (!elements.ordersTableBody) return;
  
  elements.ordersTableBody.innerHTML = '';
  orders.forEach(order => {
    elements.ordersTableBody.appendChild(renderOrderRow(order));
  });
}

// Funciones de datos
async function fetchOrders() {
  // Simulando una llamada API
  state.isLoading = true;
  updateLoadingState(true);

  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Datos de ejemplo
    state.orders = [
      {
        orderNumber: '3000',
        purchaseDate: '9 May, 2024',
        customer: 'María García',
        event: 'Día de la madre',
        amount: '€80.00'
      },
      {
        orderNumber: '3001',
        purchaseDate: '5 May, 2024',
        customer: 'Juan Martínez',
        event: 'Día de la madre',
        amount: '€299.00'
      },
      {
        orderNumber: '3002',
        purchaseDate: '28 Apr, 2024',
        customer: 'Ana López',
        event: 'Día de la madre',
        amount: '€150.00'
      }
    ];

    renderOrders(state.orders);
  } catch (error) {
    state.error = 'Error al cargar los datos';
    showError(state.error);
  } finally {
    state.isLoading = false;
    updateLoadingState(false);
  }
}

// Funciones de estado UI
function updateLoadingState(isLoading) {
  if (elements.loadingSpinner) {
    elements.loadingSpinner.style.display = isLoading ? 'block' : 'none';
  }
  
  const tableContainer = document.querySelector('.table-container');
  if (tableContainer) {
    tableContainer.classList.toggle('loading', isLoading);
  }
}

function showError(message) {
  if (elements.errorMessage) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
  }
}

function updateSidebarState() {
  if (elements.sidebar && elements.sidebarOverlay) {
    elements.sidebar.classList.toggle('open', state.isSidebarOpen);
    elements.sidebarOverlay.classList.toggle('visible', state.isSidebarOpen);
    
    // Manejar el scroll del body
    document.body.style.overflow = state.isSidebarOpen ? 'hidden' : '';
  }
}

// Inicialización
function initializeTheme() {
  // Verificar preferencia del sistema
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add(DARK_CLASS);
    updateThemeIcon(true);
  }

  // Verificar tema guardado
  if (state.theme === 'dark') {
    document.body.classList.add(DARK_CLASS);
    updateThemeIcon(true);
  }
}

function initializeEventListeners() {
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', handleThemeToggle);
    elements.themeToggle.addEventListener('keydown', handleKeyDown);
  }

  if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', handleMenuToggle);
  }

  if (elements.sidebarOverlay) {
    elements.sidebarOverlay.addEventListener('click', handleOverlayClick);
  }

  // Añadir event listeners para cerrar el sidebar
  if (elements.sidebar) {
    elements.sidebar.addEventListener('click', handleSidebarClick);
  }

  if (elements.sidebarNav) {
    elements.sidebarNav.addEventListener('click', handleSidebarClick);
  }

  // Cerrar menú con la tecla Escape
  document.addEventListener('keydown', handleEscapeKey);

  // Cerrar menú al cambiar el tamaño de la ventana a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && state.isSidebarOpen) {
      state.isSidebarOpen = false;
      updateSidebarState();
    }
  });
}

// Manejo del menú de usuario
const userMenuButton = document.getElementById('user-menu-button');
const userSubmenu = document.getElementById('user-submenu');

function toggleUserMenu() {
    const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true';
    userMenuButton.setAttribute('aria-expanded', !isExpanded);
    userSubmenu.classList.toggle('active');
}

function closeUserMenu() {
    userMenuButton.setAttribute('aria-expanded', 'false');
    userSubmenu.classList.remove('active');
}

// Event listeners para el menú de usuario
userMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUserMenu();
});

// Cerrar el menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!userMenuButton.contains(e.target)) {
        closeUserMenu();
    }
});

// Cerrar el menú con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeUserMenu();
    }
});

// Manejo del selector de equipos
const teamSelectorButton = document.getElementById('team-selector-button');
const teamMenu = document.getElementById('team-menu');

function toggleTeamMenu() {
    const isExpanded = teamSelectorButton.getAttribute('aria-expanded') === 'true';
    teamSelectorButton.setAttribute('aria-expanded', !isExpanded);
    teamMenu.classList.toggle('active');
}

function closeTeamMenu() {
    teamSelectorButton.setAttribute('aria-expanded', 'false');
    teamMenu.classList.remove('active');
}

// Event listeners para el selector de equipos
teamSelectorButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTeamMenu();
});

// Cerrar el menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!teamSelectorButton.contains(e.target) && !teamMenu.contains(e.target)) {
        closeTeamMenu();
    }
});

// Cerrar el menú con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTeamMenu();
    }
});

// === CHART.JS: Dinero ganado ===
const chartColors = {
  light: {
    border: 'rgba(85, 70, 150, 1)',
    background: 'rgba(85, 70, 150, 0.08)',
    grid: '#e5e7eb',
    text: '#111827',
  },
  dark: {
    border: 'rgba(85, 70, 150, 1)',
    background: 'rgba(85, 70, 150, 0.15)',
    grid: '#374151',
    text: '#f3f4f6',
  }
};

const chartData = {
  labels: [
    '06/03/2023', '10/03/2023', '13/03/2023', '16/03/2023', '21/03/2023', '23/03/2023', '27/03/2023', '31/03/2023'
  ],
  datasets: [{
    label: 'Dinero ganado',
    data: [0, 200, 150, 500, 50, 100, 200, 0],
    fill: true,
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 3,
    pointBackgroundColor: 'rgba(85, 70, 150, 1)',
    pointBorderColor: '#fff',
  }]
};

// === CHART.JS: Ingresos ===
const incomeData = {
  labels: [
    'Ene 2024', 'Feb 2024', 'Mar 2024', 'Abr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Ago 2024'
  ],
  datasets: [{
    label: 'Ingresos mensuales',
    data: [25000, 32000, 28000, 35000, 42000, 38000, 45000, 50000],
    fill: true,
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 3,
    pointBackgroundColor: 'rgba(85, 70, 150, 1)',
    pointBorderColor: '#fff',
  }]
};

let earningsChart = null;
let incomeChart = null;

function getCurrentChartTheme() {
  return document.body.classList.contains('dark') ? 'dark' : 'light';
}

function getChartOptions(theme) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#374151' : '#fff',
        titleColor: chartColors[theme].text,
        bodyColor: chartColors[theme].text,
        borderColor: chartColors[theme].border,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: chartColors[theme].grid },
        ticks: { color: chartColors[theme].text }
      },
      y: {
        grid: { color: chartColors[theme].grid },
        ticks: {
          color: chartColors[theme].text,
          callback: value => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })
        }
      }
    }
  };
}

function renderEarningsChart() {
  const ctx = document.getElementById('earnings-chart');
  if (!ctx) return;
  const theme = getCurrentChartTheme();
  if (earningsChart) earningsChart.destroy();
  earningsChart = new Chart(ctx, {
    type: 'line',
    data: {
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          borderColor: chartColors[theme].border,
          backgroundColor: chartColors[theme].background,
        }
      ]
    },
    options: getChartOptions(theme)
  });
}

function renderIncomeChart() {
  const ctx = document.getElementById('income-chart');
  if (!ctx) return;
  const theme = getCurrentChartTheme();
  if (incomeChart) incomeChart.destroy();
  incomeChart = new Chart(ctx, {
    type: 'line',
    data: {
      ...incomeData,
      datasets: [
        {
          ...incomeData.datasets[0],
          borderColor: chartColors[theme].border,
          backgroundColor: chartColors[theme].background,
        }
      ]
    },
    options: getChartOptions(theme)
  });
}

// === CHART.JS: KPIs Mensuales ===
const monthlyKpisData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
        label: 'MRR',
        data: [42.5, 43.2, 44.1, 43.8, 44.5, 45.2, 45.8, 46.3, 46.9, 47.5, 48.1, 48.8],
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(85, 70, 150, 1)',
        pointBorderColor: '#fff',
    }]
};

let monthlyKpisChart = null;

function renderMonthlyKpisChart() {
    const ctx = document.getElementById('monthly-kpis-chart');
    if (!ctx) return;
    const theme = getCurrentChartTheme();
    if (monthlyKpisChart) monthlyKpisChart.destroy();
    monthlyKpisChart = new Chart(ctx, {
        type: 'line',
        data: {
            ...monthlyKpisData,
            datasets: [
                {
                    ...monthlyKpisData.datasets[0],
                    borderColor: chartColors[theme].border,
                    backgroundColor: chartColors[theme].background,
                }
            ]
        },
        options: getChartOptions(theme)
    });
}

// === CHART.JS: KPIs Anuales ===
const annualKpisData = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [{
        label: 'Ingresos Anuales (K€)',
        data: [468.2, 512.4, 542.4, 625.8],
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(85, 70, 150, 1)',
        pointBorderColor: '#fff',
    }]
};

let annualKpisChart = null;

function renderAnnualKpisChart() {
    const ctx = document.getElementById('annual-kpis-chart');
    if (!ctx) return;
    const theme = getCurrentChartTheme();
    if (annualKpisChart) annualKpisChart.destroy();
    annualKpisChart = new Chart(ctx, {
        type: 'line',
        data: {
            ...annualKpisData,
            datasets: [
                {
                    ...annualKpisData.datasets[0],
                    borderColor: chartColors[theme].border,
                    backgroundColor: chartColors[theme].background,
                }
            ]
        },
        options: getChartOptions(theme)
    });
}

// === CHART.JS: Ocupación Horaria ===
const ocupacionHorariaData = {
    labels: [
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ],
    datasets: [{
        label: 'Mesas ocupadas',
        data: [45, 65, 85, 75, 55, 35, 45, 65, 75, 85, 65, 45],
        backgroundColor: 'rgba(85, 70, 150, 0.8)',
        borderColor: 'rgba(85, 70, 150, 1)',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 40
    }]
};

let ocupacionHorariaChart = null;

function renderOcupacionHorariaChart() {
    const ctx = document.getElementById('ocupacion-horaria-chart');
    if (!ctx) return;
    const theme = getCurrentChartTheme();
    if (ocupacionHorariaChart) ocupacionHorariaChart.destroy();
    
    ocupacionHorariaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            ...ocupacionHorariaData,
            datasets: [
                {
                    ...ocupacionHorariaData.datasets[0],
                    backgroundColor: theme === 'dark' ? 'rgba(85, 70, 150, 0.8)' : 'rgba(85, 70, 150, 0.8)',
                    borderColor: theme === 'dark' ? 'rgba(85, 70, 150, 1)' : 'rgba(85, 70, 150, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                    titleColor: chartColors[theme].text,
                    bodyColor: chartColors[theme].text,
                    borderColor: chartColors[theme].border,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `Ocupación: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { 
                        color: chartColors[theme].grid,
                        display: false
                    },
                    ticks: { 
                        color: chartColors[theme].text,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: chartColors[theme].grid },
                    ticks: { 
                        color: chartColors[theme].text,
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

// Funciones de exportación para el gráfico de ocupación horaria
function exportOcupacionHorariaImage() {
    if (!ocupacionHorariaChart) return;
    const link = document.createElement('a');
    link.href = ocupacionHorariaChart.toBase64Image();
    link.download = 'ocupacion-horaria.png';
    link.click();
}

function exportOcupacionHorariaCSV() {
    const rows = [
        ['Hora', 'Ocupación (%)'],
        ...ocupacionHorariaData.labels.map((label, i) => [label, ocupacionHorariaData.datasets[0].data[i]])
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ocupacion-horaria.csv';
    link.click();
}

function exportOcupacionHorariaXLS() {
    const wsData = [
        ['Hora', 'Ocupación (%)'],
        ...ocupacionHorariaData.labels.map((label, i) => [label, ocupacionHorariaData.datasets[0].data[i]])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OcupacionHoraria');
    XLSX.writeFile(wb, 'ocupacion-horaria.xlsx');
}

// Actualizar la función setupChartThemeListener
function setupChartThemeListener() {
    const observer = new MutationObserver(() => {
        renderEarningsChart();
        renderIncomeChart();
        renderMonthlyKpisChart();
        renderAnnualKpisChart();
        renderOcupacionHorariaChart();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

// Actualizar la inicialización de los gráficos
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderEarningsChart();
        renderIncomeChart();
        renderMonthlyKpisChart();
        renderAnnualKpisChart();
        renderOcupacionHorariaChart();
        setupChartThemeListener();
    });
} else {
    renderEarningsChart();
    renderIncomeChart();
    renderMonthlyKpisChart();
    renderAnnualKpisChart();
    renderOcupacionHorariaChart();
    setupChartThemeListener();
}

// Actualizar los event listeners de exportación
document.addEventListener('DOMContentLoaded', () => {
    const btnImg = document.getElementById('export-chart-image');
    const btnCSV = document.getElementById('export-chart-csv');
    const btnXLS = document.getElementById('export-chart-xls');
    const btnIncomeImg = document.getElementById('export-income-image');
    const btnIncomeCSV = document.getElementById('export-income-csv');
    const btnIncomeXLS = document.getElementById('export-income-xls');
    const btnHorariaImg = document.getElementById('export-horaria-image');
    const btnHorariaCSV = document.getElementById('export-horaria-csv');
    const btnHorariaXLS = document.getElementById('export-horaria-xls');
    
    if (btnImg) btnImg.addEventListener('click', exportChartImage);
    if (btnCSV) btnCSV.addEventListener('click', exportChartCSV);
    if (btnXLS) btnXLS.addEventListener('click', exportChartXLS);
    if (btnIncomeImg) btnIncomeImg.addEventListener('click', exportIncomeImage);
    if (btnIncomeCSV) btnIncomeCSV.addEventListener('click', exportIncomeCSV);
    if (btnIncomeXLS) btnIncomeXLS.addEventListener('click', exportIncomeXLS);
    if (btnHorariaImg) btnHorariaImg.addEventListener('click', exportOcupacionHorariaImage);
    if (btnHorariaCSV) btnHorariaCSV.addEventListener('click', exportOcupacionHorariaCSV);
    if (btnHorariaXLS) btnHorariaXLS.addEventListener('click', exportOcupacionHorariaXLS);
});

function getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
        primary: styles.getPropertyValue('--color-primary').trim(),
        gray: styles.getPropertyValue('--color-text-light').trim()
    };
}

// Configuración de los gráficos de ocupación
function initOccupancyCharts() {
    const mesasCtx = document.getElementById('mesas-chart');
    const asientosCtx = document.getElementById('asientos-chart');
    
    if (!mesasCtx || !asientosCtx) return;

    // Obtener colores del tema
    const themeColors = getThemeColors();

    // Datos de ejemplo
    const mesasData = {
        total: 35,
        ocupadas: 12,
        vacias: 23
    };

    const asientosData = {
        total: 104,
        ocupados: 45,
        vacios: 59
    };

    const commonOptions = {
        type: 'doughnut',
        options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: themeColors.gray,
                    titleColor: themeColors.primary,
                    bodyColor: '#111827',
                    borderColor: themeColors.primary,
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.total || 100;
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    // Gráfico de mesas
    new Chart(mesasCtx, {
        ...commonOptions,
        data: {
            datasets: [{
                data: [mesasData.ocupadas, mesasData.vacias],
                backgroundColor: [
                    themeColors.primary, // Morado del tema
                    themeColors.gray     // Gris suave
                ],
                borderWidth: 0,
                total: mesasData.total
            }]
        }
    });

    // Actualizar el texto de las mesas
    updateMesasText(mesasData);

    // Gráfico de asientos
    new Chart(asientosCtx, {
        ...commonOptions,
        data: {
            datasets: [{
                data: [asientosData.ocupados, asientosData.vacios],
                backgroundColor: [
                    themeColors.primary, // Morado del tema
                    themeColors.gray     // Gris suave
                ],
                borderWidth: 0,
                total: asientosData.total
            }]
        }
    });

    // Actualizar el texto de los asientos
    updateAsientosText(asientosData);
}

// Función para actualizar el texto de las mesas
function updateMesasText(data) {
    const vaciasElement = document.querySelector('#mesas-chart').closest('.stat-card').querySelector('.stat-detail-item:nth-child(1) .stat-detail-text');
    const ocupadasElement = document.querySelector('#mesas-chart').closest('.stat-card').querySelector('.stat-detail-item:nth-child(2) .stat-detail-text');
    
    if (vaciasElement && ocupadasElement) {
        const vaciasPorcentaje = Math.round((data.vacias / data.total) * 100);
        const ocupadasPorcentaje = Math.round((data.ocupadas / data.total) * 100);
        
        vaciasElement.textContent = `Mesas vacías: ${data.vacias}/${data.total} (${vaciasPorcentaje}%)`;
        ocupadasElement.textContent = `Mesas ocupadas: ${data.ocupadas}/${data.total} (${ocupadasPorcentaje}%)`;
    }
}

// Función para actualizar el texto de los asientos
function updateAsientosText(data) {
    const vaciosElement = document.querySelector('#asientos-chart').closest('.stat-card').querySelector('.stat-detail-item:nth-child(1) .stat-detail-text');
    const ocupadosElement = document.querySelector('#asientos-chart').closest('.stat-card').querySelector('.stat-detail-item:nth-child(2) .stat-detail-text');
    
    if (vaciosElement && ocupadosElement) {
        const vaciosPorcentaje = Math.round((data.vacios / data.total) * 100);
        const ocupadosPorcentaje = Math.round((data.ocupados / data.total) * 100);
        
        vaciosElement.textContent = `Asientos vacíos: ${data.vacios}/${data.total} (${vaciosPorcentaje}%)`;
        ocupadosElement.textContent = `Asientos ocupados: ${data.ocupados}/${data.total} (${ocupadosPorcentaje}%)`;
    }
}

// Configuración de los gráficos de ocupación de mesas
function initMesasOcupacionCharts() {
    const mesasOcupacionCtx = document.getElementById('mesas-ocupacion-chart');
    const mesasZonaCtx = document.getElementById('mesas-zona-chart');
    const tiempoOcupacionCtx = document.getElementById('tiempo-ocupacion-chart');
    const eficienciaRotacionCtx = document.getElementById('eficiencia-rotacion-chart');
    
    if (!mesasOcupacionCtx || !mesasZonaCtx || !tiempoOcupacionCtx || !eficienciaRotacionCtx) return;

    // Obtener colores del tema
    const themeColors = getThemeColors();

    // Datos de ejemplo
    const mesasData = {
        total: 35,
        ocupadas: 12,
        vacias: 23
    };

    const zonaData = {
        terraza: 15,
        interior: 20
    };

    const tiempoData = {
        tiempoMedio: 105, // minutos
        rotacion: 4.5
    };

    const eficienciaData = {
        actual: 78,
        objetivo: 85,
        restante: 22
    };

    const commonOptions = {
        type: 'doughnut',
        options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: themeColors.gray,
                    titleColor: themeColors.primary,
                    bodyColor: '#111827',
                    borderColor: themeColors.primary,
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.total || 100;
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value}%`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    // Gráfico de ocupación de mesas
    new Chart(mesasOcupacionCtx, {
        ...commonOptions,
        data: {
            datasets: [{
                data: [mesasData.ocupadas, mesasData.vacias],
                backgroundColor: [
                    themeColors.primary,
                    themeColors.gray
                ],
                borderWidth: 0,
                total: mesasData.total
            }]
        }
    });

    // Gráfico de mesas por zona
    new Chart(mesasZonaCtx, {
        ...commonOptions,
        data: {
            datasets: [{
                data: [zonaData.terraza, zonaData.interior],
                backgroundColor: [
                    themeColors.primary,
                    themeColors.gray
                ],
                borderWidth: 0,
                total: zonaData.terraza + zonaData.interior
            }]
        }
    });

    // Gráfico de tiempo de ocupación
    new Chart(tiempoOcupacionCtx, {
        ...commonOptions,
        data: {
            datasets: [{
                data: [tiempoData.tiempoMedio, 60], // 60 minutos como referencia
                backgroundColor: [
                    themeColors.primary,
                    themeColors.gray
                ],
                borderWidth: 0,
                total: 180 // 3 horas como máximo
            }]
        }
    });

    // Gráfico de eficiencia de rotación
    new Chart(eficienciaRotacionCtx, {
        ...commonOptions,
        data: {
            datasets: [{
                data: [eficienciaData.actual, eficienciaData.restante],
                backgroundColor: [
                    themeColors.primary,
                    themeColors.gray
                ],
                borderWidth: 0,
                total: 100
            }]
        }
    });
}

// === Dashboard Filters and Export ===
function handleDateRangeChange() {
    const dateRangeSelect = document.getElementById('date-range');
    const customDatesDiv = document.getElementById('custom-dates');
    
    if (!dateRangeSelect || !customDatesDiv) return;
    
    dateRangeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customDatesDiv.style.display = 'flex';
            
            // Set default dates (today and 7 days ago)
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            
            document.getElementById('start-date').valueAsDate = sevenDaysAgo;
            document.getElementById('end-date').valueAsDate = today;
        } else {
            customDatesDiv.style.display = 'none';
            applyDateFilter(e.target.value);
        }
    });
    
    // Handle apply button for custom dates
    const applyDatesBtn = document.getElementById('apply-dates');
    if (applyDatesBtn) {
        applyDatesBtn.addEventListener('click', () => {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            if (startDate && endDate) {
                applyDateFilter('custom', { startDate, endDate });
            } else {
                alert('Por favor, selecciona fechas de inicio y fin.');
            }
        });
    }
}

function applyDateFilter(filterType, customDates = null) {
    // Here we'll update all dashboard data based on the selected date range
    console.log(`Aplicando filtro: ${filterType}`);
    
    // Example of date range calculation based on filter type
    let startDate, endDate;
    const today = new Date();
    
    switch (filterType) {
        case 'today':
            startDate = today;
            endDate = today;
            break;
        case 'yesterday':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 1);
            endDate = new Date(startDate);
            break;
        case 'last7':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            endDate = today;
            break;
        case 'last30':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30);
            endDate = today;
            break;
        case 'thisMonth':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;
        case 'lastMonth':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'custom':
            if (customDates) {
                startDate = new Date(customDates.startDate);
                endDate = new Date(customDates.endDate);
            }
            break;
    }
    
    // Format dates for display
    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    console.log(`Rango de fechas: ${formatDate(startDate)} - ${formatDate(endDate)}`);
    
    // Here you would update all your charts and metrics
    // For demo purposes, we'll just update some UI elements
    updateDashboardTitle(formatDate(startDate), formatDate(endDate));
    
    // Trigger reload of all data
    reloadDashboardData(startDate, endDate);
}

function updateDashboardTitle(startDate, endDate) {
    const header = document.querySelector('.header h1');
    if (header) {
        if (startDate === endDate) {
            header.textContent = `Buenos días, Fénix (${startDate})`;
        } else {
            header.textContent = `Buenos días, Fénix (${startDate} - ${endDate})`;
        }
        header.classList.add('camarai_color');
    }
}

function reloadDashboardData(startDate, endDate) {
    // Here we would call APIs to fetch new data
    // For now, we'll just add loading indicators to simulate the reload
    const containers = document.querySelectorAll('.table-container, .stats-grid');
    containers.forEach(container => {
        container.classList.add('loading');
        setTimeout(() => {
            container.classList.remove('loading');
        }, 1000);
    });
}

// Export dashboard report functions
function setupDashboardExports() {
    const csvButton = document.getElementById('export-dashboard-csv');
    const xlsButton = document.getElementById('export-dashboard-xls');
    const pdfButton = document.getElementById('export-dashboard-pdf');
    
    if (csvButton) {
        csvButton.addEventListener('click', exportDashboardCSV);
    }
    
    if (xlsButton) {
        xlsButton.addEventListener('click', exportDashboardXLS);
    }
    
    if (pdfButton) {
        pdfButton.addEventListener('click', exportDashboardPDF);
    }
}

function exportDashboardCSV() {
    // For demo purposes, we'll create a simple CSV with some metrics
    const rows = [
        ['Métrica', 'Valor', 'Cambio'],
        ['Ingresos totales', '€2.6M', '+4.5%'],
        ['Valor medio de pedido', '€455', '-0.5%'],
        ['Entradas vendidas', '5,888', '+4.5%'],
        ['Visitas a la página', '823,067', '+21.2%']
    ];
    
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function exportDashboardXLS() {
    // Using SheetJS library
    const data = [
        ['Métrica', 'Valor', 'Cambio'],
        ['Ingresos totales', '€2.6M', '+4.5%'],
        ['Valor medio de pedido', '€455', '-0.5%'],
        ['Entradas vendidas', '5,888', '+4.5%'],
        ['Visitas a la página', '823,067', '+21.2%']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
    XLSX.writeFile(wb, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
}

function exportDashboardPDF() {
    // For demo purposes, we'll display an alert
    alert('Función de exportación a PDF en desarrollo');
}

// === Módulos Camarai.app ===
function setupModuleToggles() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isActive = toggle.classList.contains('active');
            const moduleName = toggle.closest('.module-card').querySelector('.module-title').textContent;
            
            if (isActive) {
                // Desactivar el módulo
                toggle.classList.remove('active');
                toggle.setAttribute('aria-pressed', 'false');
                toggle.closest('.module-card').classList.remove('active');
                
                // Confirmar la desactivación
                showModuleNotification(`Módulo ${moduleName} desactivado correctamente.`, 'warning');
            } else {
                // Activar el módulo
                toggle.classList.add('active');
                toggle.setAttribute('aria-pressed', 'true');
                toggle.closest('.module-card').classList.add('active');
                
                // Confirmar la activación
                showModuleNotification(`Módulo ${moduleName} activado correctamente.`, 'success');
            }
        });
    });
}

function showModuleNotification(message, type) {
    // Verificar si ya existe una notificación
    let notification = document.querySelector('.module-notification');
    
    // Si existe, eliminarla para crear una nueva
    if (notification) {
        notification.remove();
    }
    
    // Crear nueva notificación
    notification = document.createElement('div');
    notification.className = `module-notification ${type}`;
    notification.textContent = message;
    
    // Añadir botón de cierre
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Cerrar notificación');
    
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    notification.appendChild(closeButton);
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Auto-desaparecer después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 500);
        }
    }, 5000);
}

// === Gestión de Ubicaciones ===
function setupLocationManagement() {
    // Variables para almacenar el estado de la búsqueda y filtrado
    const state = {
        locations: [
            {
                id: 1,
                name: 'Restaurante Central',
                address: 'Calle Gran Vía 41, Madrid',
                phone: '+34 912 456 789',
                email: 'central@restaurante.es',
                group: 'madrid',
                active: true,
                modules: ['TPV', 'Tienda Online', 'Reservas']
            },
            {
                id: 2,
                name: 'La Terraza',
                address: 'Paseo Marítimo 22, Barcelona',
                phone: '+34 933 456 123',
                email: 'terraza@restaurante.es',
                group: 'barcelona',
                active: true,
                modules: ['TPV', 'Reservas', 'QR Ordering']
            },
            {
                id: 3,
                name: 'Café Norte',
                address: 'Alameda Principal 5, Valencia',
                phone: '+34 963 789 456',
                email: 'norte@restaurante.es',
                group: 'valencia',
                active: false,
                modules: ['TPV']
            }
        ],
        searchTerm: '',
        activeFilter: 'all',
        currentPage: 1,
        locationsPerPage: 6
    };

    // Event listeners
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.location-filter');
    const addLocationBtn = document.getElementById('add-location-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value.toLowerCase();
            state.currentPage = 1;
            filterAndRenderLocations();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            state.activeFilter = e.target.value;
            state.currentPage = 1;
            filterAndRenderLocations();
        });
    }
    
    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', () => {
            showAddLocationModal();
        });
    }
    
    // Configurar botones de acción en ubicaciones existentes
    setupLocationActionButtons();
    
    // Filtrar y renderizar ubicaciones
    function filterAndRenderLocations() {
        // Aplicar filtros
        let filteredLocations = state.locations;
        
        // Filtrar por término de búsqueda
        if (state.searchTerm) {
            filteredLocations = filteredLocations.filter(location => 
                location.name.toLowerCase().includes(state.searchTerm) || 
                location.address.toLowerCase().includes(state.searchTerm)
            );
        }
        
        // Filtrar por grupo
        if (state.activeFilter !== 'all') {
            filteredLocations = filteredLocations.filter(location => 
                location.group === state.activeFilter
            );
        }
        
        // Actualizar paginación
        updatePagination(filteredLocations.length);
        
        // Mostrar notificación si no hay resultados
        if (filteredLocations.length === 0) {
            showModuleNotification('No se encontraron ubicaciones con los criterios de búsqueda.', 'warning');
        }
    }
    
    // Actualizar la paginación
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / state.locationsPerPage);
        const paginationText = document.querySelector('.pagination-text');
        const prevBtn = document.querySelector('.pagination-btn:first-child');
        const nextBtn = document.querySelector('.pagination-btn:last-child');
        
        if (paginationText) {
            paginationText.textContent = `Página ${state.currentPage} de ${totalPages || 1}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = state.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = state.currentPage >= totalPages || totalPages === 0;
        }
    }
    
    // Configurar botones de acción en ubicaciones
    function setupLocationActionButtons() {
        // Botones de edición
        const editButtons = document.querySelectorAll('.location-action-btn[aria-label="Editar ubicación"]');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const locationCard = button.closest('.location-card');
                const locationName = locationCard.querySelector('.location-name').textContent;
                showEditLocationModal(locationName);
            });
        });
        
        // Botones de eliminación
        const deleteButtons = document.querySelectorAll('.location-action-btn[aria-label="Eliminar ubicación"]');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const locationCard = button.closest('.location-card');
                const locationName = locationCard.querySelector('.location-name').textContent;
                confirmDeleteLocation(locationName);
            });
        });
    }
    
    // Mostrar modal para añadir ubicación (simulado)
    function showAddLocationModal() {
        showModuleNotification('Funcionalidad de añadir ubicación en desarrollo.', 'info');
    }
    
    // Mostrar modal para editar ubicación (simulado)
    function showEditLocationModal(locationName) {
        showModuleNotification(`Editando ubicación: ${locationName}`, 'info');
    }
    
    // Confirmar eliminación de ubicación (simulado)
    function confirmDeleteLocation(locationName) {
        if (confirm(`¿Estás seguro de que deseas eliminar la ubicación "${locationName}"?`)) {
            showModuleNotification(`Ubicación ${locationName} eliminada correctamente.`, 'success');
        }
    }
}

// Inicializar los gráficos cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    fetchOrders();
    initOccupancyCharts();
    initMesasOcupacionCharts();
    handleDateRangeChange();
    setupDashboardExports();
    setupModuleToggles();
    setupLocationManagement();
}); 