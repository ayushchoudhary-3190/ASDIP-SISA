import React from 'react';
import { getInputTypeLabel } from '../utils/formatters';

const placeholders = {
  text: 'Enter text to analyze for security risks...',
  sql: 'Enter SQL query to analyze for injection vulnerabilities...',
  chat: 'Enter chat conversation to analyze for sensitive data...'
};

const TextInputArea = ({ content, onContentChange, inputType }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {getInputTypeLabel(inputType)}
      </label>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={placeholders[inputType] || 'Enter content to analyze...'}
        className="w-full h-48 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800
          transition-all duration-200 resize-none font-mono text-sm"
        spellCheck={false}
      />
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
};

export default TextInputArea;