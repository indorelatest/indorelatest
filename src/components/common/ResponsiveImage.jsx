import React, { useState } from "react";
import {
  getSrcSet,
  getOptimizedImageUrl,
  DEFAULT_SIZES,
} from "../../utils/imageUtils";

export default function ResponsiveImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
  sizes = DEFAULT_SIZES,
  caption,
  onError,
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-sans p-4 rounded-lg ${className}`}
      >
        <span>{alt || "इन्दौर लेटेस्ट"}</span>
      </div>
    );
  }

  const srcSet = getSrcSet(src);
  const fallbackSrc = getOptimizedImageUrl(src, 800);
  const resolvedSrc = fallbackSrc || src;

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <figure className="m-0 p-0 w-full h-full relative group">
      <img
        src={resolvedSrc}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchpriority={fetchPriority}
        onError={handleError}
        className={className}
      />
      {caption && (
        <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 px-1 text-center italic font-sans">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
