import { createContext } from 'react';

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
  updateSettings: (
    settings: Partial<Omit<SettingsContextType, 'updateSettings'>>,
  ) => void;
}

export const defaultSettings: Omit<SettingsContextType, 'updateSettings'> = {
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

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);
