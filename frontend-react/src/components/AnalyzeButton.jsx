import React from 'react';
import { Search, Loader2 } from 'lucide-react';

const AnalyzeButton = ({ onClick, disabled, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl
        ${disabled || loading
          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
        }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <Search className="w-6 h-6" />
          <span>Analyze Content</span>
        </>
      )}
    </button>
  );
};

export default AnalyzeButton;