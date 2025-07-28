import React, { useState } from 'react';
import { PresentationTheme } from '../types';

interface ThemeSelectorProps {
  currentTheme: PresentationTheme;
  onThemeChange: (theme: PresentationTheme) => void;
}

const themes: PresentationTheme[] = [
  {
    name: 'Modern Gradient',
    bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-800',
    accent: 'from-blue-400 to-indigo-400',
    font: 'font-sans'
  },
  {
    name: 'Ocean Breeze',
    bg: 'bg-gradient-to-br from-blue-900 via-teal-800 to-green-700',
    accent: 'from-emerald-400 to-teal-300',
    font: 'font-sans'
  },
  {
    name: 'Sunset Glow',
    bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-slate-800',
    accent: 'from-yellow-400 to-orange-300',
    font: 'font-sans'
  },
  {
    name: 'Cosmic Dark',
    bg: 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900',
    accent: 'from-blue-400 to-indigo-300',
    font: 'font-sans'
  },
  {
    name: 'Forest Deep',
    bg: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700',
    accent: 'from-lime-400 to-green-300',
    font: 'font-sans'
  },
  {
    name: 'Minimalist',
    bg: 'bg-gradient-to-br from-slate-800 via-gray-900 to-slate-800',
    accent: 'from-white to-gray-200',
    font: 'font-mono'
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      >
        <div className={`w-3 h-3 rounded-full ${currentTheme.bg} border border-white/30`}></div>
        <span className="text-xs font-medium hidden sm:block">{currentTheme.name}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl animate-fadeIn mt-2">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-white/80 px-2 py-1 mb-1">Choose Theme</h3>
            {themes.map((theme, index) => (
              <button
                key={index}
                onClick={() => {
                  onThemeChange(theme);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 group ${
                  currentTheme.name === theme.name ? 'bg-white/15 ring-2 ring-white/30' : ''
                }`}
              >
                <div className={`w-6 h-4 rounded ${theme.bg} border border-white/20 shadow-inner flex-shrink-0`}></div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-medium text-white truncate">{theme.name}</div>
                  <div className={`text-xs bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent font-medium truncate`}>
                    Preview accent
                  </div>
                </div>
                {currentTheme.name === theme.name && (
                  <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-white/10 p-2">
            <p className="text-xs text-white/60 text-center">
              Themes apply to presentation mode
            </p>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;
