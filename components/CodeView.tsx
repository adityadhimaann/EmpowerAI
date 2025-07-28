import React, { useState, useCallback } from 'react';
import { RepoNode, GeneratedCode } from '../types';
import { FolderIcon, FileIcon, RefreshCwIcon, ArchiveIcon, CodeIcon, EyeIcon } from './Icons';
import SandpackWrapper from './SandpackWrapper';
import TypewriterCode from './TypewriterCode';
import JSZip from 'jszip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface CodeViewProps {
  structure: RepoNode;
  code: GeneratedCode;
  onReset: () => void;
}

type ActiveTab = 'explorer' | 'preview';

const getLanguage = (filename: string | null) => {
    if (!filename) return 'text';
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js': return 'javascript';
        case 'jsx': return 'jsx';
        case 'ts': return 'typescript';
        case 'tsx': return 'tsx';
        case 'json': return 'json';
        case 'css': return 'css';
        case 'html': return 'html';
        case 'md': return 'markdown';
        case 'gitignore': return 'text';
        default: return 'text';
    }
}

const FileTree: React.FC<{
  node: RepoNode;
  level: number;
  basePath: string;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  typingFiles?: Set<string>;
  completedFiles?: Set<string>;
}> = ({ node, level, basePath, selectedFile, onSelectFile, typingFiles = new Set(), completedFiles = new Set() }) => {
  const isFolder = node.type === 'folder';
  const currentPath = basePath ? `${basePath}/${node.name}` : node.name;
  const isTyping = typingFiles.has(currentPath);
  const isCompleted = completedFiles.has(currentPath);

  return (
    <li className="flex flex-col select-none">
      <div
        className={`flex items-center py-1 rounded cursor-pointer ${
          !isFolder && selectedFile === currentPath ? 'bg-indigo-500/30' : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${level * 0.75}rem` }}
        onClick={() => !isFolder && onSelectFile(currentPath)}
      >
        <span className="flex items-center mr-2 text-blue-400">
          {isFolder ? (
            <FolderIcon className="w-4 h-4" />
          ) : (
            <>
              <FileIcon className="w-4 h-4" />
              {/* Typing status indicators */}
              {isTyping && (
                <span className="ml-1 text-yellow-400 animate-pulse" title="Typing...">
                  ⌨️
                </span>
              )}
              {isCompleted && !isTyping && (
                <span className="ml-1 text-green-400" title="Typing Complete">
                  ✅
                </span>
              )}
            </>
          )}
        </span>
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && node.children && (
        <ul className="pl-6 border-l border-white/10">
          {node.children.map((child, index) => (
            <FileTree
              key={index}
              node={child}
              level={level + 1}
              basePath={currentPath}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              typingFiles={typingFiles}
              completedFiles={completedFiles}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CodeView: React.FC<CodeViewProps> = ({ structure, code, onReset }) => {
  const findFirstFile = (node: RepoNode, path: string): string | null => {
      const currentPath = path ? `${path}/${node.name}` : node.name;
      if(node.type === 'file') return currentPath;
      if(node.children) {
          for(const child of node.children) {
              const result = findFirstFile(child, currentPath);
              if (result) return result;
          }
      }
      return null;
  }
  
  const [selectedFile, setSelectedFile] = useState<string | null>(() => findFirstFile(structure, ''));
  const [activeTab, setActiveTab] = useState<ActiveTab>('explorer');
  const [typingFiles, setTypingFiles] = useState<Set<string>>(new Set());
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());
  const [enableTyping, setEnableTyping] = useState(true);

  // Handle typing completion
  const handleTypingComplete = useCallback((filePath: string) => {
    setCompletedFiles(prev => new Set([...prev, filePath]));
  }, []);

  // Handle file selection with typing animation
  const handleFileSelect = useCallback((filePath: string) => {
    setSelectedFile(filePath);
    if (enableTyping && !completedFiles.has(filePath)) {
      setTypingFiles(prev => new Set([...prev, filePath]));
    }
  }, [enableTyping, completedFiles]);

  // Toggle typing animation
  const toggleTyping = useCallback(() => {
    setEnableTyping(prev => !prev);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const zip = new JSZip();
    const rootFolderName = structure.name;
    const rootFolder = zip.folder(rootFolderName);

    if (!rootFolder) return;

    code.forEach((content, path) => {
      const relativePath = path.substring(rootFolderName.length + 1);
      rootFolder.file(relativePath, content);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rootFolderName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, structure]);
  
  const TabButton: React.FC<{
    tabName: ActiveTab;
    icon: React.ReactNode;
    label: string;
  }> = ({ tabName, icon, label }) => (
     <button 
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
      >
        {icon}
        {label}
      </button>
  );

  return (
    <div className="w-full h-full max-w-7xl max-h-[90vh] bg-black/20 p-4 rounded-xl shadow-2xl backdrop-blur-lg border border-white/10 animate-fade-in flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0 px-2">
        <div className="flex items-center gap-2 p-1 bg-black/20 rounded-lg">
            <TabButton tabName="explorer" icon={<CodeIcon className="w-5 h-5" />} label="Code Explorer" />
            <TabButton tabName="preview" icon={<EyeIcon className="w-5 h-5" />} label="Live Preview" />
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={handleDownloadZip}
                className="flex items-center gap-2 text-sm bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-500 transition-colors"
                >
                <ArchiveIcon className="w-4 h-4" />
                Download .zip
            </button>
            <button
                onClick={onReset}
                className="flex items-center gap-2 text-sm bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors"
                >
                <RefreshCwIcon className="w-4 h-4" />
                Start Over
            </button>
        </div>
      </div>
      
      {activeTab === 'explorer' && (
        <div className="flex-grow flex gap-4 min-h-0">
          {/* File Tree */}
          <div className="w-1/3 md:w-1/4 bg-black/30 p-2 rounded-lg font-mono text-sm overflow-y-auto">
            <ul>
              <FileTree 
                node={structure} 
                level={0} 
                basePath="" 
                selectedFile={selectedFile} 
                onSelectFile={handleFileSelect}
                typingFiles={typingFiles}
                completedFiles={completedFiles}
              />
            </ul>
          </div>
          {/* Code Viewer */}
          <div className="w-2/3 md:w-3/4 bg-black/30 rounded-lg flex flex-col overflow-hidden">
             <div className="flex-shrink-0 p-3 bg-black/20 rounded-t-lg border-b border-white/10 flex justify-between items-center">
                  <p className="text-sm text-gray-400 font-mono truncate">{selectedFile || 'Select a file to view'}</p>
                  <button
                    onClick={toggleTyping}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      enableTyping 
                        ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                        : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                    }`}
                  >
                    {enableTyping ? '⚡ Typing ON' : '📄 Typing OFF'}
                  </button>
             </div>
             <div className="flex-grow overflow-auto text-sm">
                  {selectedFile && enableTyping && !completedFiles.has(selectedFile) ? (
                    <TypewriterCode
                      code={code.get(selectedFile) ?? 'Error: Could not load file content.'}
                      language={getLanguage(selectedFile)}
                      speed={80} // Characters per second
                      onComplete={() => handleTypingComplete(selectedFile)}
                      className="h-full"
                    />
                  ) : (
                    <SyntaxHighlighter
                        language={getLanguage(selectedFile)}
                        style={vscDarkPlus}
                        customStyle={{
                            background: 'transparent',
                            width: '100%',
                            height: '100%',
                            padding: '1rem',
                            margin: '0',
                        }}
                        codeTagProps={{
                            style: {
                                fontFamily: '"Roboto Mono", monospace',
                            },
                        }}
                    >
                        {selectedFile ? code.get(selectedFile) ?? 'Error: Could not load file content.' : 'Select a file to view its content.'}
                    </SyntaxHighlighter>
                  )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="flex-grow rounded-lg overflow-hidden bg-gray-800">
          <SandpackWrapper code={code} structure={structure} />
        </div>
      )}
    </div>
  );
};

export default CodeView;