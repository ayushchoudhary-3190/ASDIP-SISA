export const getRiskColors = (risk) => {
  const colors = {
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-500'
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-500'
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      badge: 'bg-yellow-500'
    },
    low: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-500'
    }
  };
  return colors[risk?.toLowerCase()] || colors.low;
};

export const getActionColors = (action) => {
  const colors = {
    blocked: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400'
    },
    masked: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-400'
    },
    allowed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400'
    }
  };
  return colors[action?.toLowerCase()] || colors.allowed;
};

export const formatRiskLevel = (risk) => {
  if (!risk) return 'Unknown';
  return risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase();
};

export const formatAction = (action) => {
  if (!action) return 'Unknown';
  return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
};

export const formatFindingType = (type) => {
  if (!type) return 'Unknown';
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export const truncateValue = (value, maxLength = 50) => {
  if (!value) return 'N/A';
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength) + '...';
};

export const getInputTypeLabel = (type) => {
  const labels = {
    text: 'Plain Text',
    file: 'File Upload',
    sql: 'SQL Query',
    chat: 'Chat Conversation',
    log: 'Log File'
  };
  return labels[type] || type;
};

export const getInputTypeIcon = (type) => {
  const icons = {
    text: 'FileText',
    file: 'Upload',
    sql: 'Database',
    chat: 'MessageSquare',
    log: 'Terminal'
  };
  return icons[type] || 'FileText';
};

export const getAcceptedFileTypes = (inputType) => {
  const types = {
    file: ['.txt', '.log', '.pdf', '.docx'],
    log: ['.log', '.txt']
  };
  return types[inputType] || [];
};