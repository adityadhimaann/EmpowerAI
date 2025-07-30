import React, { useState, useCallback, useEffect } from 'react';
import { SlideData, AppState, HistoryItem, RepoNode, PresentationTheme, GeneratedCode, UserPreferences, TemplateData } from './types';
import { generatePresentation, generateRepoStructure, generateFileContent } from './services/geminiService';
import GeneratorInput from './components/SlideContentGenerator';
import Presentation from './components/Presentation';
import Sidebar from './components/Sidebar';
import RepoStructureView from './components/RepoStructureView';
import CodeGenerationProgress from './components/CodeGenerationProgress';
import CodeView from './components/CodeView';
import SamvadAI from './components/SamvadAI';
import ChatFAB from './components/ChatFAB';
import FloatingStars from './components/FloatingStars';
import TemplateSelector from './components/TemplateSelector';
import SettingsPanel from './components/SettingsPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { MenuIcon } from './components/Icons';

const HISTORY_KEY = 'empowerai_history';
const PREFERENCES_KEY = 'empowerai_preferences';
const MAX_HISTORY = 10;

const defaultTheme: PresentationTheme = {
  name: 'Modern Gradient',
  bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-800',
  accent: 'from-blue-400 to-indigo-400',
  font: 'font-sans'
};

const defaultPreferences: UserPreferences = {
  defaultTheme: 'Modern Gradient',
  autoSave: true,
  animationSpeed: 'normal',
  language: 'en',
  aiModel: 'gemini',
  exportFormat: 'pdf'
};

