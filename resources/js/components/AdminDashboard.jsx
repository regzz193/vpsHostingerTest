import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLogin from './AdminLogin';
import ProfileSettings from './ProfileSettings';
import FeaturedProjects from './FeaturedProjects';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('inbox');

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages from the API
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a message as read when it's selected
  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.read) {
      try {
        // Update in the backend
        await axios.put(`/api/messages/${message.id}/read`);

        // Update in the frontend
        const updatedMessages = messages.map(msg =>
          msg.id === message.id ? { ...msg, read: true } : msg
        );
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Administrator Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 rounded-md transition duration-300 shadow-sm flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V8z" clipRule="evenodd" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Dashboard Menu
                </h2>
              </div>
              <nav className="p-4">
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setActiveSection('inbox')}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === 'inbox'
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-200 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${activeSection === 'inbox' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>Inbox</span>
                      {messages.filter(m => !m.read).length > 0 && (
                        <span className="ml-auto bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {messages.filter(m => !m.read).length}
                        </span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('settings')}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === 'settings'
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-200 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${activeSection === 'settings' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('projects')}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === 'projects'
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-200 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${activeSection === 'projects' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span>Featured Projects</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('analytics')}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === 'analytics'
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-200 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${activeSection === 'analytics' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <span>Analytics</span>
                    </button>
                  </li>
                  <li className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="/"
                      className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Back to Portfolio</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeSection === 'inbox' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Message Inbox
                    {messages.filter(m => !m.read).length > 0 && (
                      <span className="ml-2 bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                        {messages.filter(m => !m.read).length} new
                      </span>
                    )}
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : error ? (
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
                      onClick={fetchMessages}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Try Again
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 m-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Messages Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                      When someone sends you a message through the contact form, it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    {/* Message List */}
                    <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 max-h-[600px] overflow-y-auto">
                      <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {messages.length} {messages.length === 1 ? 'message' : 'messages'} • {messages.filter(m => !m.read).length} unread
                        </div>
                      </div>
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {messages.map(message => (
                          <li
                            key={message.id}
                            className={`cursor-pointer transition-colors duration-150 ${
                              selectedMessage && selectedMessage.id === message.id
                                ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                            }`}
                            onClick={() => handleSelectMessage(message)}
                          >
                            <div className="px-4 py-4">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {message.sender}
                                </span>
                                <div className="flex items-center">
                                  {!message.read && (
                                    <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                  )}
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(message.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <p className={`text-sm mt-1 ${!message.read ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                                {message.subject}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {message.content.substring(0, 60)}...
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Message Content */}
                    <div className="w-full md:w-2/3 p-6 bg-white dark:bg-gray-800">
                      {selectedMessage ? (
                        <div className="animate-fadeIn">
                          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                              {selectedMessage.subject}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center mb-2 sm:mb-0">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                                    {selectedMessage.sender.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span><span className="font-medium">From:</span> {selectedMessage.sender} ({selectedMessage.email})</span>
                              </div>
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {new Date(selectedMessage.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {selectedMessage.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <a
                              href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-sm flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Reply via Email
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Select a message to read
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : activeSection === 'settings' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Profile Settings
                  </h2>
                </div>
                <div className="p-6">
                  <ProfileSettings />
                </div>
              </div>
            ) : activeSection === 'analytics' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Visitor Analytics
                  </h2>
                </div>
                <div className="p-6">
                  <AnalyticsDashboard />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Featured Projects
                  </h2>
                </div>
                <div className="p-6">
                  <FeaturedProjects />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
