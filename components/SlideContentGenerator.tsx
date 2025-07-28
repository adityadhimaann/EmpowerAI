import React, { useState } from 'react';
import { LoaderIcon, AlertTriangleIcon, CodeIcon } from './Icons';
import { TemplateData } from '../types';

interface GeneratorInputProps {
  onGenerate: (projectIdea: string, mode: 'pitch' | 'repo', template?: TemplateData) => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  onOpenTemplates?: () => void;
  selectedTemplate?: TemplateData | null;
}

const GeneratorInput: React.FC<GeneratorInputProps> = ({ onGenerate, isLoading, error, onReset, onOpenTemplates, selectedTemplate }) => {
  const [projectIdea, setProjectIdea] = useState('');
  const [mode, setMode] = useState<'pitch' | 'repo'>('pitch');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectIdea.trim() && !isLoading) {
      onGenerate(projectIdea, mode, selectedTemplate || undefined);
    }
  };

  // Update placeholders based on selected template
  const getPlaceholder = () => {
    if (selectedTemplate && mode === 'pitch') {
      return `e.g., ${selectedTemplate.description} - Describe your ${selectedTemplate.name.toLowerCase()} idea here...`;
    }
    return mode === 'pitch' 
      ? "e.g., An app that uses AI to create personalized meal plans based on dietary preferences and health goals..."
      : "e.g., A real-time chat application with React frontend, Node.js backend, and MongoDB database...";
  };

  // Update button labels based on selected template
  const getButtonLabel = () => {
    if (selectedTemplate && mode === 'pitch') {
      return `Generate ${selectedTemplate.name} ✨`;
    }
    return mode === 'pitch' ? "Generate Pitch Deck ✨" : "Generate Code Structure 🚀";
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fadeIn fit-screen p-4 flex flex-col items-center justify-center">
      {/* Header Section - More Compact */}
      <div className="mb-4 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg mb-3 backdrop-blur-sm border border-white/10">
          <CodeIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:responsive-text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2 leading-tight">
          EmpowerAI
        </h1>
        <p className="responsive-text-lg text-white/80 mb-4 max-w-2xl mx-auto">
          Transform your ideas into professional presentations and code structures with AI
        </p>
      </div>

      {/* Mode Selection and Template Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
        {/* Selected Template Display */}
        {selectedTemplate && mode === 'pitch' && (
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedTemplate.thumbnail}</span>
              <div>
                <h4 className="text-white font-medium text-sm">{selectedTemplate.name}</h4>
                <p className="text-purple-300/80 text-xs">{selectedTemplate.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10 flex">
          <button 
            onClick={() => setMode('pitch')}
            className={`px-3 py-2 text-xs font-semibold transition-all duration-300 rounded ${
              mode === 'pitch' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/25' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🎯 Pitch Deck
          </button>
          <button 
            onClick={() => setMode('repo')}
            className={`px-3 py-2 text-xs font-semibold transition-all duration-300 rounded ${
              mode === 'repo' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🔧 Code Structure
          </button>
        </div>
        
        {onOpenTemplates && mode === 'pitch' && (
          <button
            onClick={onOpenTemplates}
            className="px-3 py-2 text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            📋 {selectedTemplate ? 'Change Template' : 'Use Template'}
          </button>
        )}
      </div>

      {/* Input Form - More Compact */}
      <div className="w-full flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
          <div className="relative mb-3">
            <textarea
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              placeholder={getPlaceholder()}
              rows={2}
              disabled={isLoading}
              className="w-full p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 resize-none text-sm disabled:opacity-50"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !projectIdea.trim()}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                mode === 'pitch' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-3 h-3 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>{getButtonLabel()}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display - More Compact */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg text-red-400 flex items-center space-x-2 max-w-2xl mx-auto animate-fadeIn">
          <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="font-medium text-sm">Generation Error</div>
            <div className="text-xs opacity-90">{error}</div>
          </div>
          <button
            onClick={onReset}
            className="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Features Grid - More Compact */}
      <div className="mt-4 w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl">
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 group hover:bg-white/10 transition-all duration-300 text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Lightning Fast</h3>
            <p className="text-white/70 text-xs leading-tight">Generate professional content in seconds</p>
          </div>
          
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 group hover:bg-white/10 transition-all duration-300 text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-lg mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
              <span className="text-lg">🎨</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Beautiful Design</h3>
            <p className="text-white/70 text-xs leading-tight">Modern layouts that impress judges</p>
          </div>
          
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 group hover:bg-white/10 transition-all duration-300 text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-lg mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
              <span className="text-lg">🤖</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">AI Powered</h3>
            <p className="text-white/70 text-xs leading-tight">Smart content generation for your project</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorInput;
