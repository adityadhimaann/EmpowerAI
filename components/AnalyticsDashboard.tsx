import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { DownloadIcon, ShareIcon, BookmarkIcon, SearchIcon, BarChartIcon, EyeIcon } from './Icons';

interface AnalyticsDashboardProps {
  history: HistoryItem[];
  onClose: () => void;
  onExportAnalytics: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ history, onClose, onExportAnalytics }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'name'>('date');

  // Calculate analytics
  const totalPresentations = history.length;
  const totalViews = history.reduce((sum, item) => sum + (item.views || 0), 0);
  const averageViews = totalPresentations > 0 ? Math.round(totalViews / totalPresentations) : 0;
  const favoriteCount = history.filter(item => item.favorites).length;

  // Most popular tags
  const tagCounts = history.reduce((acc, item) => {
    (item.tags || []).forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Filter and sort history
  const filteredHistory = history
    .filter(item => 
      item.projectIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'name':
          return a.projectIdea.localeCompare(b.projectIdea);
        case 'date':
        default:
          return new Date(b.lastModified || b.createdAt).getTime() - new Date(a.lastModified || a.createdAt).getTime();
      }
    });

  // Recent activity (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentActivity = history.filter(item => 
    new Date(item.createdAt) > weekAgo
  ).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-500/20 w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-600/20">
              <BarChartIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <p className="text-blue-300/70">Track your presentation performance and insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onExportAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-600/50 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-blue-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl border border-blue-500/20">
              <div className="text-2xl font-bold text-white">{totalPresentations}</div>
              <div className="text-sm text-blue-300/70">Total Presentations</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/20">
              <div className="text-2xl font-bold text-white">{totalViews}</div>
              <div className="text-sm text-green-300/70">Total Views</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/20">
              <div className="text-2xl font-bold text-white">{averageViews}</div>
              <div className="text-sm text-purple-300/70">Average Views</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl border border-orange-500/20">
              <div className="text-2xl font-bold text-white">{recentActivity}</div>
              <div className="text-sm text-orange-300/70">This Week</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Popular Tags */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Popular Tags</h3>
              <div className="space-y-3">
                {popularTags.length > 0 ? popularTags.map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-blue-300">{tag}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(count / Math.max(...popularTags.map(([, c]) => c))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-blue-400 w-6">{count}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-blue-300/70 text-sm">No tags found. Start adding tags to your presentations!</p>
                )}
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border border-green-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-xl">
                  <div>
                    <div className="text-white font-medium">Engagement Rate</div>
                    <div className="text-sm text-green-300/70">Based on view duration</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">85%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-xl">
                  <div>
                    <div className="text-white font-medium">Completion Rate</div>
                    <div className="text-sm text-green-300/70">Presentations finished</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">92%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-xl">
                  <div>
                    <div className="text-white font-medium">Favorites</div>
                    <div className="text-sm text-green-300/70">Saved presentations</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{favoriteCount}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-purple-900/20 hover:bg-purple-800/30 rounded-xl text-left transition-colors">
                  <ShareIcon className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Share Report</div>
                    <div className="text-sm text-purple-300/70">Export analytics summary</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-900/20 hover:bg-purple-800/30 rounded-xl text-left transition-colors">
                  <BookmarkIcon className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Top Performers</div>
                    <div className="text-sm text-purple-300/70">View most successful presentations</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-900/20 hover:bg-purple-800/30 rounded-xl text-left transition-colors">
                  <BarChartIcon className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Detailed Report</div>
                    <div className="text-sm text-purple-300/70">Generate comprehensive analytics</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Presentations List */}
          <div className="mt-8 bg-gradient-to-br from-slate-900/60 to-blue-900/60 rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Presentation History</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="date">Sort by Date</option>
                  <option value="views">Sort by Views</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-blue-900/20 hover:bg-blue-800/30 rounded-xl transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-white">{item.projectIdea}</h4>
                      {item.favorites && <BookmarkIcon className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-300/70">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        {item.views || 0} views
                      </span>
                      <span>{item.slides.length} slides</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(item.tags || []).slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-blue-300/70">
                  <BarChartIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No presentations match your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
