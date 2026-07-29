import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminArticles from './AdminArticles';
import AdminArticleForm from './AdminArticleForm';
import AdminMessages from './AdminMessages';
import AdminSubscribers from './AdminSubscribers';
import { verifyAdminPasscode } from '../../services/newsService';
import { LayoutDashboard, FileText, Mail, Users, Key, LogOut } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await verifyAdminPasscode(passcode);
      if (response.success) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
      } else {
        setError('Invalid passcode. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPasscode('');
  };

  // If not authenticated, show the PIN/passcode gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Admin Access Gate</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter the administration passcode to manage Indore Latest.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs px-4 py-3 rounded-lg text-center font-semibold">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. admin123)"
                className="w-full px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-center font-bold tracking-widest placeholder-zinc-400 placeholder:font-normal placeholder:tracking-normal"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] cursor-pointer"
            >
              Verify Passcode
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-xl text-zinc-900 dark:text-white tracking-wider uppercase">
              Indore Latest
            </h1>
            <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">
              Control Panel
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setEditingArticle(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === item.id && !editingArticle
                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {activeTab === 'articles' && !editingArticle && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setEditingArticle({})}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              + Create Article
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {editingArticle ? (
          <AdminArticleForm
            article={editingArticle.id ? editingArticle : null}
            onSave={(saved) => {
              setEditingArticle(null);
              setActiveTab('articles');
            }}
            onCancel={() => setEditingArticle(null)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'articles' && (
              <AdminArticles
                onEdit={(article) => setEditingArticle(article)}
              />
            )}
            {activeTab === 'messages' && <AdminMessages />}
            {activeTab === 'subscribers' && <AdminSubscribers />}
          </>
        )}
      </main>
    </div>
  );
}
