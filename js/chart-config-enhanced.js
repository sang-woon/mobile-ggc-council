// Enhanced Chart.js Configuration with Korean Labels and Tooltips
// 002-dashboard-bug-fixes US4: Add missing axis labels, tooltips, and KRDS styling

window.app = window.app || {};

/**
 * Create enhanced monthly activity chart with Korean labels
 * @param {string} canvasId - ID of canvas element
 * @param {object} data - Chart data with labels and data arrays
 * @returns {Chart} Chart.js instance
 */
window.app.createMonthlyActivityChart = function(canvasId, data) {
    const canvas = document.getElementById(canvasId);

    if (!canvas || !window.Chart) {
        console.error('📊 Chart initialization failed: Canvas or Chart.js not found');
        return null;
    }

    console.log('📊 Creating enhanced monthly activity chart');

    // T033-T037: Enhanced Chart.js configuration per contracts/chart-config-schema.yaml
    const config = {
        type: 'line',
        data: {
            // T034: Korean month labels
            labels: data.labels || ['8월', '9월', '10월', '11월', '12월', '1월'],
            datasets: [{
                label: '활동 건수',
                data: data.data || [45, 52, 48, 58, 55, 62],
                // T037: KRDS color palette
                borderColor: '#0056b3',           // KRDS secondary blue
                backgroundColor: 'rgba(0, 86, 179, 0.1)',  // KRDS blue with transparency
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#0056b3',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false  // Hide legend for cleaner mobile display
                },

                // T035: Tooltip configuration with Korean formatting
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,

                    // T036: Tooltip fonts and styling
                    titleFont: {
                        family: 'Noto Sans KR',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Noto Sans KR',
                        size: 12,
                        weight: '400'
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,

                    // T035: Custom tooltip callbacks for Korean localization
                    callbacks: {
                        title: function(context) {
                            return context[0].label;  // Month name (already in Korean)
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            return `활동: ${value}건`;  // Format: "활동: 52건"
                        }
                    }
                }
            },

            scales: {
                // T033: Y-axis configuration with Korean title
                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: '활동 수',  // Korean Y-axis label
                        font: {
                            family: 'Noto Sans KR',
                            size: 12,
                            weight: '600'
                        },
                        color: '#374151'  // Gray-700 for readability
                    },

                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                            size: 12
                        },
                        color: '#6b7280',  // Gray-500
                        precision: 0  // No decimals for activity count
                    },

                    grid: {
                        borderDash: [5, 5],
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },

                // T034: X-axis configuration with Korean title
                x: {
                    title: {
                        display: true,
                        text: '월',  // Korean X-axis label
                        font: {
                            family: 'Noto Sans KR',
                            size: 12,
                            weight: '600'
                        },
                        color: '#374151'  // Gray-700
                    },

                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                            size: 12
                        },
                        color: '#6b7280'  // Gray-500
                    },

                    grid: {
                        display: false  // Hide X-axis grid for cleaner look
                    }
                }
            },

            // Interaction settings
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    };

    // Create and return chart instance
    const chart = new Chart(canvas, config);
    console.log('📊 Enhanced monthly activity chart created successfully');

    return chart;
};

// Backward compatibility: Alias for existing code
window.app.initMonthlyChartEnhanced = window.app.createMonthlyActivityChart;
