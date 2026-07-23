import React, { useState, useEffect } from 'react';
import { fetchStats } from '../../services/newsService';
import { BarChart2, FileText, TrendingUp, Eye, Star, Zap, Users, Mail } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-green-500' },
    { label: 'Featured', value: stats.featuredCount, icon: Star, color: 'bg-yellow-500' },
    { label: 'Trending', value: stats.trendingCount, icon: TrendingUp, color: 'bg-orange-500' },
    { label: 'Breaking', value: stats.breakingCount, icon: Zap, color: 'bg-red-500' },
    { label: 'Categories', value: stats.categoryStats?.length || 0, icon: BarChart2, color: 'bg-purple-500' },
  ] : [];

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 flex items-center gap-4">
            <div className={`${color} p-3 rounded-lg`}><Icon className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {stats?.categoryStats?.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-white">Category Breakdown</h3>
          <div className="space-y-3">
            {stats.categoryStats.map(cat => (
              <div key={cat._id} className="flex items-center gap-3">
                <span className="w-32 text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">{cat._id}</span>
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-red-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((cat.count / (stats.totalArticles || 1)) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-8 text-right">{cat.count}</span>
                <span className="text-xs text-zinc-400 w-16 text-right">{cat.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
