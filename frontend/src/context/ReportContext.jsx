import React, { createContext, useContext, useState } from 'react';

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const resetChat = () => setChatHistory([]);

  const value = {
    currentReport,
    setCurrentReport,
    isLoading,
    setIsLoading,
    loadingStep,
    setLoadingStep,
    chatHistory,
    setChatHistory,
    resetChat,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
}
