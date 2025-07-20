import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/analytics?period=${period}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Prepare chart data for visits by date
  const prepareVisitsByDateChart = () => {
    if (!analyticsData || !analyticsData.visits_by_date) return null;

    const labels = analyticsData.visits_by_date.map(item => item.date);
    const data = analyticsData.visits_by_date.map(item => item.visits);

    return {
      labels,
      datasets: [
        {
          label: 'Visits',
          data,
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(124, 58, 237, 0.5)');  // purple-600
            gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');  // transparent
            return gradient;
          },
          borderColor: 'rgba(124, 58, 237, 1)',  // purple-600
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: 'rgba(124, 58, 237, 1)',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  // Prepare chart data for visits by device
  const prepareVisitsByDeviceChart = () => {
    if (!analyticsData || !analyticsData.visits_by_device) return null;

    const labels = analyticsData.visits_by_device.map(item => item.device_type || 'Unknown');
    const data = analyticsData.visits_by_device.map(item => item.visits);
    const backgroundColors = [
      'rgba(124, 58, 237, 0.8)',   // purple-600
      'rgba(79, 70, 229, 0.8)',    // indigo-600
      'rgba(37, 99, 235, 0.8)',    // blue-600
      'rgba(6, 182, 212, 0.8)',    // cyan-500
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 3,
          hoverBorderColor: 'white',
        },
      ],
    };
  };

  // Prepare chart data for visits by page
  const prepareVisitsByPageChart = () => {
    if (!analyticsData || !analyticsData.visits_by_page) return null;

    const labels = analyticsData.visits_by_page.map(item => {
      // Truncate long page names
      const page = item.page_visited || '/';
      return page.length > 20 ? page.substring(0, 20) + '...' : page;
    });
    const data = analyticsData.visits_by_page.map(item => item.visits);

    return {
      labels,
      datasets: [
        {
          label: 'Visits',
          data,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(124, 58, 237, 0.8)');  // purple-600
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');  // purple-500
            return gradient;
          },
          borderColor: 'rgba(124, 58, 237, 1)',
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(109, 40, 217, 0.8)',  // purple-700
          hoverBorderColor: 'rgba(91, 33, 182, 1)',         // purple-800
          hoverBorderWidth: 2,
        },
      ],
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg m-6 shadow-sm" role="alert">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <strong className="font-bold">Error!</strong>
          <span className="ml-2"> {error}</span>
        </div>
        <button
          className="mt-3 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-200 flex items-center"
          onClick={fetchAnalyticsData}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 m-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Start tracking visitor activity to see analytics data here.
        </p>
      </div>
    );
  }

  const visitsByDateChartData = prepareVisitsByDateChart();
  const visitsByDeviceChartData = prepareVisitsByDeviceChart();
  const visitsByPageChartData = prepareVisitsByPageChart();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with title and period selector */}
      <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Visitor Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Track and analyze your website traffic</p>
          </div>

          {/* Period selector */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePeriodChange('today')}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                period === 'today'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handlePeriodChange('week')}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                period === 'week'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                period === 'month'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => handlePeriodChange('year')}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                period === 'year'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Visits</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{analyticsData.total_visits}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn animation-delay-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Period</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white capitalize">{period}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn animation-delay-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Date Range</p>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {analyticsData.start_date} to {analyticsData.end_date}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits by Date */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Visits Over Time
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Daily visitor activity trends</p>
          <div className="h-64">
            {visitsByDateChartData ? (
              <Line
                data={visitsByDateChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        font: {
                          weight: 'bold'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      titleFont: {
                        size: 13,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 12
                      },
                      padding: 10,
                      cornerRadius: 6,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          return `Visits: ${context.parsed.y}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Visits by Device */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-400">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H5zm6 3H5v1h6V5z" clipRule="evenodd" />
            </svg>
            Visits by Device
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Distribution of visitors across device types</p>
          <div className="h-64 flex items-center justify-center">
            {visitsByDeviceChartData ? (
              <Pie
                data={visitsByDeviceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                          size: 12,
                          weight: 'bold'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      titleFont: {
                        size: 13,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 12
                      },
                      padding: 10,
                      cornerRadius: 6,
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000
                  },
                  cutout: '60%'
                }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </div>

        {/* Visits by Page */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-500">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              <path d="M8 11a1 1 0 100-2H6a1 1 0 000 2h2zm.464 3.536a1 1 0 10-1.414-1.414L6 14.172V15h1a1 1 0 00.707-.293l.757-.757z" />
            </svg>
            Top Pages
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Most visited pages on your website</p>
          <div className="h-64">
            {visitsByPageChartData ? (
              <Bar
                data={visitsByPageChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        display: false
                      }
                    },
                    x: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      titleFont: {
                        size: 13,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 12
                      },
                      padding: 10,
                      cornerRadius: 6,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          return `Visits: ${context.parsed.x}`;
                        }
                      }
                    }
                  },
                  animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-600">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Recent Visitors
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Latest activity on your website</p>
        {analyticsData.recent_visitors && analyticsData.recent_visitors.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.recent_visitors.map((visitor, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        {visitor.page_visited}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {visitor.formatted_date || visitor.visit_date} at {visitor.formatted_time || visitor.visit_time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                      <div className="flex items-center">
                        {visitor.device_type === 'desktop' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                          </svg>
                        ) : visitor.device_type === 'mobile' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        ) : visitor.device_type === 'tablet' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        )}
                        {visitor.device_type || 'Unknown'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-center">No recent visitors</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-1">Visitor data will appear here once people start visiting your site</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
