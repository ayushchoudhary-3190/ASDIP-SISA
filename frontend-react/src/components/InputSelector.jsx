import React from 'react';
import { FileText, Upload, Database, MessageSquare, Terminal } from 'lucide-react';
import { getInputTypeLabel } from '../utils/formatters';

const inputTypes = [
  { id: 'text', label: 'Plain Text', icon: FileText, description: 'Analyze plain text input' },
  { id: 'file', label: 'File Upload', icon: Upload, description: 'Upload and analyze files' },
  { id: 'sql', label: 'SQL Query', icon: Database, description: 'Analyze SQL queries for injection' },
  { id: 'chat', label: 'Chat Conversation', icon: MessageSquare, description: 'Analyze chat conversations' },
  { id: 'log', label: 'Log File', icon: Terminal, description: 'Analyze log files for security issues' }
];

const InputSelector = ({ inputType, onInputTypeChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        Input Type
      </h3>
      <div className="space-y-2">
        {inputTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onInputTypeChange(type.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${inputType === type.id 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }`}
          >
            <div className={`flex-shrink-0 p-2 rounded-lg ${
              inputType === type.id 
                ? 'bg-indigo-100 dark:bg-indigo-800' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <type.icon className={`w-5 h-5 ${
                inputType === type.id 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">
                {type.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {type.description}
              </p>
            </div>
            {inputType === type.id && (
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputSelector;