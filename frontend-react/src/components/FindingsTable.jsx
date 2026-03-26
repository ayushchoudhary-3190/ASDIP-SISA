import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Filter, Search } from 'lucide-react';
import { getRiskColors, formatFindingType, truncateValue } from '../utils/formatters';

const FindingsTable = ({ findings = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'risk', direction: 'desc' });
  const [filter, setFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const sortedFindings = useMemo(() => {
    let filtered = [...findings];
    
    if (filter) {
      filtered = filtered.filter(f => 
        f.type?.toLowerCase().includes(filter.toLowerCase()) ||
        f.value?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (riskFilter !== 'all') {
      filtered = filtered.filter(f => f.risk?.toLowerCase() === riskFilter);
    }
    
    if (sortConfig.key) {
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => {
        if (sortConfig.key === 'risk') {
          return sortConfig.direction === 'desc' 
            ? (riskOrder[b.risk] || 0) - (riskOrder[a.risk] || 0)
            : (riskOrder[a.risk] || 0) - (riskOrder[b.risk] || 0);
        }
        if (sortConfig.key === 'line') {
          return sortConfig.direction === 'desc' 
            ? (b.line || 0) - (a.line || 0)
            : (a.line || 0) - (b.line || 0);
        }
        return 0;
      });
    }
    
    return filtered;
  }, [findings, sortConfig, filter, riskFilter]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'desc' 
      ? <ChevronDown className="w-4 h-4" />
      : <ChevronUp className="w-4 h-4" />;
  };

  if (findings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No security findings detected</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Security Findings
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm rounded-full">
              {findings.length}
            </span>
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Risks</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">
                  Type <SortIcon column="type" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Risk
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('line')}
              >
                <div className="flex items-center gap-1">
                  Line <SortIcon column="line" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedFindings.map((finding, index) => {
              const colors = getRiskColors(finding.risk);
              return (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatFindingType(finding.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {formatFindingType(finding.risk)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {finding.line !== undefined ? finding.line : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
                      {truncateValue(finding.value, 60)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedFindings.length !== findings.length && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {sortedFindings.length} of {findings.length} findings
          </p>
        </div>
      )}
    </div>
  );
};

export default FindingsTable;