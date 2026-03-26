import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { getAcceptedFileTypes } from '../utils/formatters';

const FileUploader = ({ onFileUpload, inputType }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const acceptedTypes = getAcceptedFileTypes(inputType);

  const isValidFile = useCallback((file) => {
    if (!file) return false;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    return acceptedTypes.includes(ext);
  }, [acceptedTypes]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
        onFileUpload(droppedFile);
      } else {
        setError(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
        setError(null);
        onFileUpload(selectedFile);
      } else {
        setError(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    onFileUpload(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        Upload File
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
            ${dragOver 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
        >
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supported formats: {acceptedTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            aria-label="Remove file"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;