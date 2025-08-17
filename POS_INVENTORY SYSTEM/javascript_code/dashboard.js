// ===== MENU TOGGLE =====
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.menu').classList.toggle('active');
});

// ===== DATE & TIME =====
function updateDateTime() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString();
  document.getElementById('time').textContent = now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();


// ===== SAMPLE SALES DATA =====
const salesDataSets = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [1200, 1900, 3000, 2500, 2200, 2700, 3100]
  },
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [10500, 9800, 11200, 12400]
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [85000, 90000, 95000, 88000, 99000, 105000, 110000, 102000, 97000, 112000, 115000, 120000]
  }
};

// ===== INIT BAR CHART =====
const barCtx = document.getElementById('salesBarChart').getContext('2d');
const salesBarChart = new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: salesDataSets.week.labels,
    datasets: [{
      label: 'Sales (R)',
      data: salesDataSets.week.data,
      backgroundColor: '#4e73df'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return 'R' + value.toLocaleString();
          }
        }
      }
    }
  }
});

// ===== FILTER HANDLER =====
document.getElementById('sales-filter').addEventListener('change', function () {
  const selected = this.value;
  salesBarChart.data.labels = salesDataSets[selected].labels;
  salesBarChart.data.datasets[0].data = salesDataSets[selected].data;
  salesBarChart.update();
});




// ===== PRODUCT PIE CHART =====
const pieCtx = document.getElementById('productPieChart').getContext('2d');
new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
    }]
  }
});
