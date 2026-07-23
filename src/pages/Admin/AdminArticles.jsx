import React, { useState, useEffect } from 'react';
import { fetchAllNews, deleteNews, updateNews } from '../../services/newsService';
import { Trash2, Edit, Eye, Star, TrendingUp, Zap, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export default function AdminArticles({ onEdit }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadArticles = () => {
    setLoading(true);
    fetchAllNews().then(r => { setArticles(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadArticles(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await deleteNews(id); setArticles(prev => prev.filter(a => a.id !== id)); }
    catch (e) { alert('Delete failed: ' + e.message); }
  };

  const toggleField = async (article, field) => {
    try {
      const updated = await updateNews(article.id, { [field]: !article[field] });
      setArticles(prev => prev.map(a => a.id === article.id ? updated.data : a));
    } catch (e) { alert('Update failed'); }
  };

  const categories = [...new Set(articles.map(a => a.category_en))].sort();

  const filtered = articles.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.title_en?.toLowerCase().includes(q) || a.title_hi?.includes(q);
    const matchCat = !categoryFilter || a.category_en === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">All Articles ({filtered.length})</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="pl-9 pr-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 w-52" />
          </div>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
        ))}</div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden md:table-cell">Category</th>
                  <th className="text-center px-3 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">Views</th>
                  <th className="text-center px-3 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Flags</th>
                  <th className="text-center px-3 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {paginated.map(article => (
                  <tr key={article.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900 dark:text-white line-clamp-1">{article.title_en}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{article.title_hi}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded-full">{article.category_en}</span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <Eye className="w-3.5 h-3.5" />{article.views}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => toggleField(article, 'featured')} title="Toggle Featured"
                          className={`p-1 rounded ${article.featured ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-600 hover:text-yellow-400'}`}>
                          <Star className="w-4 h-4" fill={article.featured ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => toggleField(article, 'trending')} title="Toggle Trending"
                          className={`p-1 rounded ${article.trending ? 'text-orange-500' : 'text-zinc-300 dark:text-zinc-600 hover:text-orange-400'}`}>
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleField(article, 'breaking')} title="Toggle Breaking"
                          className={`p-1 rounded ${article.breaking ? 'text-red-500' : 'text-zinc-300 dark:text-zinc-600 hover:text-red-400'}`}>
                          <Zap className="w-4 h-4" fill={article.breaking ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEdit(article)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(article.id)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-700">
              <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
