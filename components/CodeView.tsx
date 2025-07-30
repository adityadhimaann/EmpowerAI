import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RepoNode, GeneratedCode } from '../types';
import { FolderIcon, FileIcon, RefreshCwIcon, ArchiveIcon, CodeIcon, EyeIcon, SearchIcon, CopyIcon, EditIcon } from './Icons';
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
  expandedFolders?: Set<string>;
  onToggleFolder?: (path: string) => void;
}> = ({ 
  node, 
  level, 
  basePath, 
  selectedFile, 
  onSelectFile, 
  typingFiles = new Set(), 
  completedFiles = new Set(),
  expandedFolders = new Set(),
  onToggleFolder
}) => {
  const isFolder = node.type === 'folder';
  const currentPath = basePath ? `${basePath}/${node.name}` : node.name;
  const isTyping = typingFiles.has(currentPath);
  const isCompleted = completedFiles.has(currentPath);
  const isExpanded = expandedFolders.has(currentPath);

  const handleFolderClick = () => {
    if (isFolder && onToggleFolder) {
      onToggleFolder(currentPath);
    }
  };

  return (
    <li className="flex flex-col select-none">
      <div
        className={`flex items-center py-1.5 px-2 rounded cursor-pointer transition-all duration-200 ${
          !isFolder && selectedFile === currentPath 
            ? 'bg-indigo-500/30 border-l-2 border-indigo-400' 
            : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${level * 0.75 + 0.5}rem` }}
        onClick={() => isFolder ? handleFolderClick() : onSelectFile(currentPath)}
      >
        <span className="flex items-center mr-2 text-blue-400">
          {isFolder ? (
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
              <FolderIcon className="w-4 h-4" />
            </div>
          ) : (
            <>
              <FileIcon className="w-4 h-4" />
              {/* Status indicators */}
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
        <span className="truncate text-sm">{node.name}</span>
      </div>
      {isFolder && node.children && isExpanded && (
        <ul className="ml-2 border-l border-white/10">
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
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([structure.name]));
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand root folder and first level on mount
  useEffect(() => {
    const autoExpand = new Set([structure.name]);
    if (structure.children) {
      structure.children.forEach(child => {
        if (child.type === 'folder') {
          autoExpand.add(`${structure.name}/${child.name}`);
        }
      });
    }
    setExpandedFolders(autoExpand);
  }, [structure]);

  // Handle typing completion
  const handleTypingComplete = useCallback((filePath: string) => {
    setCompletedFiles(prev => new Set([...prev, filePath]));
    setTypingFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(filePath);
      return newSet;
    });
  }, []);

  // Handle file selection with typing animation
  const handleFileSelect = useCallback((filePath: string) => {
    setSelectedFile(filePath);
    setIsEditing(false);
    setEditedCode('');
    if (enableTyping && !completedFiles.has(filePath)) {
      setTypingFiles(prev => new Set([...prev, filePath]));
    }
  }, [enableTyping, completedFiles]);

  // Handle folder toggle
  const handleToggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  }, []);

  // Toggle typing animation
  const toggleTyping = useCallback(() => {
    setEnableTyping(prev => !prev);
  }, []);

  // Handle code editing
  const handleEditCode = useCallback(() => {
    if (selectedFile) {
      setIsEditing(true);
      setEditedCode(code.get(selectedFile) || '');
    }
  }, [selectedFile, code]);

  // Save edited code
  const handleSaveCode = useCallback(() => {
    if (selectedFile && editedCode !== undefined) {
      code.set(selectedFile, editedCode);
      setIsEditing(false);
      setCompletedFiles(prev => new Set([...prev, selectedFile]));
    }
  }, [selectedFile, editedCode, code]);

  // Copy code to clipboard
  const handleCopyCode = useCallback(async () => {
    if (selectedFile) {
      const currentCode = isEditing ? editedCode : code.get(selectedFile) || '';
      try {
        await navigator.clipboard.writeText(currentCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  }, [selectedFile, code, isEditing, editedCode]);

  // Search functionality
  const filteredFiles = useCallback(() => {
    if (!searchTerm) return null;
    
    const searchFiles = (node: RepoNode, path: string): string[] => {
      const currentPath = path ? `${path}/${node.name}` : node.name;
      let results: string[] = [];
      
      if (node.type === 'file' && node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(currentPath);
      }
      
      if (node.children) {
        node.children.forEach(child => {
          results.push(...searchFiles(child, currentPath));
        });
      }
      
      return results;
    };
    
    return searchFiles(structure, '');
  }, [searchTerm, structure]);

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
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          activeTab === tabName 
            ? 'bg-indigo-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
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
                className="flex items-center gap-2 text-sm bg-green-600/90 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-500 hover:shadow-lg transition-all duration-200"
                >
                <ArchiveIcon className="w-4 h-4" />
                Download .zip
            </button>
            <button
                onClick={onReset}
                className="flex items-center gap-2 text-sm bg-indigo-600/90 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-500 hover:shadow-lg transition-all duration-200"
                >
                <RefreshCwIcon className="w-4 h-4" />
                Start Over
            </button>
        </div>
      </div>
      
      {activeTab === 'explorer' && (
        <div className="flex-grow flex gap-4 min-h-0 overflow-hidden">
          {/* File Tree */}
          <div className="w-1/3 md:w-1/4 bg-black/30 rounded-lg flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="flex-shrink-0 p-3 border-b border-white/10">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* File Tree or Search Results */}
            <div className="flex-grow overflow-y-auto p-2 font-mono text-sm custom-scrollbar">
              {searchTerm ? (
                <div>
                  <p className="text-gray-400 text-xs mb-2 px-2">Search Results:</p>
                  <ul>
                    {filteredFiles()?.map((filePath, index) => (
                      <li key={index}>
                        <div
                          className={`flex items-center py-1.5 px-2 rounded cursor-pointer transition-all duration-200 ${
                            selectedFile === filePath 
                              ? 'bg-indigo-500/30 border-l-2 border-indigo-400' 
                              : 'hover:bg-white/5'
                          }`}
                          onClick={() => handleFileSelect(filePath)}
                        >
                          <FileIcon className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="truncate text-sm">{filePath.split('/').pop()}</span>
                        </div>
                      </li>
                    )) || (
                      <li className="text-gray-500 text-sm px-2">No files found</li>
                    )}
                  </ul>
                </div>
              ) : (
                <ul>
                  <FileTree 
                    node={structure} 
                    level={0} 
                    basePath="" 
                    selectedFile={selectedFile} 
                    onSelectFile={handleFileSelect}
                    typingFiles={typingFiles}
                    completedFiles={completedFiles}
                    expandedFolders={expandedFolders}
                    onToggleFolder={handleToggleFolder}
                  />
                </ul>
              )}
            </div>
          </div>
          
          {/* Code Viewer */}
          <div className="w-2/3 md:w-3/4 bg-black/30 rounded-lg flex flex-col overflow-hidden">
             <div className="flex-shrink-0 p-3 bg-black/20 rounded-t-lg border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 font-mono truncate">{selectedFile || 'Select a file to view'}</p>
                    {copySuccess && (
                      <span className="text-xs text-green-400 animate-pulse">Copied!</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedFile && (
                      <>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded transition-colors"
                          title="Copy code"
                        >
                          <CopyIcon className="w-3 h-3" />
                          Copy
                        </button>
                        <button
                          onClick={isEditing ? handleSaveCode : handleEditCode}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                            isEditing 
                              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                              : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                          }`}
                          title={isEditing ? "Save changes" : "Edit code"}
                        >
                          <EditIcon className="w-3 h-3" />
                          {isEditing ? 'Save' : 'Edit'}
                        </button>
                      </>
                    )}
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
             </div>
             
             <div className="flex-grow overflow-hidden">
                  {selectedFile && isEditing ? (
                    /* Code Editor */
                    <textarea
                      ref={codeRef}
                      value={editedCode}
                      onChange={(e) => setEditedCode(e.target.value)}
                      className="w-full h-full p-4 bg-transparent text-sm font-mono text-white placeholder-gray-400 resize-none focus:outline-none custom-scrollbar"
                      style={{ fontFamily: '"Roboto Mono", monospace' }}
                      placeholder="Start typing your code..."
                    />
                  ) : selectedFile && enableTyping && !completedFiles.has(selectedFile) ? (
                    /* Typewriter Animation */
                    <div className="h-full overflow-auto custom-scrollbar">
                      <TypewriterCode
                        code={code.get(selectedFile) ?? 'Error: Could not load file content.'}
                        language={getLanguage(selectedFile)}
                        speed={80}
                        onComplete={() => handleTypingComplete(selectedFile)}
                        className="h-full"
                      />
                    </div>
                  ) : (
                    /* Static Code Display */
                    <div className="h-full overflow-auto custom-scrollbar">
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
                    </div>
                  )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="flex-grow rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm">
          <SandpackWrapper code={code} structure={structure} />
        </div>
      )}
    </div>
  );
};

export default CodeView;