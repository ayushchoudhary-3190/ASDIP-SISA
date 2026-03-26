import React from 'react';
import { AlertTriangle, CheckCircle, EyeOff } from 'lucide-react';
import { getRiskColors, getActionColors, formatRiskLevel, formatAction } from '../utils/formatters';

const RiskSummaryCard = ({ riskScore, riskLevel, action, summary }) => {
  const riskColor = getRiskColors(riskLevel);
  const actionColor = getActionColors(action);

  const getActionIcon = () => {
    switch (action?.toLowerCase()) {
      case 'blocked': return <AlertTriangle className="w-4 h-4" />;
      case 'masked': return <EyeOff className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Analysis Summary
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${riskColor.bg} border ${riskColor.border}`}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Risk Score</p>
            <p className={`text-3xl font-bold ${riskColor.text}`}>{riskScore}</p>
          </div>

          <div className={`p-4 rounded-lg ${riskColor.bg} border ${riskColor.border}`}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Risk Level</p>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${riskColor.bg} ${riskColor.text}`}>
              {formatRiskLevel(riskLevel)}
            </span>
          </div>

          <div className={`p-4 rounded-lg ${actionColor.bg} border ${actionColor.border}`}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Action</p>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${actionColor.bg} ${actionColor.text}`}>
              {getActionIcon()}
              {formatAction(action)}
            </span>
          </div>
        </div>

        {summary && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</p>
            <p className="text-gray-600 dark:text-gray-400">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskSummaryCard;