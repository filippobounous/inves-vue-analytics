import React, { useState, useEffect } from 'react';

import {
  SettingsContext,
  defaultSettings,
  type SettingsContextType,
} from './settings-context';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] =
    useState<Omit<SettingsContextType, 'updateSettings'>>(defaultSettings);

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

  const updateSettings = (
    newSettings: Partial<Omit<SettingsContextType, 'updateSettings'>>,
  ) => {
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
