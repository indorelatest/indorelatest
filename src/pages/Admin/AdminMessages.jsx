import React, { useState, useEffect } from 'react';
import { fetchAllContacts, markContactRead, deleteContact } from '../../services/newsService';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    fetchAllContacts().then(r => { setMessages(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (msg) => {
    if (msg.isRead) return;
    await markContactRead(msg._id);
    setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
    setSelected(prev => prev?._id === msg._id ? { ...prev, isRead: true } : prev);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await deleteContact(id);
    setMessages(prev => prev.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Messages</h2>
        {unread > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} new</span>}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-zinc-400"><Mail className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No messages yet</p></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* List */}
          <div className="space-y-2">
            {messages.map(msg => (
              <div key={msg._id}
                onClick={() => { setSelected(msg); handleRead(msg); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selected?._id === msg._id
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : msg.isRead
                    ? 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300'
                    : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                      <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{msg.name}</p>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{msg.email}</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 truncate">{msg.subject}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {msg.isRead ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg._id); }}
                      className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">{new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-4 sticky top-4">
                <div className="border-b border-zinc-100 dark:border-zinc-700 pb-4">
                  <h4 className="font-black text-lg text-zinc-900 dark:text-white">{selected.subject}</h4>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-1">{selected.name} — <a href={`mailto:${selected.email}`} className="text-red-500 hover:underline">{selected.email}</a></p>
                  <p className="text-xs text-zinc-400 mt-1">{new Date(selected.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors">
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-sm">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
