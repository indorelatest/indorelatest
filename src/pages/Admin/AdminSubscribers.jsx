import React, { useState, useEffect } from 'react';
import { fetchSubscribers, unsubscribe } from '../../services/newsService';
import { Users, Trash2, CheckCircle, XCircle, Download } from 'lucide-react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers()
      .then(r => { setSubscribers(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleUnsub = async (email) => {
    if (!window.confirm(`Unsubscribe ${email}?`)) return;
    await unsubscribe(email);
    setSubscribers(prev => prev.map(s => s.email === email ? { ...s, isActive: false } : s));
  };

  const exportCSV = () => {
    const csv = ['Email,Status,Date'].concat(
      subscribers.map(s => `${s.email},${s.isActive ? 'Active' : 'Inactive'},${new Date(s.createdAt).toLocaleDateString()}`)
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
  };

  const active = subscribers.filter(s => s.isActive).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Subscribers</h2>
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">{active} active</span>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />)}</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16 text-zinc-400"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No subscribers yet</p></div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Email</th>
                  <th className="text-center px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">Subscribed</th>
                  <th className="text-center px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {subscribers.map((sub, i) => (
                  <tr key={sub._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/40 transition-colors">
                    <td className="px-4 py-3 text-zinc-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{sub.email}</td>
                    <td className="px-4 py-3 text-center">
                      {sub.isActive
                        ? <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold"><CheckCircle className="w-3.5 h-3.5" />Active</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-zinc-400 font-semibold"><XCircle className="w-3.5 h-3.5" />Inactive</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs hidden sm:table-cell">
                      {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sub.isActive && (
                        <button onClick={() => handleUnsub(sub.email)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 transition-colors" title="Unsubscribe">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
