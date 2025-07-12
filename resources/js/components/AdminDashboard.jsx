import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Sample messages data - in a real app, this would come from an API
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      subject: 'Website Feedback',
      content: 'I really like your new portfolio website. The design is clean and professional.',
      date: '2023-06-15',
      read: false
    },
    {
      id: 2,
      sender: 'Jane Smith',
      subject: 'Collaboration Opportunity',
      content: 'I would like to discuss a potential collaboration on an upcoming project. Please let me know when you are available for a call.',
      date: '2023-06-10',
      read: true
    },
    {
      id: 3,
      sender: 'Tech Conference',
      subject: 'Speaker Invitation',
      content: 'We would like to invite you to speak at our upcoming tech conference about your experience as a full-stack developer.',
      date: '2023-06-05',
      read: false
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  // Mark a message as read when it's selected
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);

    if (!message.read) {
      const updatedMessages = messages.map(msg =>
        msg.id === message.id ? { ...msg, read: true } : msg
      );
      setMessages(updatedMessages);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Administrator Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Dashboard Menu
              </h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 font-medium"
                    >
                      Inbox
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Back to Portfolio
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Message Inbox
                </h2>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Message List */}
                <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {messages.map(message => (
                      <li
                        key={message.id}
                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedMessage && selectedMessage.id === message.id
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : ''
                        }`}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {message.sender}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {message.date}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${!message.read ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                            {message.subject}
                          </p>
                          {!message.read && (
                            <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-1"></span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Message Content */}
                <div className="w-full md:w-2/3 p-6">
                  {selectedMessage ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                          {selectedMessage.subject}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <span>From: {selectedMessage.sender}</span>
                          <span>{selectedMessage.date}</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            {selectedMessage.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300">
                          Reply
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300">
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
