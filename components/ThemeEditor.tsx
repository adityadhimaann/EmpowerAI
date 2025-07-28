import React from 'react';
import { PresentationTheme } from '../types';
import { XIcon, CheckCircleIcon } from './Icons';

interface ThemeEditorProps {
  isVisible: boolean;
  onClose: () => void;
  currentTheme: PresentationTheme;
  onSetTheme: (theme: PresentationTheme) => void;
}

const themes: PresentationTheme[] = [
  { name: 'Default', bg: 'bg-gradient-to-br from-[#0a0d2a] via-[#1a1c4a] to-[#2a2d6a]', accent: 'from-blue-400 to-blue-600', font: 'font-sans' },
  { name: 'Forest', bg: 'bg-gradient-to-br from-gray-800 via-green-900 to-gray-900', accent: 'from-green-400 to-emerald-500', font: 'font-serif' },
  { name: 'Crimson', bg: 'bg-gradient-to-br from-gray-900 via-red-900 to-black', accent: 'from-red-500 to-rose-400', font: 'font-sans' },
  { name: 'Golden', bg: 'bg-gradient-to-br from-yellow-900 via-gray-900 to-yellow-900/80', accent: 'from-amber-400 to-yellow-500', font: 'font-serif' },
  { name: 'Dev Mode', bg: 'bg-gradient-to-br from-gray-900 via-[#050d1a] to-gray-900', accent: 'from-sky-400 to-cyan-300', font: 'font-mono' },
];

const ThemeEditor: React.FC<ThemeEditorProps> = ({ isVisible, onClose, currentTheme, onSetTheme }) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-[#0a0d2a]/90 backdrop-blur-xl border-l border-white/10 text-white p-4 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full animate-slide-out-right'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-editor-title"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 id="theme-editor-title" className="text-xl font-bold">Customize Theme</h3>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10">
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        {themes.map(theme => (
          <button
            key={theme.name}
            onClick={() => onSetTheme(theme)}
            className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${currentTheme.name === theme.name ? 'border-indigo-500' : 'border-white/10 hover:border-white/30'}`}
          >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-6 rounded ${theme.bg}`}></div>
                <span className="font-semibold">{theme.name}</span>
            </div>
            {currentTheme.name === theme.name && <CheckCircleIcon className="w-6 h-6 text-indigo-400" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeEditor;
