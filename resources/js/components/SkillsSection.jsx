import React from 'react';
import SkillsManager from './SkillsManager';

const SkillsSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Skills Management
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your skills and expertise displayed on your portfolio.
        </p>
      </div>
      <div className="p-6">
        <SkillsManager />
      </div>
    </div>
  );
};

export default SkillsSection;
