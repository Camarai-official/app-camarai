// Manejo del tema oscuro
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Verificar la preferencia del sistema
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark');
}

// Verificar la preferencia guardada
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.classList.toggle('dark', savedTheme === 'dark');
}

// Manejar el cambio de tema
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Datos de ejemplo para la tabla
const ordersData = [
    {
        orderNumber: '3000',
        purchaseDate: '9 May, 2024',
        customer: 'Leslie Alexander',
        event: 'Bear Hug: Live in Concert',
        amount: 'US$80.00'
    },
    // Añade más datos aquí
];

// Función para renderizar las filas de la tabla
function renderTableRows() {
    const tbody = document.querySelector('tbody');
    ordersData.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6 lg:pl-8">${order.orderNumber}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">${order.purchaseDate}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">${order.customer}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">${order.event}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">${order.amount}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializar la tabla
renderTableRows(); 