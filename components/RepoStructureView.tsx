import React from 'react';
import { RepoNode } from '../types';
import { FolderIcon, FileIcon, CodeIcon } from './Icons';

interface RepoStructureViewProps {
  structure: RepoNode;
  onGenerateCode: () => void;
}

const TreeNode: React.FC<{ node: RepoNode; level: number }> = ({ node, level }) => {
  const isFolder = node.type === 'folder';
  return (
    <li className="flex flex-col">
      <div className="flex items-center text-gray-300 hover:bg-white/5 py-1 rounded">
        <span style={{ paddingLeft: `${level * 24}px` }} className="mr-2">
          {isFolder 
            ? <FolderIcon className="w-5 h-5 text-indigo-400" />
            : <FileIcon className="w-5 h-5 text-gray-500" />
          }
        </span>
        <span>{node.name}</span>
      </div>
      {isFolder && node.children && (
        <ul className="pl-6 border-l border-white/10">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const RepoStructureView: React.FC<RepoStructureViewProps> = ({ structure, onGenerateCode }) => {
  return (
    <div className="w-full max-w-2xl bg-black/20 p-6 rounded-xl shadow-2xl backdrop-blur-lg border border-white/10 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
          Repository Structure
        </h2>
        <button 
          onClick={onGenerateCode}
          className="flex items-center gap-2 text-sm bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors"
        >
          <CodeIcon className="w-4 h-4" />
          Generate Code
        </button>
      </div>
      <div className="bg-black/30 p-4 rounded-lg font-mono text-sm max-h-[60vh] overflow-y-auto">
        <ul>
          <TreeNode node={structure} level={0} />
        </ul>
      </div>
    </div>
  );
};

export default RepoStructureView;