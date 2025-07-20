import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudyListComponent = () => {
  const [studyList, setStudyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notes, setNotes] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [status, setStatus] = useState({
    saving: false,
    success: false,
    error: null
  });

  useEffect(() => {
    fetchStudyList();
  }, []);

  const fetchStudyList = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/skills/study-list');
      setStudyList(response.data.data);
    } catch (error) {
      console.error('Error fetching study list:', error);
      setError('Failed to load study list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStudy = async (id) => {
    try {
      const response = await axios.put(`/api/skills/${id}/toggle-study`);

      // Update local state
      setStudyList(prevList => prevList.filter(skill => skill.id !== id));

      setStatus({
        saving: false,
        success: true,
        error: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error toggling study status:', error);
      setStatus({
        saving: false,
        success: false,
        error: error.response?.data?.errors || 'Failed to update study status. Please try again.'
      });
    }
  };

  const startEditingNotes = (skill) => {
    setEditingNotes(skill.id);
    setNotes(skill.study_notes || '');
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setNotes('');
  };

  const saveNotes = async (id) => {
    setStatus({ ...status, saving: true, success: false, error: null });

    try {
      const response = await axios.put(`/api/skills/${id}/study-notes`, {
        study_notes: notes
      });

      // Update local state
      setStudyList(prevList =>
        prevList.map(skill =>
          skill.id === id ? { ...skill, study_notes: notes } : skill
        )
      );

      setEditingNotes(null);
      setStatus({
        saving: false,
        success: true,
        error: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
      setStatus({
        saving: false,
        success: false,
        error: error.response?.data?.errors || 'Failed to save notes. Please try again.'
      });
    }
  };

  const updateProficiency = async (id, newProficiency) => {
    setStatus({ ...status, saving: true, success: false, error: null });

    try {
      const response = await axios.put(`/api/skills/${id}/proficiency`, {
        proficiency: newProficiency
      });

      // Update local state
      setStudyList(prevList =>
        prevList.map(skill =>
          skill.id === id ? { ...skill, proficiency: newProficiency } : skill
        )
      );

      setStatus({
        saving: false,
        success: true,
        error: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error updating proficiency:', error);
      setStatus({
        saving: false,
        success: false,
        error: error.response?.data?.errors || 'Failed to update proficiency. Please try again.'
      });
    }
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
          onClick={fetchStudyList}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  // Filter study list based on active category
  const filteredStudyList = activeCategory === 'all'
    ? studyList
    : studyList.filter(skill => skill.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900/20">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Skills to Study</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Track your learning progress and update proficiency as you improve</p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          All Skills
        </button>
        <button
          onClick={() => setActiveCategory('frontend')}
          className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
            activeCategory === 'frontend'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Frontend
        </button>
        <button
          onClick={() => setActiveCategory('backend')}
          className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
            activeCategory === 'backend'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Backend
        </button>
        <button
          onClick={() => setActiveCategory('devops')}
          className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
            activeCategory === 'devops'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          DevOps
        </button>
      </div>

      {status.success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your changes have been saved successfully.</span>
        </div>
      )}

      {status.error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {typeof status.error === 'string' ? status.error : 'Failed to save changes. Please try again.'}</span>
        </div>
      )}

      {studyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Skills in Study List</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Add skills to your study list by toggling the "To Study" option when editing a skill.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {studyList.map(skill => (
            <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{skill.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{skill.category}</p>
                </div>
                <button
                  onClick={() => handleToggleStudy(skill.id)}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors duration-200"
                >
                  Remove from Study List
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      skill.proficiency >= 80 ? 'bg-green-500' :
                      skill.proficiency >= 50 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => updateProficiency(skill.id, Math.max(1, skill.proficiency - 5))}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
                    disabled={skill.proficiency <= 1}
                  >
                    -5%
                  </button>
                  <div className="space-x-1">
                    {[25, 50, 75, 100].map(value => (
                      <button
                        key={value}
                        onClick={() => updateProficiency(skill.id, value)}
                        className={`px-2 py-1 rounded text-sm ${
                          skill.proficiency === value
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => updateProficiency(skill.id, Math.min(100, skill.proficiency + 5))}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
                    disabled={skill.proficiency >= 100}
                  >
                    +5%
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Notes</span>
                  {editingNotes !== skill.id && (
                    <button
                      onClick={() => startEditingNotes(skill)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {skill.study_notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                  )}
                </div>

                {editingNotes === skill.id ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows="3"
                      placeholder="Add your study notes here..."
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={cancelEditingNotes}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveNotes(skill.id)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md min-h-[60px]">
                    {skill.study_notes ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{skill.study_notes}</p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No study notes yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyListComponent;
