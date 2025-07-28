
import React from 'react';
import { HistoryItem } from '../types';
import { PlusIcon, MessageSquareIcon, LogoIcon, XIcon, BotIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  activeId: string | null;
  onSelectHistory: (id: string) => void;
  onNew: () => void;
  onOpenSamvadAI: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, history, activeId, onSelectHistory, onNew, onOpenSamvadAI }) => {
  return (
    <>
      {/* Floating Icon Sidebar - Always visible on desktop with hover expand */}
      <aside
        className="group fixed top-1/2 -translate-y-1/2 left-6 z-40 w-12 hover:w-72 h-[30rem] bg-gradient-to-b from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/20 hidden lg:flex flex-col overflow-hidden transition-all duration-300 ease-out will-change-[width,transform]"
        aria-label="Navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-center group-hover:justify-start group-hover:px-4 py-3 border-b border-blue-500/20 transition-all duration-200">
          <LogoIcon className="h-4 w-4 text-blue-400 drop-shadow-lg flex-shrink-0" />
          <h1 className="ml-3 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 whitespace-nowrap overflow-hidden">EmpowerAI</h1>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col gap-2 p-2 items-center">
          <button
            onClick={onNew}
            className="group/btn flex items-center justify-center group-hover:justify-start group-hover:px-4 group-hover:w-full w-9 h-9 group-hover:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] will-change-transform"
            title="New Pitch"
          >
            <PlusIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="ml-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 whitespace-nowrap overflow-hidden">New Pitch</span>
          </button>
          
          <button
            onClick={onOpenSamvadAI}
            className="group/btn flex items-center justify-center group-hover:justify-start group-hover:px-4 group-hover:w-full w-9 h-9 group-hover:h-11 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] will-change-transform"
            title="Samvad AI"
          >
            <BotIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="ml-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 whitespace-nowrap overflow-hidden">Samvad AI</span>
          </button>
        </div>

        {/* Recent History Icons */}
        <div className="flex-1 flex flex-col gap-1.5 p-2 items-center overflow-y-auto">
          {/* Recent Section Header (visible on hover) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 w-full px-3 py-2 border-b border-blue-500/10">
            <h2 className="text-[10px] font-medium text-blue-300/80 uppercase tracking-wider whitespace-nowrap">Recent Projects</h2>
          </div>
          
          {history.length === 0 ? (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 flex items-center justify-center h-20 text-blue-300/60 text-xs px-3 w-full">
              No recent pitches
            </div>
          ) : (
            history.slice(0, 8).map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item.id)}
                className={`group/btn flex items-center justify-center group-hover:justify-start group-hover:px-4 group-hover:w-full w-9 h-9 group-hover:h-12 rounded-xl transition-all duration-300 hover:scale-105 ${
                  activeId === item.id
                    ? 'bg-gradient-to-br from-blue-600/70 to-indigo-600/70 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 hover:text-white'
                }`}
                title={item.projectIdea}
              >
                <MessageSquareIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 flex-1 text-left overflow-hidden min-w-0">
                  <div className="text-xs font-medium truncate text-current">
                    {item.projectIdea}
                  </div>
                  <div className="text-[10px] text-blue-300/60 truncate mt-0.5">
                    {new Date(item.id).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Floating Full Sidebar - Mobile overlay */}
      <aside
        className={`
          fixed top-6 left-6 right-6 bottom-6 z-50 max-w-sm bg-gradient-to-b from-slate-900/98 via-blue-950/98 to-slate-900/98 backdrop-blur-xl flex flex-col border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-500/30 lg:hidden
          transition-all duration-500 ease-out
          ${isOpen ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full opacity-0 scale-95'}
        `}
        aria-label="Sidebar"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between gap-3 p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-7 w-7 text-blue-400 drop-shadow-lg" />
            <h1 className="text-lg font-bold text-white">EmpowerAI</h1>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-blue-300 hover:text-white hover:bg-blue-600/50 transition-all duration-200" 
            aria-label="Close sidebar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-col gap-3 p-6">
          <button
            onClick={onNew}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            New Pitch
          </button>
          
          <button
            onClick={onOpenSamvadAI}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 font-medium"
          >
            <BotIcon className="w-5 h-5" />
            Samvad AI
          </button>
        </div>

        {/* Mobile Recent History */}
        <div className="flex-1 flex flex-col min-h-0 px-6">
          <h2 className="text-sm font-semibold text-blue-300/80 uppercase tracking-wider py-3 border-b border-blue-500/10">
            Recent
          </h2>
          
          <div className="flex-1 overflow-y-auto py-4">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-blue-300/60 text-sm">
                No recent pitches
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectHistory(item.id)}
                    className={`group w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                      activeId === item.id
                        ? 'bg-gradient-to-r from-blue-600/50 to-indigo-600/50 text-white border border-blue-400/40 shadow-lg shadow-blue-500/20'
                        : 'text-blue-100/80 hover:bg-blue-800/40 hover:text-white'
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center">
                      <MessageSquareIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium truncate">
                        {item.projectIdea}
                      </div>
                      <div className="text-xs text-blue-300/60 mt-1">
                        {new Date(item.id).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
