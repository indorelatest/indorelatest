import React, { useState, useEffect } from "react";
import { createNews, updateNews } from "../../services/newsService";
import {
  X,
  Save,
  Image as ImageIcon,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { renderHighlightedLinks, textHasLinks } from "../../utils/linkifyText";

const CATEGORIES = [
  { hi: "इंदौर", en: "Indore" },
  { hi: "मध्यप्रदेश", en: "Madhya Pradesh" },
  { hi: "देश", en: "India" },
  { hi: "विदेश", en: "World" },
  { hi: "सिंहस्थ", en: "Simhastha" },
  { hi: "टेक्नोलॉजी", en: "Technology" },
  { hi: "नौकरी और शिक्षा", en: "Jobs & Education" },
];

const EMPTY = {
  id: "",
  title_hi: "",
  title_en: "",
  summary_hi: "",
  summary_en: "",
  content_hi: "",
  content_en: "",
  category_hi: "इंदौर",
  category_en: "Indore",
  imageUrl: "",
  imageKey: "",
  alt: "",
  caption: "",
  width: 0,
  height: 0,
  mimeType: "image/webp",
  filename: "",
  image: "",
  author_hi: "",
  author_en: "",
  publishDate_hi: "",
  publishDate_en: "",
  featured: false,
  trending: false,
  breaking: false,
  views: 0,
};

const getPreviewUrl = (articleData = {}) => {
  return articleData?.imageUrl || articleData?.image || "";
};

const ContentPreview = ({ value, label }) => {
  if (!textHasLinks(value)) return null;

  return (
    <div className="mt-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 p-3">
      <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
        {label}
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
        {String(value)
          .split("\n")
          .filter(Boolean)
          .map((line, index) => (
            <p key={index}>{renderHighlightedLinks(line)}</p>
          ))}
      </div>
    </div>
  );
};

export default function AdminArticleForm({ article, onSave, onCancel }) {
  const isEdit = !!article;
  const [form, setForm] = useState(isEdit ? { ...article } : { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(
    isEdit ? article?.imageUrl || article?.image || "" : "",
  );
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

useEffect(() => {
  console.log("Article:", article);

  setForm(isEdit ? { ...article } : { ...EMPTY });
  setError("");
  setUploadError("");
  setUploadSuccess(false);
  setPreviewUrl(isEdit ? getPreviewUrl(article) : "");
}, [article]);

  const set = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleCategoryChange = (hi) => {
    const cat = CATEGORIES.find((c) => c.hi === hi);
    if (cat) {
      set("category_hi", cat.hi);
      set("category_en", cat.en);
    }
  };

  // Direct Image Upload / Replacement for Article Editing
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "news");
    if (form.title_en || form.id) {
      formData.append("filename", form.title_en || form.id);
    }
    if (form.alt) formData.append("alt", form.alt);
    if (form.caption) formData.append("caption", form.caption);
    if (form.imageKey) formData.append("oldKey", form.imageKey);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Image upload failed");

      const data = result.data;
      setForm((prev) => ({
        ...prev,
        imageUrl: data.imageUrl, // Real CDN URL — saved to MongoDB
        imageKey: data.imageKey,
        image: data.imageUrl,
        alt: data.alt || prev.alt || prev.title_hi || "",
        caption: data.caption || prev.caption || "",
        width: data.width || 0,
        height: data.height || 0,
        mimeType: data.mimeType || "image/webp",
        filename: data.filename || "",
      }));
      // Use backend proxy URL for preview — works even if the public Cloudflare domain is unavailable
      setPreviewUrl(
        data.previewUrl ||
          getPreviewUrl({
            imageUrl: data.imageUrl,
            image: data.imageUrl,
            imageKey: data.imageKey,
          }),
      );
      setUploadSuccess(true);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const titleHi = (form.title_hi || "").trim();
    const titleEn = (form.title_en || "").trim();
    const rawId = (form.id || titleEn || titleHi || "article").trim();

    if (!titleHi || !titleEn) {
      setError("Hindi title and English title are required.");
      return;
    }

    setSaving(true);
    try {
      const idSlug =
        rawId
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `article-${Date.now().toString(36)}`;

      const payload = {
        ...form,
        id: isEdit ? form.id || rawId : idSlug,
        title_hi: titleHi,
        title_en: titleEn,
        summary_hi:
          form.summary_hi?.trim() ||
          form.content_hi?.trim().slice(0, 180) ||
          "",
        summary_en:
          form.summary_en?.trim() ||
          form.content_en?.trim().slice(0, 180) ||
          "",
        content_hi: form.content_hi?.trim() || "",
        content_en: form.content_en?.trim() || "",
        category_hi: form.category_hi || "इंदौर",
        category_en: form.category_en || "Indore",
        imageUrl: form.imageUrl || form.image,
        image: form.imageUrl || form.image,
      };

      const result = isEdit
        ? await updateNews(form.id, payload)
        : await createNews(payload);
      onSave(result.data);
    } catch (err) {
      setError(err.message || "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400";
  const labelCls =
    "block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wide";
  const tabs = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "content", label: "Content", icon: FileText },
    { id: "image", label: "Image & Cloudflare R2", icon: ImageIcon },
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
        <h3 className="text-lg font-black text-zinc-900 dark:text-white">
          {isEdit ? "✏️ Edit Article" : "➕ New Article"}
        </h3>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === t.id
                ? "border-red-500 text-red-600 dark:text-red-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {activeTab === "basic" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Article ID (slug) *</label>
                <input
                  value={form.id}
                  onChange={(e) => set("id", e.target.value)}
                  disabled={isEdit}
                  placeholder="e.g. indore-metro-gandhi-nagar"
                  className={`${inputCls} ${isEdit ? "opacity-60 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={form.category_hi}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.hi} value={c.hi}>
                      {c.en} / {c.hi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Title (Hindi) *</label>
              <input
                value={form.title_hi}
                onChange={(e) => set("title_hi", e.target.value)}
                placeholder="हिंदी शीर्षक"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Title (English) *</label>
              <input
                value={form.title_en}
                onChange={(e) => set("title_en", e.target.value)}
                placeholder="English headline"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Summary (Hindi)</label>
              <textarea
                rows={2}
                value={form.summary_hi}
                onChange={(e) => set("summary_hi", e.target.value)}
                placeholder="हिंदी सारांश"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Summary (English)</label>
              <textarea
                rows={2}
                value={form.summary_en}
                onChange={(e) => set("summary_en", e.target.value)}
                placeholder="English summary"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Author (Hindi)</label>
                <input
                  value={form.author_hi}
                  onChange={(e) => set("author_hi", e.target.value)}
                  placeholder="लेखक"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Author (English)</label>
                <input
                  value={form.author_en}
                  onChange={(e) => set("author_en", e.target.value)}
                  placeholder="Author name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Publish Date (Hindi)</label>
                <input
                  value={form.publishDate_hi}
                  onChange={(e) => set("publishDate_hi", e.target.value)}
                  placeholder="15 जुलाई 2026"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Publish Date (English)</label>
                <input
                  value={form.publishDate_en}
                  onChange={(e) => set("publishDate_en", e.target.value)}
                  placeholder="July 15, 2026"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Full Content (Hindi)</label>
              <textarea
                rows={10}
                value={form.content_hi}
                onChange={(e) => set("content_hi", e.target.value)}
                placeholder="हिंदी में पूर्ण समाचार लिखें..."
                className={`${inputCls} resize-y`}
              />
              <ContentPreview value={form.content_hi} label="Hindi Link Preview" />
            </div>
            <div>
              <label className={labelCls}>Full Content (English)</label>
              <textarea
                rows={10}
                value={form.content_en}
                onChange={(e) => set("content_en", e.target.value)}
                placeholder="Write full article in English..."
                className={`${inputCls} resize-y`}
              />
              <ContentPreview value={form.content_en} label="English Link Preview" />
            </div>
          </div>
        )}

        {activeTab === "image" && (
          <div className="space-y-6">
            {/* Cloudflare R2 Drag & Drop / Upload Box */}
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center hover:border-red-500 transition-colors bg-zinc-50 dark:bg-zinc-900/50">
              <input
                type="file"
                id="file-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-red-600 dark:text-red-400 mb-1" />
                )}
                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {uploading
                    ? "Uploading Image..."
                    : isEdit
                      ? "Click to Replace Article Image (JPG, PNG, WebP)"
                      : "Click to Upload Image (JPG, PNG, WebP)"}
                </div>
                <p className="text-xs text-zinc-500">
                  Image will be auto-converted to WebP & optimized
                </p>
              </label>
            </div>

            {uploadSuccess && (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  New image uploaded & attached to article! Click "Update
                  Article" below to save changes.
                </span>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Cloudflare R2 Image URL */}
            <div>
              <label className={labelCls}>Image URL</label>
              <input
                value={form.imageUrl || form.image}
                onChange={(e) => {
                  set("imageUrl", e.target.value);
                  set("image", e.target.value);
                }}
                placeholder="https://images.indorelatest.com/news/indore-metro.webp"
                className={inputCls}
              />
            </div>

            {/* Image SEO Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Alt Text (SEO)</label>
                <input
                  value={form.alt}
                  onChange={(e) => set("alt", e.target.value)}
                  placeholder="e.g. इंदौर मेट्रो ट्रेन गांधी नगर स्टेशन"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Caption</label>
                <input
                  value={form.caption}
                  onChange={(e) => set("caption", e.target.value)}
                  placeholder="Image caption display under article"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Filename (R2 Key)</label>
                <input
                  value={form.filename || form.imageKey}
                  onChange={(e) => set("filename", e.target.value)}
                  placeholder="indore-metro-gandhi-nagar.webp"
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Width (px)</label>
                  <input
                    type="number"
                    value={form.width || 0}
                    onChange={(e) =>
                      set("width", parseInt(e.target.value) || 0)
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Height (px)</label>
                  <input
                    type="number"
                    value={form.height || 0}
                    onChange={(e) =>
                      set("height", parseInt(e.target.value) || 0)
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview — uses backend proxy URL so it works even without CDN domain */}
            {previewUrl && (
              <div className="space-y-2">
                <span className={labelCls}>Image Preview</span>
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 aspect-video max-h-64">
                  
                  <img
                    src={previewUrl}
                    alt={form.alt || "Preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If proxy fails, try the direct CDN URL
                      if (e.target.src !== form.imageUrl && form.imageUrl) {
                        e.target.src = form.imageUrl;
                      } else {
                        e.target.style.display = "none";
                      }
                    }}
                  />
                  {form.width > 0 && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
                      {form.width} x {form.height} px
                    </span>
                  )}
                </div>
                {form.caption && (
                  <p className="text-xs text-zinc-500 italic text-center">
                    {form.caption}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className={labelCls}>Views</label>
              <input
                type="number"
                value={form.views}
                onChange={(e) => set("views", parseInt(e.target.value) || 0)}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                ["featured", "⭐ Featured"],
                ["trending", "🔥 Trending"],
                ["breaking", "⚡ Breaking"],
              ].map(([field, label]) => (
                <label
                  key={field}
                  className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={(e) => set(field, e.target.checked)}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Article"
                : "Create Article"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