const getFilePaths = (node: RepoNode, path: string): string[] => {
  const currentPath = path ? `${path}/${node.name}` : node.name;
  if (node.type === 'file') {
    return [currentPath];
  }
  if (node.children) {
    return node.children.flatMap(child => getFilePaths(child, currentPath));
  }
  return [];
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [slides, setSlides] = useState<SlideData[] | null>(null);
  const [repoStructure, setRepoStructure] = useState<RepoNode | null>(null);
  const [projectIdea, setProjectIdea] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [generationProgress, setGenerationProgress] = useState({ total: 0, completed: 0, currentFile: '' });
  const [generationFilePaths, setGenerationFilePaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<PresentationTheme>(defaultTheme);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      
      const storedPreferences = localStorage.getItem(PREFERENCES_KEY);
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (e) {
      console.error("Failed to parse stored data from localStorage", e);
      localStorage.removeItem(HISTORY_KEY);
      localStorage.removeItem(PREFERENCES_KEY);
    }
  }, []);

  // Keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      if (event.ctrlKey && event.key === ',') {
        event.preventDefault();
        setIsSettingsOpen(true);
      }
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        setIsTemplateOpen(true);
      }
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        setIsAnalyticsOpen(true);
      }
      if (event.key === 'Escape') {
        if (isSidebarOpen) setIsSidebarOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isTemplateOpen) setIsTemplateOpen(false);
        else if (isAnalyticsOpen) setIsAnalyticsOpen(false);
        else if (isChatOpen) setIsChatOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSidebarOpen, isSettingsOpen, isTemplateOpen, isAnalyticsOpen, isChatOpen]);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleGenerate = useCallback(async (idea: string, mode: 'pitch' | 'repo', template?: TemplateData) => {
    setAppState(AppState.GENERATING);
    setError(null);
    setSlides(null);
    setRepoStructure(null);
    setProjectIdea(idea);
    setActiveHistoryId(null);
    setIsSidebarOpen(false);
    
    try {
      if (mode === 'pitch') {
        const generatedResult = await generatePresentation(idea, template);
        const generatedSlides = generatedResult?.slides || generatedResult;
        if (generatedSlides && Array.isArray(generatedSlides) && generatedSlides.length > 0) {
          const newId = new Date().toISOString();
          const now = new Date().toISOString();
          const newHistoryItem: HistoryItem = { 
            id: newId, 
            projectIdea: idea, 
            slides: generatedSlides,
            createdAt: now,
            lastModified: now,
            views: 0,
            favorites: false
          };
          const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY);
          updateHistory(updatedHistory);
          setSlides(generatedSlides);
          setActiveHistoryId(newId);
          setAppState(AppState.PRESENTING);
        } else {
          throw new Error("AI failed to generate slides. Please try a different prompt.");
        }
      } else { // mode === 'repo'
        const generatedStructure = await generateRepoStructure(idea);
        setRepoStructure(generatedStructure);
        setAppState(AppState.REPO_VIEW);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error(errorMessage);
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, [history]);

  const handleGenerateCode = useCallback(async () => {
    if (!projectIdea || !repoStructure) return;

    setAppState(AppState.GENERATING_CODE);
    setError(null);

    const filePaths = repoStructure.children ? repoStructure.children.flatMap(child => getFilePaths(child, repoStructure.name)) : [];
    setGenerationFilePaths(filePaths);

    setGenerationProgress({ total: filePaths.length, completed: 0, currentFile: '' });

    const codeMap: GeneratedCode = new Map();

    try {
      for (let i = 0; i < filePaths.length; i++) {
        const path = filePaths[i];
        setGenerationProgress(prev => ({ ...prev, currentFile: path, completed: i }));
        
        try {
          const result = await generateFileContent(projectIdea, repoStructure, path);
          const content = typeof result === 'string' ? result : result.content;
          codeMap.set(path, content);
        } catch (fileError: any) {
          console.warn(`Failed to generate ${path}:`, fileError);
          
          // For rate limit errors, provide a placeholder and continue
          if (fileError?.message?.includes('Rate limit') || fileError?.message?.includes('quota')) {
            codeMap.set(path, `// Rate limit reached - placeholder for ${path}\n// Please try generating this file individually later\n\nexport default function Placeholder() {\n  return <div>Generated content coming soon...</div>;\n}`);
          } else {
            // For other errors, still add a placeholder but log the error
            codeMap.set(path, `// Error generating ${path}: ${fileError?.message}\n// Please review and fix manually\n\nexport default function ErrorPlaceholder() {\n  return <div>Error: Could not generate content</div>;\n}`);
          }
        }
      }
      setGenerationProgress(prev => ({ ...prev, completed: filePaths.length }));
      setGeneratedCode(codeMap);
      setAppState(AppState.CODE_VIEW);
      
      // Show success message with any warnings
      const failedFiles = Array.from(codeMap.entries()).filter(([_, content]) => content.includes('Rate limit reached') || content.includes('Error generating'));
      if (failedFiles.length > 0) {
        console.warn(`Generation completed with ${failedFiles.length} placeholder files due to rate limits.`);
      }
      
    } catch (err: unknown) {
       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during code generation.";
       console.error(errorMessage);
       
       // Provide more helpful error messages
       if (errorMessage.includes('Rate limit') || errorMessage.includes('quota')) {
         setError("Rate limit exceeded. The free tier allows 10 requests per minute. Please wait a moment and try again, or consider upgrading your API plan.");
       } else {
         setError(errorMessage);
       }
       setAppState(AppState.ERROR);
    }
  }, [projectIdea, repoStructure]);

  const handleSelectHistory = useCallback((id: string) => {
    const selectedItem = history.find(item => item.id === id);
    if (selectedItem) {
      setSlides(selectedItem.slides);
      setProjectIdea(selectedItem.projectIdea);
      setActiveHistoryId(selectedItem.id);
      setRepoStructure(null);
      setGeneratedCode(null);
      setAppState(AppState.PRESENTING);
      setError(null);
      setIsSidebarOpen(false);
    }
  }, [history]);

  const handleOpenSamvadAI = useCallback(() => {
    setIsChatOpen(true);
    setIsSidebarOpen(false); // Close sidebar when opening Samvad AI
  }, []);

  const handleNewPitch = useCallback(() => {
    setSlides(null);
    setError(null);
    setActiveHistoryId(null);
    setRepoStructure(null);
    setProjectIdea(null);
    setGeneratedCode(null);
    setSelectedTemplate(null);
    setAppState(AppState.IDLE);
    setIsSidebarOpen(false);
  }, []);

  const handleSelectTemplate = useCallback((template: TemplateData) => {
    setSelectedTemplate(template);
    setIsTemplateOpen(false);
    setError(null);
  }, []);

  const handleUpdatePreferences = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
  }, []);

  const handleExportAnalytics = useCallback(() => {
    const analyticsData = {
      totalPresentations: history.length,
      totalViews: history.reduce((sum, item) => sum + (item.views || 0), 0),
      favoriteCount: history.filter(item => item.favorites).length,
      exportDate: new Date().toISOString(),
      presentations: history
    };
    
    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `empowerai-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [history]);

  const renderContent = () => {
    switch (appState) {
      case AppState.PRESENTING:
        return slides && <Presentation slides={slides} theme={theme} setTheme={setTheme} />;
      case AppState.REPO_VIEW:
        return repoStructure && <RepoStructureView structure={repoStructure} onGenerateCode={handleGenerateCode} />;
      case AppState.GENERATING_CODE:
        return repoStructure && <CodeGenerationProgress structure={repoStructure} progress={generationProgress} filePaths={generationFilePaths} />;
      case AppState.CODE_VIEW:
        return repoStructure && generatedCode && <CodeView structure={repoStructure} code={generatedCode} onReset={handleNewPitch} />;
      case AppState.IDLE:
      case AppState.GENERATING:
      case AppState.ERROR:
      default:
        return (
          <GeneratorInput
            onGenerate={handleGenerate}
            isLoading={appState === AppState.GENERATING}
            error={error}
            onReset={handleNewPitch}
            onOpenTemplates={() => setIsTemplateOpen(true)}
            selectedTemplate={selectedTemplate}
          />
        );
    }
  };

  return (
    <div className="flex w-full h-screen font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
      {/* Floating Stars Background */}
      <FloatingStars />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        activeId={activeHistoryId}
        onSelectHistory={handleSelectHistory}
        onNew={handleNewPitch}
        onOpenSamvadAI={handleOpenSamvadAI}
      />
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true"></div>}

      <div className={`relative flex-1 flex flex-col ${appState === AppState.PRESENTING ? theme.bg : 'bg-gradient-to-br from-blue-900/50 via-indigo-800/30 to-slate-800/50'} transition-all duration-700 overflow-hidden animate-fadeIn z-10`}>
        {/* Header with theme selector and floating action buttons */}
        {/* Quick Access Buttons (no theme selector) */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTemplateOpen(true)}
              className="p-2.5 rounded-lg bg-purple-600/90 backdrop-blur text-white hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 group hover:scale-110 active:scale-95"
              title="Templates (Ctrl+T)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            <button
              onClick={() => setIsAnalyticsOpen(true)}
              className="p-2.5 rounded-lg bg-green-600/90 backdrop-blur text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 group hover:scale-110 active:scale-95"
              title="Analytics (Ctrl+A)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-lg bg-gray-600/90 backdrop-blur text-white hover:bg-gray-500 hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-200 group hover:scale-110 active:scale-95"
              title="Settings (Ctrl+,)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 lg:hidden p-2.5 rounded-lg bg-blue-600/90 backdrop-blur text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 group hover:scale-110 active:scale-95"
            style={{
              animation: 'pulse-glow 3s ease-in-out infinite'
            }}
            aria-label="Open sidebar (Ctrl+B)"
            title="☰ Menu (Ctrl+B)"
          >
            <MenuIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        )}
        <main className={`w-full h-full flex-grow flex items-center justify-center p-2 transition-all duration-300 ${isSidebarOpen ? '' : 'px-4'}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 py-3 px-4 border-t border-white/10 mt-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <span>Design and Developed by</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all duration-300">
                adidev
              </span>
            </div>
            <div className="hidden sm:block text-white/40">•</div>
            <div className="flex items-center gap-2">
              <span className="text-white/60">Contact:</span>
              <a 
                href="mailto:aditya@empowerai.dev" 
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline"
              >
                aditya@empowerai.dev
              </a>
            </div>
          </div>
          <div className="text-sm text-white/60 text-center sm:text-right">
            © 2025 EmpowerAI. All rights reserved.
          </div>
        </footer>
        
        {/* Samvad AI Chatbot */}
        <>
          {(appState === AppState.REPO_VIEW || appState === AppState.CODE_VIEW || appState === AppState.GENERATING_CODE) && (
            <ChatFAB onClick={() => setIsChatOpen(true)} />
          )}
          <SamvadAI
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            repoStructure={repoStructure || undefined}
            generatedCode={generatedCode || undefined}
            projectIdea={projectIdea || undefined}
          />
        </>
        
        {/* New Feature Modals */}
        {isTemplateOpen && (
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setIsTemplateOpen(false)}
          />
        )}
        
        {isSettingsOpen && (
          <SettingsPanel
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        
        {isAnalyticsOpen && (
          <AnalyticsDashboard
            history={history}
            onClose={() => setIsAnalyticsOpen(false)}
            onExportAnalytics={handleExportAnalytics}
          />
        )}
      </div>
    </div>
  );
};

export default App;