import React, { useState } from 'react';
import { LoaderIcon, AlertTriangleIcon, CodeIcon } from './Icons';
import { TemplateData } from '../types';

interface GeneratorInputProps {
  onGenerate: (projectIdea: string, mode: 'pitch' | 'repo', template?: TemplateData, selectedModel?: string) => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  selectedTemplate?: TemplateData | null;
  onOpenTemplates?: () => void;
}

const GeneratorInput: React.FC<GeneratorInputProps> = ({ 
  onGenerate, 
  isLoading, 
  error, 
  onReset, 
  selectedTemplate, 
  onOpenTemplates 
}) => {
  const [projectIdea, setProjectIdea] = useState('');
  const [mode, setMode] = useState<'pitch' | 'repo'>('pitch');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai-gpt-4.1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectIdea.trim() && !isLoading) {
      onGenerate(projectIdea, mode, selectedTemplate || undefined, selectedModel);
    }
  };

  const handleModeSwitch = (newMode: 'pitch' | 'repo') => {
    if (newMode !== mode) {
      setIsAnimating(true);
      
      // Create a staggered animation sequence
      if (newMode === 'repo') {
        // First phase - fade out current content
        setTimeout(() => {
          setMode(newMode);
        }, 150);

        // Second phase - show scanning line and matrix effect
        setTimeout(() => {
          document.querySelector('.scan-line')?.classList.add('animate-scan-line');
          document.querySelectorAll('.matrix-rain').forEach(el => {
            (el as HTMLElement).style.opacity = '1';
          });
        }, 300);

        // Third phase - reveal code elements
        setTimeout(() => {
          document.querySelectorAll('.code-element').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'translateY(0)';
            }, i * 50);
          });
        }, 500);

        // Final phase - complete animation
        setTimeout(() => {
          setIsAnimating(false);
        }, 1200);
      } else {
        // Simpler animation for pitch mode
        setTimeout(() => {
          setMode(newMode);
          setTimeout(() => setIsAnimating(false), 300);
        }, 150);
      }
    }
  };

  // Update placeholders based on selected template
  const getPlaceholder = () => {
    if (selectedTemplate) {
      return `e.g., ${selectedTemplate.description} - Describe your ${selectedTemplate.name.toLowerCase()} idea here...`;
    }
    return mode === 'pitch' 
      ? "e.g., An app that uses AI to create personalized meal plans based on dietary preferences and health goals..."
      : "e.g., A real-time chat application with React frontend, Node.js backend, and MongoDB database...";
  };

  // Update button labels based on selected template
  const getButtonLabel = () => {
    if (selectedTemplate) {
      return `Generate ${selectedTemplate.name} ✨`;
    }
    return mode === 'pitch' ? "Generate Pitch Deck ✨" : "Generate Code Structure 🚀";
  };

  return (
    <div className={`w-full max-w-4xl text-center relative transition-all duration-1000 transform
      ${mode === 'repo' ? 'filter brightness-90' : ''}
      ${isAnimating ? 'animate-fadeIn scale-95' : ''}
      ${mode === 'repo' && isAnimating ? 'animate-terminal-boot' : ''}
      ${!isAnimating ? 'scale-100' : ''}`}>
      {/* Dark Code Theme Overlay */}
      {mode === 'repo' && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-gray-900/80 backdrop-blur-sm pointer-events-none z-[-1] animate-fadeIn" />
      )}

      {/* Scanning line effect during mode switch */}
      {mode === 'repo' && isAnimating && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-scan-line">
          </div>
        </div>
      )}

      {/* Floating Programming Language Icons - Only shown in repo mode */}
      {mode === 'repo' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
          {/* HTML */}
          <div className="absolute top-20 left-16 text-orange-400/40 text-3xl animate-dash" style={{animationDelay: '0.1s', animationDuration: '2s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"<>"}</span>
          </div>
          
          {/* CSS */}
          <div className="absolute top-32 right-20 text-blue-400/40 text-2xl animate-dash" style={{animationDelay: '0.3s', animationDuration: '2.5s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"#"}</span>
          </div>
          
          {/* JavaScript */}
          <div className="absolute top-40 left-1/4 text-yellow-400/40 text-2xl animate-dash" style={{animationDelay: '0.5s', animationDuration: '3s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"JS"}</span>
          </div>
          
          {/* React */}
          <div className="absolute top-60 right-1/3 text-cyan-400/40 text-2xl animate-dash" style={{animationDelay: '0.7s', animationDuration: '2.2s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"⚛"}</span>
          </div>
          
          {/* Node.js */}
          <div className="absolute top-80 left-12 text-green-400/40 text-2xl animate-dash" style={{animationDelay: '0.9s', animationDuration: '2.8s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"⬢"}</span>
          </div>
          
          {/* TypeScript */}
          <div className="absolute bottom-60 right-16 text-blue-500/40 text-2xl animate-dash" style={{animationDelay: '1.1s', animationDuration: '2.3s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"TS"}</span>
          </div>
          
          {/* PHP */}
          <div className="absolute bottom-80 left-20 text-purple-400/40 text-2xl animate-dash" style={{animationDelay: '1.3s', animationDuration: '2.7s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"<?>"}</span>
          </div>
          
          {/* MongoDB */}
          <div className="absolute bottom-40 right-1/4 text-green-500/40 text-2xl animate-dash" style={{animationDelay: '1.5s', animationDuration: '2.4s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"🍃"}</span>
          </div>
          
          {/* Angular */}
          <div className="absolute top-1/2 left-8 text-red-500/40 text-2xl animate-dash" style={{animationDelay: '1.7s', animationDuration: '2.6s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"🅰"}</span>
          </div>
          
          {/* Flutter */}
          <div className="absolute top-1/3 right-12 text-blue-300/40 text-2xl animate-dash" style={{animationDelay: '1.9s', animationDuration: '2.1s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"🦋"}</span>
          </div>
          
          {/* Python */}
          <div className="absolute bottom-1/3 left-1/3 text-yellow-500/40 text-2xl animate-dash" style={{animationDelay: '2.1s', animationDuration: '2.9s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"🐍"}</span>
          </div>
          
          {/* Vue */}
          <div className="absolute top-2/3 right-1/5 text-green-400/40 text-2xl animate-dash" style={{animationDelay: '2.3s', animationDuration: '2.2s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"V"}</span>
          </div>
          
          {/* Docker */}
          <div className="absolute bottom-1/2 left-1/5 text-blue-600/40 text-2xl animate-dash" style={{animationDelay: '2.5s', animationDuration: '2.5s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"🐳"}</span>
          </div>
          
          {/* Git */}
          <div className="absolute top-1/4 left-3/4 text-orange-600/40 text-2xl animate-dash" style={{animationDelay: '2.7s', animationDuration: '2.8s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"⎇"}</span>
          </div>
          
          {/* AWS */}
          <div className="absolute bottom-1/4 right-1/6 text-orange-400/40 text-2xl animate-dash" style={{animationDelay: '2.9s', animationDuration: '2.3s', animationIterationCount: 'infinite'}}>
            <span className="font-bold">{"☁"}</span>
          </div>
        </div>
      )}

      {/* Floating Code Syntax Elements - Additional code elements */}
      {mode === 'repo' && isAnimating && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 text-blue-400/30 font-mono text-sm animate-dash" style={{animationDelay: '0.1s'}}>
            {'{ }'}
          </div>
          <div className="absolute top-32 right-16 text-indigo-400/30 font-mono text-sm animate-dash" style={{animationDelay: '0.2s'}}>
            {'</>'}
          </div>
          <div className="absolute top-40 left-1/3 text-cyan-400/30 font-mono text-sm animate-dash" style={{animationDelay: '0.3s'}}>
            {'()'}
          </div>
          <div className="absolute top-60 right-1/4 text-purple-400/30 font-mono text-sm animate-dash" style={{animationDelay: '0.4s'}}>
            {'[]'}
          </div>
          <div className="absolute bottom-40 left-20 text-blue-400/30 font-mono text-sm animate-dash" style={{animationDelay: '0.5s'}}>
            {'//'}
          </div>
          <div className="absolute bottom-32 right-12 text-indigo-400/30 font-mono text-sm animate-dash" style={{animationDelay: '0.6s'}}>
            {'=>'}
          </div>
          
          {/* Matrix-like effect */}
          <div className="matrix-rain absolute top-0 left-1/4 text-green-400/20 font-mono text-xs opacity-0 transition-opacity duration-300" style={{animationDelay: '0.2s'}}>
            {'1010101'}
          </div>
          <div className="matrix-rain absolute top-0 right-1/3 text-green-400/20 font-mono text-xs opacity-0 transition-opacity duration-300" style={{animationDelay: '0.4s'}}>
            {'110011'}
          </div>
          <div className="matrix-rain absolute top-0 left-1/2 text-green-400/20 font-mono text-xs opacity-0 transition-opacity duration-300" style={{animationDelay: '0.6s'}}>
            {'010110'}
          </div>
          
          {/* Code keywords floating */}
          <div className="code-element absolute top-1/4 left-16 text-yellow-400/40 font-mono text-sm animate-dash opacity-0 transform translate-y-4 transition-all duration-300" style={{animationDelay: '0.8s'}}>
            {'const'}
          </div>
          <div className="code-element absolute top-1/3 right-20 text-orange-400/40 font-mono text-sm animate-dash opacity-0 transform translate-y-4 transition-all duration-300" style={{animationDelay: '1.0s'}}>
            {'function'}
          </div>
          <div className="code-element absolute bottom-1/3 left-1/4 text-purple-400/40 font-mono text-sm animate-dash opacity-0 transform translate-y-4 transition-all duration-300" style={{animationDelay: '1.2s'}}>
            {'return'}
          </div>
          <div className="code-element absolute bottom-1/4 right-16 text-cyan-400/40 font-mono text-sm animate-dash opacity-0 transform translate-y-4 transition-all duration-300" style={{animationDelay: '1.4s'}}>
            {'await'}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 backdrop-blur-sm border transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-gradient-to-br from-gray-700/40 to-slate-800/40 border-gray-600/30' 
            : 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border-white/10'
        }`}>
          <CodeIcon className={`w-10 h-10 transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-300' : 'text-cyan-400'
          } ${mode === 'repo' && isAnimating ? 'animate-glitch' : ''}`} />
        </div>
        <h1 className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text mb-6 leading-tight transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-gradient-to-r from-gray-300 via-slate-400 to-gray-300' 
            : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'
        } ${mode === 'repo' && isAnimating ? 'animate-code-shimmer' : ''}`}>
          {mode === 'repo' ? 'Code<Studio/>' : 'EmpowerAI'}
        </h1>
        <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-500 ${
          mode === 'repo' ? 'text-gray-300/90' : 'text-white/80'
        }`}>
          {mode === 'repo' 
            ? 'Build robust applications with intelligent code architecture and modern development practices' 
            : 'Transform your ideas into professional presentations and code structures with the power of AI'
          }
        </p>
      </div>

      {/* AI Model Selection Dropdown */}
      <div className={`mb-8 flex flex-col items-center relative z-20 transition-all duration-500 ${
        mode === 'repo' && isAnimating ? 'animate-code-pulse' : ''
      } ${mode === 'repo' ? 'transform scale-105' : ''}`}>
        <label htmlFor="ai-model-select" className={`text-sm font-semibold mb-3 transition-colors duration-500 ${
          mode === 'repo' ? 'text-gray-300 font-mono' : 'text-white/90'
        } ${mode === 'repo' && isAnimating ? 'animate-dash' : ''}`}>
          {mode === 'repo' ? '🤖 AI_Model.select()' : '🤖 Select AI Model'}
        </label>
        <div className="relative">
          <select
            id="ai-model-select"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className={`px-6 py-3 rounded-xl border focus:outline-none focus:ring-2 font-medium text-sm min-w-[250px] appearance-none cursor-pointer transition-all duration-500 ${
              mode === 'repo' 
                ? 'bg-gray-800/80 text-gray-200 border-gray-600/50 focus:ring-gray-400/50 hover:bg-gray-700/80 font-mono' 
                : 'bg-white/10 text-white border-white/30 focus:ring-cyan-400/50 hover:bg-white/15 backdrop-blur-sm'
            } ${mode === 'repo' && isAnimating ? 'animate-code-pulse' : ''}`}
          >
            <option value="openai-gpt-4.1" className="bg-gray-800 text-gray-200">
              {mode === 'repo' ? '🤖 OpenAI.GPT_4_1' : '🤖 OpenAI GPT-4.1'}
            </option>
            <option value="claude-anthropic" className="bg-gray-800 text-gray-200">
              {mode === 'repo' ? '🧠 Claude.Anthropic' : '🧠 Claude Anthropic'}
            </option>
            <option value="gemini" className="bg-gray-800 text-gray-200">
              {mode === 'repo' ? '⭐ Google.Gemini' : '⭐ Google Gemini'}
            </option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className={`w-4 h-4 transition-colors duration-500 ${
              mode === 'repo' ? 'text-gray-400' : 'text-white/70'
            } ${mode === 'repo' && isAnimating ? 'animate-dash' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {/* Code-style indicator for repo mode */}
          {mode === 'repo' && (
            <div className="absolute top-1 right-8 text-gray-500 opacity-60">
              <span className="text-xs font-mono">{'[]'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Selection and Template Button */}
      <div className="flex flex-col items-center justify-center gap-4 mb-8">
        {/* Selected Template Display */}
        {selectedTemplate && (
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedTemplate.thumbnail}</span>
              <div>
                <h3 className="text-white font-semibold">{selectedTemplate.name}</h3>
                <p className="text-purple-300/80 text-sm">{selectedTemplate.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div className={`backdrop-blur-sm rounded-2xl p-1 border relative overflow-hidden transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-gray-800/40 border-gray-600/30' 
            : 'bg-white/5 border-white/10'
        }`}>
          {/* Animated background indicator */}
          <div 
            className={`absolute top-1 left-1 h-[calc(100%-8px)] bg-gradient-to-r rounded-xl transition-all duration-500 ease-out ${
              mode === 'pitch' 
                ? 'w-[calc(50%-4px)] from-cyan-500 to-blue-500 shadow-lg shadow-blue-500/25' 
                : 'w-[calc(50%-4px)] from-gray-600 to-slate-700 shadow-lg shadow-gray-600/25 translate-x-full'
            } ${isAnimating ? 'animate-pulse' : ''}`}
          />
          
          <button 
            onClick={() => handleModeSwitch('pitch')}
            className={`relative z-10 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
              mode === 'pitch' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🎯 Pitch Deck
          </button>
          <button 
            onClick={() => handleModeSwitch('repo')}
            className={`relative z-10 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl font-mono ${
              mode === 'repo' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            } ${isAnimating && mode === 'repo' ? 'animate-dash' : ''}`}
          >
            🔧 Code Structure
          </button>
        </div>

        {/* Template Button */}
        {onOpenTemplates && mode === 'pitch' && (
          <button
            onClick={onOpenTemplates}
            className="px-4 py-2 text-sm font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            📋 {selectedTemplate ? 'Change Template' : 'Use Template'}
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={`w-full max-w-3xl mx-auto transition-all duration-500 ${
        mode === 'repo' && isAnimating ? 'animate-code-pulse' : ''
      } ${mode === 'repo' ? 'transform scale-105' : ''}`}>
        <div className="relative mb-6">
          <textarea
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            placeholder={getPlaceholder()}
            rows={4}
            disabled={isLoading}
            className={`w-full p-6 backdrop-blur-sm border rounded-2xl text-lg leading-relaxed disabled:opacity-50 resize-none transition-all duration-500 focus:outline-none focus:ring-2 focus:border-transparent ${
              mode === 'repo' 
                ? 'bg-gray-800/30 border-gray-600/40 text-gray-200 placeholder-gray-400/70 focus:ring-gray-500/50 font-mono' 
                : 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:ring-cyan-400/50'
            } ${mode === 'repo' && isAnimating ? 'animate-code-pulse' : ''}`}
          />
          {/* Code structure indicator */}
          {mode === 'repo' && (
            <div className="absolute top-2 right-2 text-gray-400 opacity-60">
              <span className="text-xs font-mono">{'</>'}</span>
            </div>
          )}
          {/* Terminal-like styling for repo mode */}
          {mode === 'repo' && (
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !projectIdea.trim()}
          className={`w-full max-w-md mx-auto px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 ${
            mode === 'pitch' 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25' 
              : 'bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-600 hover:to-slate-700 shadow-lg shadow-gray-700/25'
          } ${mode === 'repo' && isAnimating ? 'animate-dash' : ''} ${mode === 'repo' ? 'font-mono transform scale-110' : ''}`}
        >
          {isLoading ? (
            <>
              <LoaderIcon className="w-5 h-5 animate-spin" />
              <span>{mode === 'repo' ? 'Compiling...' : 'Generating...'}</span>
            </>
          ) : (
            <span className={mode === 'repo' && isAnimating ? 'animate-dash' : ''}>{getButtonLabel()}</span>
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className={`mt-8 p-4 backdrop-blur-sm border rounded-xl flex items-center space-x-3 max-w-2xl mx-auto animate-fadeIn transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-red-900/20 border-red-600/30 text-red-300' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="font-medium mb-1">{mode === 'repo' ? 'Compilation Error' : 'Generation Error'}</div>
            <div className="text-sm opacity-90">{error}</div>
          </div>
          <button
            onClick={onReset}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              mode === 'repo' 
                ? 'bg-red-600/20 hover:bg-red-600/30' 
                : 'bg-red-500/20 hover:bg-red-500/30'
            }`}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Features Grid */}
      <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-500 ${
        mode === 'repo' && isAnimating ? 'transform scale-105' : ''
      } ${mode === 'repo' ? 'transform scale-105' : ''}`}>
        <div className={`p-6 backdrop-blur-sm rounded-2xl border group transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-gray-800/30 border-gray-600/30 hover:bg-gray-700/40' 
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}>
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
            mode === 'repo' 
              ? 'bg-gradient-to-br from-gray-600/40 to-slate-700/40' 
              : 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20'
          }`}>
            <span className="text-2xl">{mode === 'repo' ? '⚡' : '⚡'}</span>
          </div>
          <h3 className={`text-lg font-semibold mb-2 transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-200 font-mono' : 'text-white'
          }`}>
            {mode === 'repo' ? 'Instant Setup' : 'Lightning Fast'}
          </h3>
          <p className={`text-sm transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-400' : 'text-white/70'
          }`}>
            {mode === 'repo' 
              ? 'Generate complete project structure in seconds' 
              : 'Generate professional content in seconds, not hours'
            }
          </p>
        </div>
        
        <div className={`p-6 backdrop-blur-sm rounded-2xl border group transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-gray-800/30 border-gray-600/30 hover:bg-gray-700/40' 
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}>
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
            mode === 'repo' 
              ? 'bg-gradient-to-br from-blue-600/40 to-indigo-700/40' 
              : 'bg-gradient-to-br from-blue-400/20 to-indigo-500/20'
          }`}>
            <span className="text-2xl">{mode === 'repo' ? '🔧' : '🎨'}</span>
          </div>
          <h3 className={`text-lg font-semibold mb-2 transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-200 font-mono' : 'text-white'
          }`}>
            {mode === 'repo' ? 'Smart Architecture' : 'Beautiful Design'}
          </h3>
          <p className={`text-sm transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-400' : 'text-white/70'
          }`}>
            {mode === 'repo' 
              ? 'Intelligent project structure and best practices' 
              : 'Modern, professional layouts that impress judges'
            }
          </p>
        </div>
        
        <div className={`p-6 backdrop-blur-sm rounded-2xl border group transition-all duration-500 ${
          mode === 'repo' 
            ? 'bg-gray-800/30 border-gray-600/30 hover:bg-gray-700/40' 
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}>
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
            mode === 'repo' 
              ? 'bg-gradient-to-br from-green-600/40 to-emerald-700/40' 
              : 'bg-gradient-to-br from-green-400/20 to-emerald-500/20'
          }`}>
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className={`text-lg font-semibold mb-2 transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-200 font-mono' : 'text-white'
          }`}>
            AI Powered
          </h3>
          <p className={`text-sm transition-colors duration-500 ${
            mode === 'repo' ? 'text-gray-400' : 'text-white/70'
          }`}>
            {mode === 'repo' 
              ? 'Smart code generation tailored to your tech stack' 
              : 'Smart content generation tailored to your project'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratorInput;
