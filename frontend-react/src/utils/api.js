import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeContent = async (inputType, content, options) => {
  const snakeOptions = {
    mask: options.mask,
    block_high_risk: options.blockHighRisk,
    log_analysis: options.logAnalysis
  };
  const response = await api.post('/analyze', {
    input_type: inputType,
    content,
    options: snakeOptions
  });
  return response.data;
};

export const analyzeUpload = async (file, inputType, options) => {
  const snakeOptions = {
    mask: options.mask,
    block_high_risk: options.blockHighRisk,
    log_analysis: options.logAnalysis
  };
  const formData = new FormData();
  formData.append('file', file);
  formData.append('input_type', inputType);
  formData.append('options', JSON.stringify(snakeOptions));

  const response = await api.post('/analyze/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;