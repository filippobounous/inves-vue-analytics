
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SettingsContextType {
  // Display preferences
  defaultCurrency: string;
  dateFormat: string;
  chartTheme: 'auto' | 'light' | 'dark';
  
  // Data preferences
  defaultDateRange: number; // days
  autoRefreshInterval: number; // seconds
  showTooltips: boolean;
  
  // API preferences
  useTestData: boolean;
  apiTimeout: number; // seconds
  
  // Chart preferences
  defaultChartType: 'line' | 'area' | 'candlestick';
  showGrid: boolean;
  showLegend: boolean;
  
  // Update functions
  updateSettings: (settings: Partial<Omit<SettingsContextType, 'updateSettings'>>) => void;
}

const defaultSettings: Omit<SettingsContextType, 'updateSettings'> = {
  defaultCurrency: 'USD',
  dateFormat: 'YYYY-MM-DD',
  chartTheme: 'auto',
  defaultDateRange: 252, // 1 year
  autoRefreshInterval: 300, // 5 minutes
  showTooltips: true,
  useTestData: true,
  apiTimeout: 30,
  defaultChartType: 'line',
  showGrid: true,
  showLegend: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Omit<SettingsContextType, 'updateSettings'>>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('murgenere-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Omit<SettingsContextType, 'updateSettings'>>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('murgenere-settings', JSON.stringify(updatedSettings));
  };

  const contextValue: SettingsContextType = {
    ...settings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
