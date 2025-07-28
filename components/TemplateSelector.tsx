import React, { useState } from 'react';
import { TemplateData } from '../types';
import { SearchIcon, EyeIcon } from './Icons';

interface TemplateSelectorProps {
  onSelectTemplate: (template: TemplateData) => void;
  onClose: () => void;
}

const mockTemplates: TemplateData[] = [
  {
    id: '1',
    name: 'Startup Pitch Deck',
    description: 'Perfect for presenting your startup idea to investors',
    category: 'business',
    thumbnail: '🚀',
    slides: [
      { title: 'Problem Statement', content: ['What problem are you solving?'] },
      { title: 'Solution', content: ['Your innovative solution'] },
      { title: 'Market Size', content: ['Total addressable market'] },
      { title: 'Business Model', content: ['How you make money'] },
      { title: 'Traction', content: ['Progress and milestones'] },
    ]
  },
  {
    id: '2',
    name: 'Product Launch',
    description: 'Showcase your new product to the market',
    category: 'marketing',
    thumbnail: '📱',
    slides: [
      { title: 'Product Overview', content: ['What makes it special?'] },
      { title: 'Key Features', content: ['Main benefits and features'] },
      { title: 'Target Audience', content: ['Who will use this?'] },
      { title: 'Launch Strategy', content: ['Go-to-market plan'] },
    ]
  },
  {
    id: '3',
    name: 'Tech Architecture',
    description: 'Present your technical architecture and design',
    category: 'tech',
    thumbnail: '⚙️',
    slides: [
      { title: 'System Overview', content: ['High-level architecture'] },
      { title: 'Technology Stack', content: ['Tools and frameworks'] },
      { title: 'Data Flow', content: ['How data moves through system'] },
      { title: 'Scalability', content: ['Growth and performance'] },
    ]
  },
  {
    id: '4',
    name: 'Educational Course',
    description: 'Structure for educational presentations',
    category: 'education',
    thumbnail: '📚',
    slides: [
      { title: 'Learning Objectives', content: ['What students will learn'] },
      { title: 'Course Outline', content: ['Main topics and modules'] },
      { title: 'Interactive Elements', content: ['Hands-on activities'] },
      { title: 'Assessment', content: ['How progress is measured'] },
    ]
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const categories = ['all', 'business', 'tech', 'education', 'marketing', 'personal'];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-500/20 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
            <p className="text-blue-300/70">Start with a professional template and customize it</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-600/50 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-blue-500/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className={`group relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border border-blue-500/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] cursor-pointer ${
                  hoveredTemplate === template.id ? 'ring-2 ring-blue-500/50' : ''
                }`}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => onSelectTemplate(template)}
              >
                {/* Template Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-6xl">
                  {template.thumbnail}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {template.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.category === 'business' ? 'bg-green-500/20 text-green-400' :
                      template.category === 'tech' ? 'bg-blue-500/20 text-blue-400' :
                      template.category === 'education' ? 'bg-purple-500/20 text-purple-400' :
                      template.category === 'marketing' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  <p className="text-blue-300/70 text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-blue-400">
                    <span>{template.slides.length} slides</span>
                    <div className="flex items-center gap-2">
                      <EyeIcon className="w-4 h-4" />
                      <span>Preview</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-blue-600/10 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-500/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-300/70">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
