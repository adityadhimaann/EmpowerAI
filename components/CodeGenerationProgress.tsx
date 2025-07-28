import React, { useState, useEffect } from 'react';
import { RepoNode } from '../types';
import { FolderIcon, FileIcon, LoaderIcon, CheckCircleIcon } from './Icons';

interface CodeGenerationProgressProps {
  structure: RepoNode;
  progress: {
    total: number;
    completed: number;
    currentFile: string;
  };
  filePaths: string[];
  currentFileCode?: string; // Add this to show the actual code being generated
  showCodePreview?: boolean; // Add this to toggle code preview
}

const ProgressTreeNode: React.FC<{
  node: RepoNode;
  level: number;
  basePath: string;
  progress: CodeGenerationProgressProps['progress'];
  filePaths: string[];
}> = ({ node, level, basePath, progress, filePaths }) => {
  const isFolder = node.type === 'folder';
  const currentPath = basePath ? `${basePath}/${node.name}` : node.name;

  let statusIcon;
  if (!isFolder) {
      const fileIndex = filePaths.indexOf(currentPath);
      if (currentPath === progress.currentFile) {
        statusIcon = <LoaderIcon className="w-4 h-4 text-indigo-400 animate-spin" />;
      } else if (fileIndex !== -1 && fileIndex < progress.completed) {
         statusIcon = <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      } else {
        // This is a pending file
        statusIcon = <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />;
      }
  }

  return (
    <li>
      <div className="flex items-center text-gray-300 py-1 rounded" style={{ paddingLeft: `${level * 24}px` }}>
        <span className="mr-2">
          {isFolder ? <FolderIcon className="w-5 h-5 text-indigo-400" /> : <FileIcon className="w-5 h-5 text-gray-500" />}
        </span>
        <span className="flex-grow">{node.name}</span>
        {!isFolder && <span className="mr-2 flex items-center justify-center w-4 h-4">{statusIcon}</span>}
      </div>
      {isFolder && node.children && (
        <ul className="pl-6 border-l border-white/10">
          {node.children.map((child, index) => (
            <ProgressTreeNode key={index} node={child} level={level + 1} basePath={currentPath} progress={progress} filePaths={filePaths} />
          ))}
        </ul>
      )}
    </li>
  );
};


const CodeGenerationProgress: React.FC<CodeGenerationProgressProps> = ({ 
  structure, 
  progress, 
  filePaths, 
  currentFileCode = '',
  showCodePreview = true 
}) => {
    const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
    const [displayedCode, setDisplayedCode] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Character-by-character typewriter effect
    useEffect(() => {
      if (progress.currentFile && currentFileCode) {
        setDisplayedCode('');
        setIsTyping(true);
        
        let currentIndex = 0;
        const typeNextChar = () => {
          if (currentIndex < currentFileCode.length) {
            setDisplayedCode(prev => prev + currentFileCode[currentIndex]);
            currentIndex++;
            // Faster typing speed - adjust timeout for speed (lower = faster)
            setTimeout(typeNextChar, Math.random() * 20 + 5); // 5-25ms between characters
          } else {
            setIsTyping(false);
          }
        };
        
        // Start typing after a brief delay
        setTimeout(typeNextChar, 300);
      }
    }, [progress.currentFile, currentFileCode]);
    
    return (
    <div className="w-full max-w-2xl bg-black/20 p-6 rounded-xl shadow-2xl backdrop-blur-lg border border-white/10 animate-fade-in">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 mb-2">
          Generating Code...
        </h2>
        <p className="text-gray-400 mb-4">The AI is building your project. Please wait a moment.</p>
        
        <div className="w-full bg-black/30 rounded-full h-2.5 mb-4">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <p className="text-sm text-gray-400 mb-4 font-mono truncate">
            {progress.completed}/{progress.total} files completed. {progress.currentFile && `Generating: ${progress.currentFile.split('/').pop()}`}
        </p>

        <div className="bg-black/30 p-4 rounded-lg font-mono text-sm max-h-[50vh] overflow-y-auto">
            <ul>
                <ProgressTreeNode node={structure} level={0} basePath="" progress={progress} filePaths={filePaths} />
            </ul>
        </div>

        {/* Fast Typewriter Code Preview */}
        {showCodePreview && progress.currentFile && currentFileCode && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-gray-400 font-mono">
                📁 {progress.currentFile.split('/').pop()}
              </span>
            </div>
            
            <div className="code-terminal relative">
              {/* File tab */}
              <div className="file-tab-slide bg-gray-800 px-3 py-1 rounded-t-lg inline-block">
                <span className="text-xs text-gray-300">
                  {progress.currentFile.split('/').pop()}
                </span>
              </div>
              
              {/* Code content with typewriter effect */}
              <div className="bg-gray-900 p-4 rounded-b-lg rounded-tr-lg min-h-[200px] relative overflow-hidden">
                <pre className="text-green-400 text-sm leading-relaxed whitespace-pre-wrap">
                  <code className="font-mono">
                    {displayedCode}
                    {/* Blinking cursor */}
                    {(isTyping || displayedCode) && (
                      <span className="animate-pulse text-cyan-400">|</span>
                    )}
                  </code>
                </pre>
                
                {/* Static cursor for empty state */}
                {!displayedCode && !isTyping && (
                  <div className="absolute top-4 left-4 w-0.5 h-5 bg-green-400 animate-pulse"></div>
                )}
                
                {/* Terminal scanning line effect */}
                {isTyping && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CodeGenerationProgress;