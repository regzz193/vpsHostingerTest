import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileSettings = () => {
  const [settings, setSettings] = useState({
    email: '',
    phone: '',
    location: '',
    about_me_1: '',
    about_me_2: '',
    about_me_3: ''
  });

  const [status, setStatus] = useState({
    loading: true,
    saving: false,
    success: false,
    error: null
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setStatus({ ...status, loading: true, error: null });

    try {
      const response = await axios.get('/api/profile-settings');
      setSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setStatus({
        ...status,
        loading: false,
        error: 'Failed to load settings. Please try again.'
      });
    } finally {
      setStatus(prevStatus => ({ ...prevStatus, loading: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ ...status, saving: true, success: false, error: null });

    try {
      // Convert settings object to array of key-value pairs
      const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }));

      await axios.post('/api/profile-settings/batch', {
        settings: settingsArray
      });

      setStatus({ ...status, saving: false, success: true });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus({
        ...status,
        saving: false,
        error: error.response?.data?.errors || 'Failed to save settings. Please try again.'
      });
    }
  };

  if (status.loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your contact information and about me section.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {status.success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your settings have been saved successfully.</span>
          </div>
        )}

        {status.error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {typeof status.error === 'string' ? status.error : 'Failed to save settings. Please try again.'}</span>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={settings.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={settings.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About Me</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="about_me_1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Paragraph 1
                </label>
                <textarea
                  id="about_me_1"
                  name="about_me_1"
                  value={settings.about_me_1 || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="about_me_2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Paragraph 2
                </label>
                <textarea
                  id="about_me_2"
                  name="about_me_2"
                  value={settings.about_me_2 || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="about_me_3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Paragraph 3
                </label>
                <textarea
                  id="about_me_3"
                  name="about_me_3"
                  value={settings.about_me_3 || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={status.saving}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-md hover:opacity-90 transition duration-300 ${
              status.saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {status.saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
