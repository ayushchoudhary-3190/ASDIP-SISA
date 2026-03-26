import { useState, useCallback } from 'react';
import { analyzeContent, analyzeUpload } from '../utils/api';

export const useAnalysis = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blocked, setBlocked] = useState(null);

  const analyze = useCallback(async (inputType, content, options, file = null) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setBlocked(null);

    try {
      let data;
      if (file) {
        data = await analyzeUpload(file, inputType, options);
      } else {
        data = await analyzeContent(inputType, content, options);
      }
      setResults(data);
      return data;
    } catch (err) {
      if (err.response?.status === 403) {
        const blockedData = err.response.data;
        setBlocked(blockedData);
        setResults({
          summary: blockedData.summary || 'Request blocked',
          findings: blockedData.findings || [],
          risk_score: blockedData.risk_score || 0,
          risk_level: blockedData.risk_level || 'critical',
          action: 'blocked',
          insights: [blockedData.reason || 'Content blocked due to security policy']
        });
      } else {
        const errorMessage = err.response?.data?.error || err.message || 'Analysis failed';
        setError(errorMessage);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setBlocked(null);
  }, []);

  return {
    results,
    loading,
    error,
    blocked,
    analyze,
    reset
  };
};

export default useAnalysis;