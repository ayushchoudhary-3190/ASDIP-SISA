import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import InputSelector from './components/InputSelector';
import TextInputArea from './components/TextInputArea';
import FileUploader from './components/FileUploader';
import OptionsPanel from './components/OptionsPanel';
import AnalyzeButton from './components/AnalyzeButton';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import RiskSummaryCard from './components/RiskSummaryCard';
import FindingsTable from './components/FindingsTable';
import LogViewer from './components/LogViewer';
import InsightsPanel from './components/InsightsPanel';
import EmptyState from './components/EmptyState';
import { useAnalysis } from './hooks/useAnalysis';
import './App.css';

const initialOptions = {
  mask: false,
  blockHighRisk: false,
  logAnalysis: false
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState(initialOptions);

  const { results, loading, error, blocked, analyze, reset } = useAnalysis();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleInputTypeChange = useCallback((type) => {
    setInputType(type);
    setContent('');
    setFile(null);
    reset();
  }, [reset]);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleFileUpload = useCallback((uploadedFile) => {
    setFile(uploadedFile);
  }, []);

  const handleOptionChange = useCallback((option, value) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  }, []);

  const canAnalyze = useCallback(() => {
    if (inputType === 'file' || inputType === 'log') {
      return file !== null;
    }
    return content.trim().length > 0;
  }, [inputType, content, file]);

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze()) return;

    try {
      await analyze(inputType, content, options, file);
    } catch (err) {
      console.error('Analysis error:', err);
    }
  }, [inputType, content, options, file, analyze, canAnalyze]);

  const handleRetry = useCallback(() => {
    handleAnalyze();
  }, [handleAnalyze]);

  const showLogViewer = inputType === 'log' && results && content;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <InputSelector 
                inputType={inputType} 
                onInputTypeChange={handleInputTypeChange} 
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              {(inputType === 'text' || inputType === 'sql' || inputType === 'chat') && (
                <TextInputArea
                  content={content}
                  onContentChange={handleContentChange}
                  inputType={inputType}
                />
              )}

              {(inputType === 'file' || inputType === 'log') && (
                <FileUploader
                  onFileUpload={handleFileUpload}
                  inputType={inputType}
                />
              )}

              <div className="mt-4">
                <AnalyzeButton
                  onClick={handleAnalyze}
                  disabled={!canAnalyze()}
                  loading={loading}
                />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-6">
            {loading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <LoadingSpinner message="Analyzing your content for security risks..." />
              </div>
            )}

            {error && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <ErrorMessage message={error} onRetry={handleRetry} />
              </div>
            )}

            {results && !loading && (
              <>
                {blocked && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-400">Request Blocked</p>
                        <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                          {blocked.reason || 'Content blocked due to security policy. Disable "Block high-risk findings" option to analyze this content.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <RiskSummaryCard
                  riskScore={results.risk_score}
                  riskLevel={results.risk_level}
                  action={results.action}
                  summary={results.summary}
                />

                <FindingsTable findings={results.findings} />

                {showLogViewer && (
                  <LogViewer content={content} findings={results.findings} />
                )}

                <InsightsPanel insights={results.insights} />
              </>
            )}

            {!results && !loading && !error && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <EmptyState />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;