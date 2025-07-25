import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillsManager = () => {
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    devops: []
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'frontend',
    proficiency: 100,
    to_study: false
  });

  const [editingSkill, setEditingSkill] = useState(null);

  const [status, setStatus] = useState({
    loading: true,
    saving: false,
    success: false,
    error: null
  });

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setStatus({ ...status, loading: true, error: null });

    try {
      const response = await axios.get('/api/skills/grouped');
      setSkills(response.data.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setStatus({
        ...status,
        loading: false,
        error: 'Failed to load skills. Please try again.'
      });
    } finally {
      setStatus(prevStatus => ({ ...prevStatus, loading: false }));
    }
  };

  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditingSkillChange = (e) => {
    const { name, value } = e.target;
    setEditingSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = async (e) => {
    e.preventDefault();

    if (!newSkill.name.trim()) {
      return;
    }

    setStatus({ ...status, saving: true, success: false, error: null });

    try {
      // Ensure study_notes is a string if it exists
      const skillToCreate = { ...newSkill };
      if (skillToCreate.study_notes === null || skillToCreate.study_notes === undefined) {
        skillToCreate.study_notes = '';
      } else if (typeof skillToCreate.study_notes !== 'string') {
        skillToCreate.study_notes = String(skillToCreate.study_notes);
      }

      const response = await axios.post('/api/skills', skillToCreate);

      // Update local state
      setSkills(prev => {
        const updated = { ...prev };
        if (!updated[newSkill.category]) {
          updated[newSkill.category] = [];
        }
        updated[newSkill.category].push(response.data.data);
        return updated;
      });

      // Reset form
      setNewSkill({
        name: '',
        category: 'frontend',
        proficiency: 100,
        to_study: false
      });

      setStatus({ ...status, saving: false, success: true });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error adding skill:', error);
      setStatus({
        ...status,
        saving: false,
        error: error.response?.data?.errors || 'Failed to add skill. Please try again.'
      });
    }
  };

  const startEditing = (skill) => {
    setEditingSkill({ ...skill });
  };

  const cancelEditing = () => {
    setEditingSkill(null);
  };

  const updateSkill = async () => {
    if (!editingSkill || !editingSkill.name.trim()) {
      return;
    }

    // Ensure study_notes is a string before sending to the API
    const skillToUpdate = { ...editingSkill };
    if (skillToUpdate.study_notes === null || skillToUpdate.study_notes === undefined) {
      skillToUpdate.study_notes = '';
    } else if (typeof skillToUpdate.study_notes !== 'string') {
      skillToUpdate.study_notes = String(skillToUpdate.study_notes);
    }

    setStatus({ ...status, saving: true, success: false, error: null });

    try {
      const response = await axios.put(`/api/skills/${editingSkill.id}`, skillToUpdate);

      // If category changed, we need to refetch all skills to get the correct order
      if (response.data.data.category !== editingSkill.category) {
        await fetchSkills();
      } else {
        // Update local state
        setSkills(prev => {
          const updated = { ...prev };
          const category = response.data.data.category;

          const index = updated[category].findIndex(s => s.id === editingSkill.id);
          if (index !== -1) {
            updated[category][index] = response.data.data;
          }

          return updated;
        });
      }

      setEditingSkill(null);
      setStatus({ ...status, saving: false, success: true });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error updating skill:', error);
      setStatus({
        ...status,
        saving: false,
        error: error.response?.data?.errors || 'Failed to update skill. Please try again.'
      });
    }
  };

  const deleteSkill = async (id, category) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    setStatus({ ...status, saving: true, success: false, error: null });

    try {
      await axios.delete(`/api/skills/${id}`);

      // Update local state
      setSkills(prev => {
        const updated = { ...prev };
        updated[category] = updated[category].filter(skill => skill.id !== id);
        return updated;
      });

      setStatus({ ...status, saving: false, success: true });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({ ...prevStatus, success: false }));
      }, 3000);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setStatus({
        ...status,
        saving: false,
        error: error.response?.data?.errors || 'Failed to delete skill. Please try again.'
      });
    }
  };

  const moveSkill = async (id, category, direction) => {
    const categorySkills = skills[category];
    const index = categorySkills.findIndex(skill => skill.id === id);

    if ((direction === 'up' && index === 0) ||
        (direction === 'down' && index === categorySkills.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap orders
    const updatedSkills = [...categorySkills];
    const temp = updatedSkills[index].order;
    updatedSkills[index].order = updatedSkills[newIndex].order;
    updatedSkills[newIndex].order = temp;

    // Swap positions in array for immediate UI update
    [updatedSkills[index], updatedSkills[newIndex]] = [updatedSkills[newIndex], updatedSkills[index]];

    // Update local state
    setSkills(prev => ({
      ...prev,
      [category]: updatedSkills
    }));

    // Update in backend
    try {
      await axios.post('/api/skills/reorder', {
        skills: [
          { id: updatedSkills[index].id, order: updatedSkills[index].order },
          { id: updatedSkills[newIndex].id, order: updatedSkills[newIndex].order }
        ]
      });
    } catch (error) {
      console.error('Error reordering skills:', error);
      // Revert changes on error
      fetchSkills();
    }
  };

  const renderSkillsList = (category, title, iconColor) => {
    const categorySkills = skills[category] || [];

    return (
      <div className="mb-8">
        <h3 className={`text-lg font-medium ${iconColor} mb-4`}>
          {title}
        </h3>

        {categorySkills.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No skills added yet.</p>
        ) : (
          <ul className="space-y-2">
            {categorySkills.map(skill => (
              <li
                key={skill.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
              >
                {editingSkill && editingSkill.id === skill.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      name="name"
                      value={editingSkill.name}
                      onChange={handleEditingSkillChange}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                    <select
                      name="category"
                      value={editingSkill.category}
                      onChange={handleEditingSkillChange}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps</option>
                    </select>
                    <input
                      type="number"
                      name="proficiency"
                      value={editingSkill.proficiency || 100}
                      onChange={handleEditingSkillChange}
                      min="1"
                      max="100"
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="Proficiency %"
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`to_study_${editingSkill.id}`}
                        name="to_study"
                        checked={editingSkill.to_study || false}
                        onChange={(e) => {
                          // Update the editingSkill state
                          setEditingSkill(prev => ({
                            ...prev,
                            to_study: e.target.checked
                          }));

                          // Also call the toggleStudyStatus endpoint directly
                          axios.put(`/api/skills/${editingSkill.id}/toggle-study`)
                            .then(response => {
                              console.log('Study status toggled:', response.data);
                            })
                            .catch(error => {
                              console.error('Error toggling study status:', error);
                              // Revert the checkbox state if there's an error
                              setEditingSkill(prev => ({
                                ...prev,
                                to_study: !e.target.checked
                              }));
                            });
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`to_study_${editingSkill.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Add to study list
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={updateSkill}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-200">{skill.name}</span>
                        {skill.to_study && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-300">
                            Studying
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{ width: `${skill.proficiency || 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{skill.proficiency || 100}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => moveSkill(skill.id, category, 'up')}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSkill(skill.id, category, 'down')}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditing(skill)}
                        className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id, category)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (status.loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills Management</h3>

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

        <form onSubmit={addSkill} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              value={newSkill.name}
              onChange={handleNewSkillChange}
              placeholder="Add a new skill..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
            <select
              name="category"
              value={newSkill.category}
              onChange={handleNewSkillChange}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
            </select>
            <div className="flex flex-col">
              <label htmlFor="proficiency" className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Proficiency (%)
              </label>
              <input
                type="number"
                name="proficiency"
                value={newSkill.proficiency}
                onChange={handleNewSkillChange}
                min="1"
                max="100"
                className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="flex items-center self-end">
              <input
                type="checkbox"
                id="to_study_new"
                name="to_study"
                checked={newSkill.to_study}
                onChange={(e) => setNewSkill(prev => ({
                  ...prev,
                  to_study: e.target.checked
                }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="to_study_new" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Add to study list
              </label>
            </div>
            <button
              type="submit"
              disabled={status.saving}
              className={`px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 ${
                status.saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {status.saving ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>

        {renderSkillsList('frontend', 'Frontend Development', 'text-purple-600 dark:text-purple-400')}
        {renderSkillsList('backend', 'Backend Development', 'text-blue-600 dark:text-blue-400')}
        {renderSkillsList('devops', 'DevOps & Tools', 'text-green-600 dark:text-green-400')}
      </div>
    </div>
  );
};

export default SkillsManager;
