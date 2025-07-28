import React from 'react';
import { SettingsIcon, BarChartIcon, DownloadIcon } from './Icons';

interface QuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplates: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics: () => void;
  onExportCurrent: () => void;
}

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  isOpen,
  onClose,
  onOpenTemplates,
  onOpenSettings,
  onOpenAnalytics,
  onExportCurrent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/20 p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { onOpenTemplates(); onClose(); }}
            className="flex flex-col items-center gap-2 p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl transition-colors group"
          >
            <div className="p-2 rounded-lg bg-purple-600/30 group-hover:bg-purple-600/50 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm text-white font-medium">Templates</span>
            <span className="text-xs text-blue-300/70">Ctrl+T</span>
          </button>

          <button
            onClick={() => { onOpenAnalytics(); onClose(); }}
            className="flex flex-col items-center gap-2 p-4 bg-green-600/20 hover:bg-green-600/30 rounded-xl transition-colors group"
          >
            <div className="p-2 rounded-lg bg-green-600/30 group-hover:bg-green-600/50 transition-colors">
              <BarChartIcon className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-white font-medium">Analytics</span>
            <span className="text-xs text-blue-300/70">Ctrl+A</span>
          </button>

          <button
            onClick={() => { onOpenSettings(); onClose(); }}
            className="flex flex-col items-center gap-2 p-4 bg-gray-600/20 hover:bg-gray-600/30 rounded-xl transition-colors group"
          >
            <div className="p-2 rounded-lg bg-gray-600/30 group-hover:bg-gray-600/50 transition-colors">
              <SettingsIcon className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-sm text-white font-medium">Settings</span>
            <span className="text-xs text-blue-300/70">Ctrl+,</span>
          </button>

          <button
            onClick={() => { onExportCurrent(); onClose(); }}
            className="flex flex-col items-center gap-2 p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-colors group"
          >
            <div className="p-2 rounded-lg bg-blue-600/30 group-hover:bg-blue-600/50 transition-colors">
              <DownloadIcon className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-white font-medium">Export</span>
            <span className="text-xs text-blue-300/70">Ctrl+E</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-500/20">
          <p className="text-xs text-blue-300/70 text-center">
            Press <kbd className="px-1 py-0.5 bg-blue-600/20 rounded text-blue-300">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsMenu;
