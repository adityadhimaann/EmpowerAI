import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { SettingsIcon, DownloadIcon, BarChartIcon } from './Icons';

interface SettingsPanelProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ preferences, onUpdatePreferences, onClose }) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);

  const handleSave = () => {
    onUpdatePreferences(localPrefs);
    onClose();
  };

  const handleReset = () => {
    const defaultPrefs: UserPreferences = {
      defaultTheme: 'Modern Gradient',
      autoSave: true,
      animationSpeed: 'normal',
      language: 'en',
      aiModel: 'gemini',
      exportFormat: 'pdf'
    };
    setLocalPrefs(defaultPrefs);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-500/20 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20">
              <SettingsIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-blue-300/70">Customize your EmpowerAI experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-600/50 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Appearance */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-blue-500/20 pb-2">Appearance</h3>
              
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Default Theme</label>
                <select
                  value={localPrefs.defaultTheme}
                  onChange={(e) => setLocalPrefs({...localPrefs, defaultTheme: e.target.value})}
                  className="w-full p-3 bg-blue-900/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Modern Gradient">Modern Gradient</option>
                  <option value="Ocean Breeze">Ocean Breeze</option>
                  <option value="Sunset Glow">Sunset Glow</option>
                  <option value="Cosmic Dark">Cosmic Dark</option>
                  <option value="Forest Deep">Forest Deep</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Animation Speed</label>
                <div className="flex gap-2">
                  {(['slow', 'normal', 'fast'] as const).map(speed => (
                    <button
                      key={speed}
                      onClick={() => setLocalPrefs({...localPrefs, animationSpeed: speed})}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        localPrefs.animationSpeed === speed
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/50'
                      }`}
                    >
                      {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Language</label>
                <select
                  value={localPrefs.language}
                  onChange={(e) => setLocalPrefs({...localPrefs, language: e.target.value as any})}
                  className="w-full p-3 bg-blue-900/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                </select>
              </div>
            </div>

            {/* AI & Export */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-blue-500/20 pb-2">AI & Export</h3>
              
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">AI Model</label>
                <select
                  value={localPrefs.aiModel}
                  onChange={(e) => setLocalPrefs({...localPrefs, aiModel: e.target.value as any})}
                  className="w-full p-3 bg-blue-900/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="gemini">Google Gemini (Current)</option>
                  <option value="gpt">OpenAI GPT (Coming Soon)</option>
                  <option value="claude">Anthropic Claude (Coming Soon)</option>
                </select>
                <p className="text-xs text-blue-400/70 mt-1">Switch between different AI models for content generation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Default Export Format</label>
                <div className="flex gap-2">
                  {(['pdf', 'pptx', 'html'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setLocalPrefs({...localPrefs, exportFormat: format})}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                        localPrefs.exportFormat === format
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/50'
                      }`}
                    >
                      <DownloadIcon className="w-4 h-4" />
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-xl">
                <div>
                  <h4 className="font-medium text-white">Auto Save</h4>
                  <p className="text-sm text-blue-300/70">Automatically save your work</p>
                </div>
                <button
                  onClick={() => setLocalPrefs({...localPrefs, autoSave: !localPrefs.autoSave})}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    localPrefs.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    localPrefs.autoSave ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-blue-400" />
              Advanced Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-900/20 rounded-xl">
                <h4 className="font-medium text-white mb-1">Analytics Dashboard</h4>
                <p className="text-sm text-blue-300/70">Track presentation performance and engagement</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">Coming Soon</span>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-xl">
                <h4 className="font-medium text-white mb-1">Collaboration</h4>
                <p className="text-sm text-blue-300/70">Real-time collaborative editing</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-500/10 bg-black/20 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-blue-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
