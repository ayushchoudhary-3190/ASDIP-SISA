import React, { useMemo } from 'react';
import { getRiskColors } from '../utils/formatters';

const LogViewer = ({ content, findings = [] }) => {
  const linesWithFindings = useMemo(() => {
    const map = new Map();
    findings.forEach(finding => {
      if (finding.line) {
        const existing = map.get(finding.line) || [];
        existing.push(finding);
        map.set(finding.line, existing);
      }
    });
    return map;
  }, [findings]);

  const logLines = useMemo(() => {
    if (!content) return [];
    return content.split('\n');
  }, [content]);

  if (!content || logLines.length === 0) {
    return null;
  }

  const maxLineNumber = logLines.length.toString().length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          Log Viewer
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
            {logLines.length} lines
          </span>
        </h3>
      </div>

      <div className="max-h-[500px] overflow-auto">
        <pre className="text-sm font-mono leading-relaxed">
          {logLines.map((line, index) => {
            const lineNumber = index + 1;
            const findingsForLine = linesWithFindings.get(lineNumber);
            const hasFindings = findingsForLine && findingsForLine.length > 0;
            const highestRisk = hasFindings 
              ? findingsForLine.reduce((max, f) => {
                  const order = { critical: 4, high: 3, medium: 2, low: 1 };
                  return (order[f.risk] || 0) > (order[max?.risk] || 0) ? f : max;
                }, findingsForLine[0])
              : null;
            
            return (
              <div 
                key={lineNumber}
                className={`flex group transition-colors ${
                  hasFindings 
                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <span className="flex-shrink-0 w-16 px-3 py-0.5 text-gray-400 dark:text-gray-500 text-right select-none border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  {lineNumber}
                </span>
                <span className="flex-1 px-4 py-0.5 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                  {line || ' '}
                </span>
                {hasFindings && (
                  <span className="flex-shrink-0 px-2 py-0.5">
                    {highestRisk && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColors(highestRisk.risk).bg} ${getRiskColors(highestRisk.risk).text}`}>
                        {highestRisk.risk}
                      </span>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </pre>
      </div>

      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {linesWithFindings.size} lines with security findings highlighted
        </p>
      </div>
    </div>
  );
};

export default LogViewer;