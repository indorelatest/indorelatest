const mongoose = require("mongoose");

const slugify = (value = "") => {
  return (
    String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `article-${Date.now().toString(36)}`
  );
};

const newsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title_hi: { type: String, required: true },
    title_en: { type: String, required: true },
    summary_hi: { type: String, default: "" },
    summary_en: { type: String, default: "" },
    content_hi: { type: String, default: "" },
    content_en: { type: String, default: "" },
    category_hi: { type: String, default: "" },
    category_en: { type: String, default: "" },

    // Extended Image Storage Metadata (Cloudflare R2)
    imageUrl: { type: String, default: "" },
    imageKey: { type: String, default: "" },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    mimeType: { type: String, default: "image/webp" },
    filename: { type: String, default: "" },

    // Fallback/Legacy image field
    image: { type: String, default: "" },

    author_hi: { type: String, default: "डेस्क" },
    author_en: { type: String, default: "Desk" },
    publishDate_hi: { type: String, default: "" },
    publishDate_en: { type: String, default: "" },

    publishedAt: { type: Date, default: Date.now },

    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    breaking: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to ensure imageUrl and image are synchronized for backward compatibility
newsSchema.pre("save", function (next) {
  if (!this.id) {
    const baseTitle = this.title_en || this.title_hi || "article";
    this.id = `${slugify(baseTitle)}-${Date.now().toString(36)}`;
  }

  if (this.imageUrl && !this.image) {
    this.image = this.imageUrl;
  } else if (this.image && !this.imageUrl) {
    this.imageUrl = this.image;
  }

  if (!this.summary_hi && this.content_hi) {
    this.summary_hi = this.content_hi.slice(0, 180);
  }

  if (!this.summary_en && this.content_en) {
    this.summary_en = this.content_en.slice(0, 180);
  }

  next();
});

// Text indexes for full-text search across both languages
newsSchema.index({
  title_hi: "text",
  title_en: "text",
  summary_hi: "text",
  summary_en: "text",
  content_hi: "text",
  content_en: "text",
});

module.exports = mongoose.model("News", newsSchema);
