import React from 'react';
import { Shield, Eye } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Secure Data Intelligence Platform
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Intelligent Security Analysis
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;