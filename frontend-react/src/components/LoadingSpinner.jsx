import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-200 rounded-full opacity-50"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;