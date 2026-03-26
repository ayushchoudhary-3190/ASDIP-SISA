import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Ready to Analyze
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Select an input type, enter your content or upload a file, and click Analyze to scan for security risks.
      </p>
    </div>
  );
};

export default EmptyState;