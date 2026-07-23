import React, { useState, useEffect } from 'react';
import { createNews, updateNews } from '../../services/newsService';
import { X, Save, Image, FileText } from 'lucide-react';

const CATEGORIES = [
  { hi: 'इंदौर', en: 'Indore' },
  { hi: 'मध्यप्रदेश', en: 'Madhya Pradesh' },
  { hi: 'देश', en: 'India' },
  { hi: 'विदेश', en: 'World' },
  { hi: 'सिंहस्थ', en: 'Simhastha' },
  { hi: 'टेक्नोलॉजी', en: 'Technology' },
  { hi: 'Jobs & Education', en: 'Jobs & Education' },
];

const EMPTY = {
  id: '', title_hi: '', title_en: '', summary_hi: '', summary_en: '',
  content_hi: '', content_en: '', category_hi: 'इंदौर', category_en: 'Indore',
  image: '', author_hi: '', author_en: '', publishDate_hi: '', publishDate_en: '',
  featured: false, trending: false, breaking: false, views: 0,
};

export default function AdminArticleForm({ article, onSave, onCancel }) {
  const isEdit = !!article;
  const [form, setForm] = useState(isEdit ? { ...article } : { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    setForm(isEdit ? { ...article } : { ...EMPTY });
    setError('');
  }, [article]);

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleCategoryChange = (hi) => {
    const cat = CATEGORIES.find(c => c.hi === hi);
    if (cat) { set('category_hi', cat.hi); set('category_en', cat.en); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.id || !form.title_hi || !form.title_en) {
      setError('ID, Hindi title, and English title are required.'); return;
    }
    setSaving(true);
    try {
      const result = isEdit ? await updateNews(form.id, form) : await createNews(form);
      onSave(result.data);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400";
  const labelCls = "block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wide";
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'image', label: 'Image & Flags', icon: Image },
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
        <h3 className="text-lg font-black text-zinc-900 dark:text-white">
          {isEdit ? '✏️ Edit Article' : '➕ New Article'}
        </h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === t.id
              ? 'border-red-500 text-red-600 dark:text-red-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Article ID (slug) *</label>
                <input value={form.id} onChange={e => set('id', e.target.value)} disabled={isEdit}
                  placeholder="e.g. indore-6" className={`${inputCls} ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category_hi} onChange={e => handleCategoryChange(e.target.value)} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c.hi} value={c.hi}>{c.en} / {c.hi}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Title (Hindi) *</label>
              <input value={form.title_hi} onChange={e => set('title_hi', e.target.value)} placeholder="हिंदी शीर्षक" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Title (English) *</label>
              <input value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="English headline" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Summary (Hindi)</label>
              <textarea rows={2} value={form.summary_hi} onChange={e => set('summary_hi', e.target.value)} placeholder="हिंदी सारांश" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Summary (English)</label>
              <textarea rows={2} value={form.summary_en} onChange={e => set('summary_en', e.target.value)} placeholder="English summary" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Author (Hindi)</label>
                <input value={form.author_hi} onChange={e => set('author_hi', e.target.value)} placeholder="लेखक" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Author (English)</label>
                <input value={form.author_en} onChange={e => set('author_en', e.target.value)} placeholder="Author name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Publish Date (Hindi)</label>
                <input value={form.publishDate_hi} onChange={e => set('publishDate_hi', e.target.value)} placeholder="15 जुलाई 2026" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Publish Date (English)</label>
                <input value={form.publishDate_en} onChange={e => set('publishDate_en', e.target.value)} placeholder="July 15, 2026" className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Full Content (Hindi)</label>
              <textarea rows={10} value={form.content_hi} onChange={e => set('content_hi', e.target.value)}
                placeholder="हिंदी में पूर्ण समाचार लिखें..." className={`${inputCls} resize-y`} />
            </div>
            <div>
              <label className={labelCls}>Full Content (English)</label>
              <textarea rows={10} value={form.content_en} onChange={e => set('content_en', e.target.value)}
                placeholder="Write full article in English..." className={`${inputCls} resize-y`} />
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Image URL</label>
              <input value={form.image} onChange={e => set('image', e.target.value)}
                placeholder="https://images.unsplash.com/..." className={inputCls} />
              {form.image && (
                <div className="mt-3 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 aspect-video">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
            <div>
              <label className={labelCls}>Views</label>
              <input type="number" value={form.views} onChange={e => set('views', parseInt(e.target.value) || 0)} className={inputCls} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[['featured', '⭐ Featured'], ['trending', '🔥 Trending'], ['breaking', '⚡ Breaking']].map(([field, label]) => (
                <label key={field} className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                  <input type="checkbox" checked={form[field]} onChange={e => set(field, e.target.checked)}
                    className="w-4 h-4 accent-red-500" />
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
