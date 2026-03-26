import React from 'react';
import { EyeOff, Shield, Terminal } from 'lucide-react';

const OptionsPanel = ({ options, onOptionChange, showLogOption = false }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        Analysis Options
      </h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <input
            type="checkbox"
            checked={options.mask}
            onChange={(e) => onOptionChange('mask', e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mask sensitive values
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Replace detected sensitive data with ***MASKED***
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <input
            type="checkbox"
            checked={options.blockHighRisk}
            onChange={(e) => onOptionChange('blockHighRisk', e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Block high-risk findings
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Return blocked action for critical or high-risk items
            </p>
          </div>
        </label>

        {showLogOption && (
          <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <input
              type="checkbox"
              checked={options.logAnalysis}
              onChange={(e) => onOptionChange('logAnalysis', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <Terminal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable log analysis
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Parse log files with line number tracking
              </p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default OptionsPanel;