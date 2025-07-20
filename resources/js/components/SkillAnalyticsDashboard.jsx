import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar, Radar } from 'react-chartjs-2';
import StudyListComponent from './StudyListComponent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SkillAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'study-list'

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/skill-analytics');
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching skill analytics data:', error);
      setError('Failed to load skill analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data for skills distribution
  const prepareSkillsDistributionChart = () => {
    if (!analyticsData || !analyticsData.skills_distribution) return null;

    const { labels, counts } = analyticsData.skills_distribution;
    const backgroundColors = [
      'rgba(124, 58, 237, 0.8)',   // purple-600
      'rgba(79, 70, 229, 0.8)',    // indigo-600
      'rgba(37, 99, 235, 0.8)',    // blue-600
    ];

    return {
      labels,
      datasets: [
        {
          data: counts,
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

  // Prepare chart data for senior level analysis
  const prepareSeniorLevelChart = () => {
    if (!analyticsData || !analyticsData.senior_level_analysis || !analyticsData.senior_level_analysis.scores) return null;

    const { scores } = analyticsData.senior_level_analysis;
    const labels = ['Frontend', 'Backend', 'DevOps'];
    const data = [scores.frontend, scores.backend, scores.devops];

    return {
      labels,
      datasets: [
        {
          label: 'Skill Proficiency',
          data,
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          borderColor: 'rgba(124, 58, 237, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(124, 58, 237, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(124, 58, 237, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
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
          Add some skills to see analytics data here.
        </p>
      </div>
    );
  }

  const skillsDistributionChartData = prepareSkillsDistributionChart();
  const seniorLevelChartData = prepareSeniorLevelChart();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with title */}
      <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Skill Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Analyze your developer skill level</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('study-list')}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                activeTab === 'study-list'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Study List
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <>
          {/* Senior Level Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6a3 3 0 013-3h2a3 3 0 013 3v2a3 3 0 01-3 3H9a3 3 0 01-3-3V6z" clipRule="evenodd" />
                <path d="M13 10a3 3 0 013 3v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1a3 3 0 013-3h6z" />
              </svg>
              Developer Level Assessment
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Based on your skill distribution</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                      analyticsData.senior_level_analysis.level === 'Senior'
                        ? 'bg-green-500'
                        : analyticsData.senior_level_analysis.level === 'Mid-level'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}>
                      {analyticsData.senior_level_analysis.scores.overall}%
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
                    {analyticsData.senior_level_analysis.level} Developer
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    {analyticsData.senior_level_analysis.analysis}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${
                        analyticsData.senior_level_analysis.scores.frontend >= 80
                          ? 'bg-green-500'
                          : analyticsData.senior_level_analysis.scores.frontend >= 50
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}>
                        {analyticsData.senior_level_analysis.scores.frontend}%
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Frontend</p>
                    </div>
                    <div className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${
                        analyticsData.senior_level_analysis.scores.backend >= 80
                          ? 'bg-green-500'
                          : analyticsData.senior_level_analysis.scores.backend >= 50
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}>
                        {analyticsData.senior_level_analysis.scores.backend}%
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Backend</p>
                    </div>
                    <div className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${
                        analyticsData.senior_level_analysis.scores.devops >= 80
                          ? 'bg-green-500'
                          : analyticsData.senior_level_analysis.scores.devops >= 50
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}>
                        {analyticsData.senior_level_analysis.scores.devops}%
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">DevOps</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-4">Skill Proficiency Radar</h4>
                  <div className="h-64">
                    {seniorLevelChartData ? (
                      <Radar
                        data={seniorLevelChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              angleLines: {
                                display: true,
                                color: 'rgba(156, 163, 175, 0.2)'
                              },
                              grid: {
                                color: 'rgba(156, 163, 175, 0.2)'
                              },
                              pointLabels: {
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                }
                              },
                              suggestedMin: 0,
                              suggestedMax: 100,
                              ticks: {
                                stepSize: 20,
                                backdropColor: 'transparent'
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
                              callbacks: {
                                label: function(context) {
                                  return `Proficiency: ${context.parsed.r}%`;
                                }
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
              </div>
            </div>
          </div>

          {/* Stats and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-300">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Skills Distribution
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Breakdown of your skills by category</p>
              <div className="h-64 flex items-center justify-center">
                {skillsDistributionChartData ? (
                  <Pie
                    data={skillsDistributionChartData}
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

            {/* Top Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-400">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Top Skills
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Your most important skills</p>

              {analyticsData.top_skills && analyticsData.top_skills.length > 0 ? (
                <ul className="space-y-3 mt-6">
                  {analyticsData.top_skills.map((skill, index) => (
                    <li key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                        style={{
                          backgroundColor:
                            skill.category === 'frontend' ? 'rgba(124, 58, 237, 0.8)' :
                            skill.category === 'backend' ? 'rgba(79, 70, 229, 0.8)' :
                            'rgba(37, 99, 235, 0.8)'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-md font-semibold text-gray-800 dark:text-white">{skill.name}</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                skill.proficiency >= 80 ? 'bg-green-500' :
                                skill.proficiency >= 50 ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${skill.proficiency || 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{skill.proficiency || 100}%</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{skill.category}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 dark:text-gray-400">No top skills available</p>
                </div>
              )}
            </div>
          </div>

          {/* Total Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl animate-fadeIn animation-delay-500">
            <div className="flex items-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white mr-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Total Skills: {analyticsData.total_skills}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {analyticsData.total_skills < 5 ? 'Keep adding more skills to improve your profile!' :
                  analyticsData.total_skills < 10 ? 'Good progress! Continue expanding your skill set.' :
                  'Impressive skill set! You have a diverse range of abilities.'}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <StudyListComponent />
      )}
    </div>
  );
};

export default SkillAnalyticsDashboard;
